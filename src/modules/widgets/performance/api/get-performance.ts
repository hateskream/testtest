import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { removeUndefinedPropertiesFromObject } from '@/shared/lib';
import type { IPerformanceItem, IPerformanceResponse, IGetPerformanceRequest } from '../model';

const IS_USE_MOCK = true;

export async function getPerformance(args: IGetPerformanceRequest): Promise<IPerformanceItem[]> {
	const httpService = useHttpService();
	const logger = useLogger();

	const query = removeUndefinedPropertiesFromObject(args);

	try {
		const response = IS_USE_MOCK
			? await getMockData(args)
			: await httpService.get<IPerformanceResponse>('/widgets/performance', {
				query,
			});

		return response.data;
	} catch (error) {
		logger.error('Failed to get performance data', error as Error);
		throw error;
	}
}

async function getMockData(args: IGetPerformanceRequest): Promise<IPerformanceResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 200);
	});

	// Mock data based on the provided designs
	const industriesData: IPerformanceItem[] = [
		{
			id: '1',
			name: 'Media & Entertainment',
			change: -1.08,
			type: 'industry',
		},
		{
			id: '2',
			name: 'Communication Equipment',
			change: 16.13,
			type: 'industry',
		},
		{
			id: '3',
			name: 'Technology Distributors',
			change: 13.66,
			type: 'industry',
		},
		{
			id: '4',
			name: 'Consumer Electronics',
			change: 7.68,
			type: 'industry',
		},
		{
			id: '5',
			name: 'Renewable Utilities',
			change: 0.44,
			type: 'industry',
		},
		{
			id: '6',
			name: 'Regulated Water',
			change: 0.33,
			type: 'industry',
		},
		{
			id: '7',
			name: 'Regulated Gas',
			change: -0.86,
			type: 'industry',
		},
		{
			id: '8',
			name: 'Regulated Electric',
			change: -1.43,
			type: 'industry',
		},
		{
			id: '9',
			name: 'Independent Power Producers',
			change: -1.78,
			type: 'industry',
		},
		{
			id: '10',
			name: 'Diversified Utilities',
			change: -8.43,
			type: 'industry',
		},
		{
			id: '11',
			name: 'General Utilities',
			change: -17.33,
			type: 'industry',
		},
	];

	const sectorsData: IPerformanceItem[] = [
		{
			id: '1',
			name: 'Technology',
			change: 8.45,
			type: 'sector',
		},
		{
			id: '2',
			name: 'Healthcare',
			change: 3.22,
			type: 'sector',
		},
		{
			id: '3',
			name: 'Financial Services',
			change: 1.87,
			type: 'sector',
		},
		{
			id: '4',
			name: 'Consumer Discretionary',
			change: -0.52,
			type: 'sector',
		},
		{
			id: '5',
			name: 'Energy',
			change: -2.14,
			type: 'sector',
		},
		{
			id: '6',
			name: 'Utilities',
			change: -5.67,
			type: 'sector',
		},
	];

	let data: IPerformanceItem[] = [];

	switch (args.type) {
		case 'sector':
			data = sectorsData;
			break;
		case 'industry':
		default:
			data = industriesData;
			break;
	}

	// Simulate time range effects
	if (args.timeRange === 'yesterday') {
		data = data.map(item => ({
			...item,
			change: item.change * 0.8 + Math.random() * 2 - 1,
		}));
	} else if (args.timeRange === 'week') {
		data = data.map(item => ({
			...item,
			change: item.change * 2.5 + Math.random() * 5 - 2.5,
		}));
	}

	return {
		data: data.map(item => ({
			...item,
			change: Number(item.change.toFixed(2)),
		})),
	};
}
