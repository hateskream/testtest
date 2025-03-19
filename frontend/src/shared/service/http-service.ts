import { ofetch } from 'ofetch';

export const enum HttpMethod {
	Get = 'GET',
	Post = 'POST',
	Put = 'PUT',
	Delete = 'DELETE',
}

export interface IOptions {
	query?: Record<string, string | number | boolean>;
	signal?: AbortSignal;
	headers?: Record<string, string>;
	retries?: number;
	timeout?: number;
}

export type BodyType = Record<string, unknown> | FormData | null;

class HttpService {
	private readonly fetchInstance = ofetch.create({
		retry: 1,
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json',
		},
		onRequestError({ error }) {
			console.error('Request error:', error);
		},
		onResponseError({ response }) {
			console.error('Response error:', response.status, response.statusText);
		},
	});

	public get<T>(url: string, options?: IOptions): Promise<T> {
		return this.request<T>(url, HttpMethod.Get, options);
	}

	public post<T>(url: string, body: BodyType, options?: IOptions): Promise<T> {
		return this.request<T>(url, HttpMethod.Post, { ...options, body });
	}

	public put<T>(url: string, body: BodyType, options?: IOptions): Promise<T> {
		return this.request<T>(url, HttpMethod.Put, { ...options, body });
	}

	public delete<T>(url: string, options?: IOptions): Promise<T> {
		return this.request<T>(url, HttpMethod.Delete, options);
	}

	private async request<T>(
		url: string,
		method: HttpMethod,
		options: IOptions & { body?: BodyType } = {},
	): Promise<T> {
		try {
			return await this.fetchInstance<T>(url, {
				method,
				query: options.query,
				body: options.body,
				signal: options.signal,
				headers: options.headers,
				retry: options.retries,
				timeout: options.timeout,
			});
		} catch (error) {
			throw new Error(
				`HTTP ${method} request failed: 
				${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
}

let httpServiceInstance: HttpService | undefined;

export const useHttpService = () => {
	if (!httpServiceInstance) {
		httpServiceInstance = new HttpService();
	}
	return httpServiceInstance;
};
