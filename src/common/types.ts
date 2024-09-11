export const LoginTypesValues = ["password"] as const;
export type LoginType = (typeof LoginTypesValues)[number];
