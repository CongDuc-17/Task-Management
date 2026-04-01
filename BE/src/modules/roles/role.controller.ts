import { NextFunction, Request, Response } from 'express';
import { RolesService } from './roles.service';
export class RoleController {
	constructor(private readonly rolesService = new RolesService()) {}
	async getAllRoles(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.rolesService.getAllRoles();
			res.status(result.code).json({
				success: result.success,
				message: result.message,
				data: result.data,
			});
		} catch (error) {
			next(error);
		}
	}
}
