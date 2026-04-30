import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/user-roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    
    public canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get(Roles, context.getHandler());
        
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.role) {
            throw new ForbiddenException('The user is not authorized or the role is not defined');
        }
        
        const isRole = requiredRoles.includes(user.role);

        if (!isRole) {
            throw new ForbiddenException('You do not have sufficient permissions to access this resource');
        }
        
        return true;
    }
}