import z, { optional } from 'zod';

import { ZodValidationSchema } from '@/common';
import { de } from 'zod/v4/locales';

export class UpdateMyInformationRequestDto {
	name?: string;
	email?: string;
	bio?: string;
	avatar?: string;
	address?: string;

	constructor(data: Partial<UpdateMyInformationRequestDto> = {}) {
		this.name = data.name;
		this.email = data.email;
		this.bio = data.bio;
		this.avatar = data.avatar;
		this.address = data.address;
	}
}

const emptyStringToUndefined = (val: unknown) => {
	if (typeof val === 'string' && val.trim() === '') {
		return undefined;
	}
	return val;
};

const updateMyInformationRequestBody = z
	.object({
		name: z.preprocess(emptyStringToUndefined, z.string().optional()),
		email: z.preprocess(emptyStringToUndefined, z.string().email().optional()),
		bio: z.preprocess(emptyStringToUndefined, z.string().optional()),
		address: z.preprocess(emptyStringToUndefined, z.string().optional()),
		avatar: z.any().optional(),
	})
	.strict();

export const updateMyInformationRequestValidationSchema: ZodValidationSchema = {
	body: updateMyInformationRequestBody,
};

const swaggerMultipartSchema = z.object({
	name: z.string().optional(),
	email: z.string().email().optional(),
	bio: z.string().optional(),
	address: z.string().optional(),
	avatar: z
		.string()
		.openapi({
			format: 'binary',
			description: 'Optional avatar image file',
		})
		.optional(),
});

export const updateMyInformationRequestSchema = {
	body: {
		description: 'Update my information with optional avatar',
		content: {
			'multipart/form-data': {
				schema: swaggerMultipartSchema,
			},
		},
	},
};
