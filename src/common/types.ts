import { numberPermission } from "./utils/permission.util";

export const LoginTypeValues = ["password"] as const;
export type LoginType = (typeof LoginTypeValues)[number];

export const CompilerTypeValues = ["gcc", "node", "python"] as const;
export type CompilerType = (typeof CompilerTypeValues)[number];

export const ProblemCategoryValues = ["basic"] as const;
export type ProblemCategory = (typeof ProblemCategoryValues)[number];

export const PermissionValidationTypeValues = [
  "permission",
  "permission_group",
] as const;
export type PermissionValidationType =
  (typeof PermissionValidationTypeValues)[number];

export const UserPermissionValues = [
  "SEARCH_PROBLEM",
  "SEARCH_USER",
  "SEARCH_CLASS",
  "GET_USER_SELF",
  "GET_PROBLEM_SELF",
  "GET_CLASS_SELF",
  "GET_PUBLIC_USER",
  "GET_PUBLIC_PROBLEM",
  "GET_PUBLIC_CLASS",
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
  "MANAGE_PERMISSION",
] as const;

// Merge permission values without duplicates
export const PermissionValues = [
  ...new Set([...UserPermissionValues, ...ManagementPermissionValues]),
] as const;
export type PermissionType = (typeof PermissionValues)[number];

// Create enum for easy permission management with binary
export const PermissionEnum = Object.fromEntries(
  PermissionValues.map((v: PermissionType, i) => [v, Math.pow(2, i++)]),
) as { [key in PermissionType]: number };

// group of well-used permissions
export const CommonUserPermission: number[] = [
  PermissionEnum.SEARCH_USER,
  PermissionEnum.SEARCH_CLASS,
  PermissionEnum.SEARCH_PROBLEM,
  PermissionEnum.GET_USER_SELF,
  PermissionEnum.GET_CLASS_SELF,
  PermissionEnum.GET_PROBLEM_SELF,
  PermissionEnum.GET_PUBLIC_USER,
  PermissionEnum.GET_PUBLIC_CLASS,
  PermissionEnum.GET_PUBLIC_PROBLEM,
  PermissionEnum.CREATE_PROBLEM,
  PermissionEnum.MODIFY_USER_SELF,
  PermissionEnum.MODIFY_PROBLEM_SELF,
];
export const TeacherUserPermission: number[] = [
  ...CommonUserPermission,
  PermissionEnum.CREATE_CLASS,
  PermissionEnum.MODIFY_CLASS_SELF,
];
export const PermissionGroups = { CommonUserPermission, TeacherUserPermission };
export const NumberedPermissionGroupsEnum = Object.fromEntries(
  Object.keys(PermissionGroups).map((v) => [
    v,
    numberPermission(...PermissionGroups[v]),
  ]),
) as { [key in string]: number };
