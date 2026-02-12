import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';

export type RequestType = 'bug' | 'feature';

export interface IUserRequestPayload {
	text: string;
	images: File[];
}

export const UserRequestConfig = {
	MaxFiles: 5,
	MaxFileSize: 10 * 1024 * 1024, // 10MB
	MinTextLength: 1,
	MaxTextLength: 2000,
} as const;

export async function makeUserRequest(type: RequestType, { text, images }: IUserRequestPayload): Promise<void> {
	const httpService = useHttpService();

	const formData = new FormData();
	formData.append('text', text);

	for (const image of images) {
		formData.append('file', image);
	}

	try {
		await httpService.post(`/api/feedback/${type}`, formData);
	} catch (error) {
		const logger = useLogger();
		logger.error('Failed to request feature:', { error: error as Error });
	}
}
