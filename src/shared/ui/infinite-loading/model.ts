export interface IInfiniteStateHandler {
	loading: () => void;
	loaded: () => void;
	complete: () => void;
	error: () => void;
}

export enum State {
	Loading = 'loading',
	Loaded = 'loaded',
	Complete = 'complete',
	Error = 'error',
	Idle = 'idle',
}
