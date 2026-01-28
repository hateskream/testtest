export const ErrorCode = {
	AUTHORIZATION_REQUIRED: 401,
	ACCESS_DENIED: 403,
	NOT_FOUND: 404,
	NO_LONGER_AVAILABLE: 410,
	SERVER_ERROR: 500,
	TEMPORARILY_UNAVAILABLE: 502,
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];
