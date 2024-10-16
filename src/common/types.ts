export const LoginTypeValues = ["password"] as const;
export type LoginType = (typeof LoginTypeValues)[number];

export const CompilerTypeValues = ["gcc", "node", "python"] as const;
export type CompilerType = (typeof CompilerTypeValues)[number];

export const ProblemCategoryValues = ["basic"] as const;
export type ProblemCategory = (typeof ProblemCategoryValues)[number];
