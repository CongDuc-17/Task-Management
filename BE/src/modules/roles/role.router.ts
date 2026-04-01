import { autoBindUtil } from '@/common';
import express from 'express';
import { RoleController } from './role.controller';
const rolesController = new RoleController();

const router = express.Router({ mergeParams: true });
autoBindUtil(rolesController);

router.get('/', rolesController.getAllRoles);

export const roleRouter = router;
