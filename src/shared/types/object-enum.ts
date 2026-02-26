export type ObjectEnum<T extends Record<string, unknown>> = T[keyof T];
