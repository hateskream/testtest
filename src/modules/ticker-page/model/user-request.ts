export const RequestState = {
	Initial: 'initial',
	Form: 'form',
	Sended: 'sended',
} as const;

export type RequestStateType = typeof RequestState[keyof typeof RequestState];
