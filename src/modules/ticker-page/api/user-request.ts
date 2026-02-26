import { useHttpService } from '@/shared/service/http-service';

export type RequestType = 'bug' | 'feature';

export interface IUserRequestPayload {
	text: string;
	images: File[];
}

export interface IUserRequestResponse {
	success: boolean;
}

export const UserRequestConfig = {
	MaxFiles: 5,
	MaxFileSize: 10 * 1024 * 1024, // 10MB
	MinTextLength: 1,
	MaxTextLength: 2000,
} as const;

export function makeUserRequest(
	type: RequestType,
	{ text, images }: IUserRequestPayload,
) {
	const httpService = useHttpService();

	const formData = new FormData();
	formData.append('text', text);

	for (const image of images) {
		formData.append('file', image);
	}

	return httpService.post<IUserRequestResponse>(`/api/feedback/${type}`, formData);
}
