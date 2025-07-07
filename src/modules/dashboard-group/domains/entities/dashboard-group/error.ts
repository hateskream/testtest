import { DomainError } from '../error/error';

export class NotFoundActiveDashboard extends DomainError {
	constructor() {
		super('Not found active dashboard');
	}
}
