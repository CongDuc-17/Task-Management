import { RolesRepository } from './roles.repository';
import { ServiceResponse, ResponseStatus } from '@/common/dtos';

import { StatusCodes } from 'http-status-codes';
export class RolesService {
	constructor(private readonly rolesRepository = new RolesRepository()) {}

	async getAllRoles(): Promise<ServiceResponse<any>> {
		const roles = await this.rolesRepository.getAllRoles();
		return new ServiceResponse(
			ResponseStatus.Success,
			'Project archived successfully',
			roles,
			StatusCodes.OK,
		);
	}
}
