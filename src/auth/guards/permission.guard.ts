import { CanActivate, ExecutionContext, mixin } from "@nestjs/common";

import { hasPermission } from "../../common/types";

export const PermissionGuard = (...requiredPermission: number[]) => {
  class PermissionGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      return hasPermission(request.user.permission, ...requiredPermission);
    }
  }

  return mixin(PermissionGuardMixin);
};
