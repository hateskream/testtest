import { ofetch } from 'ofetch';

export const enum HttpMethod {
	Get = 'GET',
	Post = 'POST',
	Put = 'PUT',
	Delete = 'DELETE',
}

export interface IOptions {
	query?: Record<string, string | number | boolean | undefined>;
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
		const controller = new AbortController();

		const timeout = options.timeout ?? 10000;

		const timeoutPromise = new Promise<never>((_, reject) => {
			setTimeout(() => {
				controller.abort();
				reject(new Error(`Request timeout after ${timeout}ms`));
			}, timeout);
		});

		const requestConfig: {
			method: HttpMethod;
			query?: Record<string, string | number | boolean | undefined>;
			body?: BodyType;
			signal?: AbortSignal;
			headers?: Record<string, string>;
			retry?: number;
			timeout?: number;
		} = {
			method,
			query: options.query,
			body: options.body,
			signal: options.signal || controller.signal,
			headers: options.headers,
		};

		if (options.retries !== undefined) {
			requestConfig.retry = options.retries;
		}
		if (options.timeout !== undefined) {
			requestConfig.timeout = options.timeout;
		}

		const requestPromise = this.fetchInstance<T>(url, requestConfig);

		try {
			return await Promise.race([requestPromise, timeoutPromise]);
		} catch (error) {
			controller.abort();
			throw new Error(
				`HTTP ${method} request failed: ${error instanceof Error ? error.message : String(error)}`,
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
