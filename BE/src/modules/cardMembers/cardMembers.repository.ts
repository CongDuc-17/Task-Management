import { PrismaService } from '../database';
export class CardMembersRepository {
	constructor(private readonly prismaService = new PrismaService()) {}

	async addMemberToCard(cardId: string, userId: string) {
		return this.prismaService.cardMembers.create({
			data: {
				cardId: cardId,
				userId: userId,
			},
		});
	}

	async findMemberOnCard(cardId: string, userId: string) {
		return this.prismaService.cardMembers.findFirst({
			where: {
				cardId: cardId,
				userId: userId,
			},
		});
	}

	async removeMemberFromCard(cardId: string, userId: string) {
		return this.prismaService.cardMembers.deleteMany({
			where: {
				cardId: cardId,
				userId: userId,
			},
		});
	}
}
