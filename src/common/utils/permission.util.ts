import { PermissionEnum, PermissionType } from "../types";

export const numberPermission = (...items: number[]): number => {
  let val = 0;
  const valList = [];
  for (const item of items) {
    if (valList.indexOf(item) != -1) continue;
    val += item;
    valList.push(item);
  }

  return val;
};

export const parsePermission = (
  numberedPermission: number,
  customPermissionEnum?: { [key: string]: number },
): PermissionType[] | string[] => {
  const permissionEnum = customPermissionEnum || PermissionEnum;

  const permissions: PermissionType[] = [];
  for (const permission of Object.values(permissionEnum).sort(
    (a, b) => b - a,
  )) {
    if (numberedPermission - permission >= 0) {
      numberedPermission = numberedPermission - permission;
      permissions.push(
        Object.keys(permissionEnum).find(
          (p) => permissionEnum[p] === permission,
        ) as PermissionType,
      );
    }
  }

  return permissions;
};

export const hasPermission = (
  currentPermission: number,
  ...requiredPermission: number[]
) => {
  const currentPermissionList = parsePermission(currentPermission);
  // TODO: Optimise
  const requiredPermissionList = parsePermission(
    numberPermission(...requiredPermission),
  );

  return requiredPermissionList.every(
    (rp) => currentPermissionList.indexOf(rp as PermissionType) !== -1,
  );
};
