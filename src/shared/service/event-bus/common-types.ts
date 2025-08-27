export type EventType = string;

export type Handler<T> = (event: T) => void;
