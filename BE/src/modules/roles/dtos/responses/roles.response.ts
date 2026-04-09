import { z } from 'zod';
export class RoleResponseDto {
	id: string;
	name: string;

	constructor(data: any) {
		this.id = data.id;
		this.name = data.name;
	}
}
export const roleResponseDtoSchema = z.object({
	id: z.string(),
	name: z.string(),
});
