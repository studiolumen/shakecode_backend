export const LoginTypeValues = ["password"] as const;
export type LoginType = (typeof LoginTypeValues)[number];

export const CompilerTypeValues = ["gcc", "node", "python"] as const;
export type CompilerType = (typeof CompilerTypeValues)[number];

export const ProblemCategoryValues = ["basic"] as const;
export type ProblemCategory = (typeof ProblemCategoryValues)[number];

export const UserPermissionValues = [
  "SEARCH_PROBLEM",
  "SEARCH_USER",
  "SEARCH_CLASS",
  "GET_USER_DETAIL",
  "GET_PROBLEM_DETAIL",
  "GET_CLASS_DETAIL",
  "CREATE_PROBLEM",
  "CREATE_CLASS",
  "MODIFY_USER_SELF",
  "MODIFY_PROBLEM_SELF",
  "MODIFY_CLASS_SELF",
] as const;

export const ManagementPermissionValues = [
  "CREATE_USER",
  "MODIFY_USER",
  "MODIFY_PROBLEM",
  "MODIFY_CLASS",
  "DELETE_USER",
  "DELETE_PROBLEM",
  "DELETE_CLASS",
] as const;

export const PermissionValues = [
  ...UserPermissionValues,
  ...ManagementPermissionValues,
] as const;

export type PermissionType = (typeof PermissionValues)[number];
export const PermissionEnum = Object.fromEntries(
  PermissionValues.map((v: PermissionType, i) => [v, Math.pow(2, i++)]),
) as { [K in PermissionType]: number };

export const CommonUserPermission: number[] = [
  PermissionEnum.SEARCH_USER,
  PermissionEnum.SEARCH_CLASS,
  PermissionEnum.SEARCH_PROBLEM,
  PermissionEnum.GET_USER_DETAIL,
  PermissionEnum.GET_CLASS_DETAIL,
  PermissionEnum.GET_PROBLEM_DETAIL,
  PermissionEnum.CREATE_PROBLEM,
  PermissionEnum.MODIFY_USER_SELF,
  PermissionEnum.MODIFY_PROBLEM_SELF,
];

export const TeacherUserPermission: number[] = [
  ...CommonUserPermission,
  PermissionEnum.CREATE_CLASS,
  PermissionEnum.MODIFY_CLASS_SELF,
];

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
): PermissionType[] => {
  const permissions: PermissionType[] = [];
  for (const permission of Object.values(PermissionEnum).sort(
    (a, b) => b - a,
  )) {
    if (numberedPermission - permission >= 0) {
      numberedPermission = numberedPermission - permission;
      permissions.push(
        Object.keys(PermissionEnum).find(
          (p) => PermissionEnum[p] === permission,
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
  const requiredPermissionList = parsePermission(
    numberPermission(...requiredPermission),
  );

  return requiredPermissionList.every(
    (rp) => currentPermissionList.indexOf(rp) !== -1,
  );
};
