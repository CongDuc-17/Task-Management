import { UserStatusEnum } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';

import { UsersRepository } from '@/modules/users/users.repository';
import { RolesRepository } from '@/modules/roles/roles.repository';
import { UserRoleRepository } from '@/modules/userRole/userRole.repository';

import { AuthRepository } from '../auth.repository';

import { InternalServerException, OptionalException } from '@/common';
import { GoogleOauthConfig } from '@/configs';
import { UserRoleEnum } from '@/common/enums/roles';
import { socialAccountsWithPartialRelations } from '@/models';

export class GoogleOauthStrategy {
	constructor(
		private readonly authRepository = new AuthRepository(),
		private readonly usersRepository = new UsersRepository(),
		private readonly rolesRepository = new RolesRepository(),
		private readonly userRoleRepository = new UserRoleRepository(),
	) {
		this.authRepository = authRepository;

		passport.use(
			'google',
			new Strategy(
				{
					clientID: GoogleOauthConfig.clientId,
					clientSecret: GoogleOauthConfig.clientSecret,
					callbackURL: GoogleOauthConfig.redirectUri,
					scope: ['email', 'profile'],
				},
				this.validate.bind(this),
			),
		);
	}

	private async ensureDefaultSystemRole(userId: string): Promise<void> {
		const existingRoleId = await this.rolesRepository.findRoleIdByUserId(userId);
		if (existingRoleId) return;

		const userRole = await this.rolesRepository.findByName(UserRoleEnum.USER);
		if (!userRole) {
			throw new InternalServerException();
		}

		await this.userRoleRepository.assignUserRole(userId, userRole.id);
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: VerifyCallback,
	): Promise<void> {
		try {
			const email = profile.emails?.[0]?.value;
			if (!email) {
				return done(
					new OptionalException(
						StatusCodes.BAD_REQUEST,
						'Google account has no email',
					),
					false,
				);
			}
			const user = {
				googleId: profile.id,
				email: profile.emails?.[0]?.value || '',
				name: profile.displayName,
				avatar: profile.photos?.[0]?.value,
				verified: profile.emails?.[0]?.verified || false,
			};

			let existingUser = await this.usersRepository.findUser({
				email: user.email,
			});

			let socialAccount: socialAccountsWithPartialRelations | null;

			if (!existingUser) {
				socialAccount = await this.authRepository.createSocialAccount({
					socialAccount: {
						googleId: user.googleId,
						googleAccessToken: accessToken,
						googleRefreshToken: refreshToken,
						user: {
							create: {
								email: user.email,
								name: user.name,
								avatar: user.avatar,
								verify: true,
							},
						},
					},
				});

				await this.ensureDefaultSystemRole(socialAccount.userId);
			} else {
				if (existingUser.status === UserStatusEnum.LOCKED) {
					throw new OptionalException(
						StatusCodes.FORBIDDEN,
						'Your account has been locked',
					);
				}

				socialAccount = await this.authRepository.findSocialAccount({
					email: user.email,
				});

				if (!socialAccount) {
					socialAccount = await this.authRepository.createSocialAccount({
						socialAccount: {
							googleId: user.googleId,
							googleAccessToken: accessToken,
							googleRefreshToken: refreshToken,
							user: {
								connect: {
									id: existingUser.id,
								},
							},
						},
					});
				} else {
					socialAccount = await this.authRepository.updateSocialAccount({
						googleId: user.googleId,
						googleAccessToken: accessToken,
						googleRefreshToken:
							refreshToken ?? socialAccount.googleRefreshToken,
					});
				}

				await this.ensureDefaultSystemRole(existingUser.id);
			}

			if (!socialAccount) {
				return done(new InternalServerException(), false);
			}

			return done(null, { socialAccountInformation: socialAccount });
		} catch (err) {
			return done(
				err instanceof Error ? err : new InternalServerException(),
				false,
			);
		}
	}
}
