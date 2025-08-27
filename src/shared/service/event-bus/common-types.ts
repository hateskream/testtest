export type EventType = string;

export type Handler<T = unknown> = (event: T) => void;
