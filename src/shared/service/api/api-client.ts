import { z, type ZodTypeAny } from 'zod';

import { type BodyType, type IOptions, useHttpService } from '@/shared/service/http-service';

export class ApiClient {
	private readonly http = useHttpService();

	public get<T extends ZodTypeAny>(url: string, schema: T, options?: IOptions) {
		return this.withSchema(this.http.get(url, options), schema);
	}

	public post<T extends ZodTypeAny>(url: string, body: BodyType, schema: T, options?: IOptions) {
		return this.withSchema(this.http.post(url, body, options), schema);
	}

	public put<T extends ZodTypeAny>(url: string, body: BodyType, schema: T, options?: IOptions) {
		return this.withSchema(this.http.put(url, body, options), schema);
	}

	public delete<T extends ZodTypeAny>(url: string, schema: T, options?: IOptions) {
		return this.withSchema(this.http.delete(url, options), schema);
	}

	private async withSchema<T extends ZodTypeAny>(
		promise: Promise<unknown>,
		schema: T,
	): Promise<z.infer<T>> {
		const raw = await promise;

		const result = schema.safeParse(raw);
		if (!result.success) {
			// TODO: Monitoring
			console.error('API validation failed', {
				issues: result.error.issues,
				payload: raw,
			});

			throw result.error;
		}

		return result.data;
	}
}

let apiClientInstance: ApiClient | undefined;

export const useApiClient = (): ApiClient => {
	if (!apiClientInstance) {
		apiClientInstance = new ApiClient();
	}
	return apiClientInstance;
};
