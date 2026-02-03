import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';

export interface IRequestFeaturePayload {
	text: string;
	images: File[];
}

export const RequestFeatureConfig = {
	MaxImages: 10,
	MaxFileSize: 5 * 1024 * 1024, // 5MB
	MinTextLength: 12,
	MaxTextLength: 1000,
} as const;

export async function requestFeature({ text, images }: IRequestFeaturePayload): Promise<void> {
	const httpService = useHttpService();

	const formData = new FormData();
	formData.append('text', text);

	for (const image of images) {
		formData.append('images', image);
	}

	try {
		await httpService.post('/api/v1/feature-request', formData);
	} catch (error) {
		const logger = useLogger();
		logger.error('Failed to request feature:', { error: error as Error });
	}
}
