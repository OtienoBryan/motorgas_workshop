import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { ADMIN_ROLES } from './admin-roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    // Destructive requests default to admin roles unless the route declares its own
    const effective = required?.length ? required : request.method === 'DELETE' ? ADMIN_ROLES : [];
    if (effective.length === 0) {
      return true;
    }

    const role = String(request.user?.role ?? '').toLowerCase();
    if (!effective.some((r) => r.toLowerCase() === role)) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }
    return true;
  }
}
