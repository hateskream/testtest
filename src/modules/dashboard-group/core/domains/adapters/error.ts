export abstract class RepoError extends Error {
	public readonly cause?: Error;

	constructor(message: string) {
		super(message);

		this.name = this.constructor.name;

		const error = new Error(message);
		this.stack = error.stack;

		Object.setPrototypeOf(this, new.target.prototype);
	}

	toJSON() {
		return {
			name: this.name,
			message: this.message,
			stack: this.stack,
			...(this.cause ? { cause: this.cause } : {}),
		};
	}

	toString() {
		return `${this.name}: ${this.message}\n${this.stack}`;
	}
}
