import { WidgetType } from '@/modules/dashboard-group';
import type { PresetLayout } from './types';

export const FOREX_DASHBOARD_PRESET: PresetLayout = {
	2: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 2, h: 9 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 0, y: 15, size: { w: 2, h: 9 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 0, y: 9, size: { w: 2, h: 6 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 0, y: 24, size: { w: 2, h: 4 } } },
	],
	4: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 2, h: 7 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 2, y: 0, size: { w: 2, h: 7 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 0, y: 7, size: { w: 4, h: 6 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 0, y: 13, size: { w: 4, h: 5 } } },
	],

	6: [
		{
			'id': '6a394195-da1e-4f5a-b33a-6ff7a4cfadf4',
			'type': 'price',
			'position': {
				'x': 2,
				'y': 0,
				'size': {
					'w': 2,
					'h': 6,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': '22df780b-c690-4f70-ace5-6ebf4f69fbbb',
			'type': 'performance',
			'position': {
				'x': 0,
				'y': 0,
				'size': {
					'w': 2,
					'h': 6,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': '63801bbd-0092-4f35-a51f-dca27435ab71',
			'type': 'news',
			'position': {
				'x': 4,
				'y': 6,
				'size': {
					'w': 2,
					'h': 14,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': 'c8be431c-5dc7-4411-b9e9-4fe4ae970771',
			'type': 'heatmap',
			'position': {
				'x': 0,
				'y': 6,
				'size': {
					'w': 4,
					'h': 7,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': '0a79c6a5-09f2-44fe-9fed-9930f33c4223',
			'type': 'calendar',
			'position': {
				'x': 0,
				'y': 13,
				'size': {
					'w': 4,
					'h': 7,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': '5e28e75c-2d47-4a77-8319-e527f4d73b5d',
			'type': 'chart-price',
			'position': {
				'x': 4,
				'y': 0,
				'size': {
					'w': 2,
					'h': 6,
				},
			},
			defaultStateType: 'forex',
		},
	],
	8: [
		{
			'id': '7cd0474a-8919-4cc9-9fb8-ec799495e70a',
			'type': 'price',
			'position': {
				'x': 2,
				'y': 0,
				'size': {
					'w': 2,
					'h': 6,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': '6b12849e-a759-4215-8be6-ac500ca6003f',
			'type': 'performance',
			'position': {
				'x': 0,
				'y': 0,
				'size': {
					'w': 2,
					'h': 6,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': '56aabe8b-d2b3-4962-94ec-bde6c30a1411',
			'type': 'news',
			'position': {
				'x': 6,
				'y': 0,
				'size': {
					'w': 2,
					'h': 13,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': 'db182a70-bb63-49c3-a0a2-9f4e35437412',
			'type': 'heatmap',
			'position': {
				'x': 0,
				'y': 6,
				'size': {
					'w': 4,
					'h': 7,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': '56d0abde-f707-4a14-8558-d03986375d80',
			'type': 'calendar',
			'position': {
				'x': 4,
				'y': 6,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': '39ff011f-c1ce-4cb2-a840-89fc4a206300',
			'type': 'chart-price',
			'position': {
				'x': 4,
				'y': 0,
				'size': {
					'w': 2,
					'h': 6,
				},
			},
			defaultStateType: 'forex',
		},
	],
	10: [
		{
			'id': '2444c925-6cc9-4cda-a9df-f56ccc994089',
			'type': 'performance',
			'position': {
				'x': 0,
				'y': 0,
				'size': {
					'w': 2,
					'h': 6,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': '4801a8c2-32ee-415c-8ac0-43dd02b623ee',
			'type': 'price',
			'position': {
				'x': 2,
				'y': 0,
				'size': {
					'w': 2,
					'h': 6,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': '4d466c4f-f104-4117-90b2-04936e674fde',
			'type': 'calendar',
			'position': {
				'x': 4,
				'y': 0,
				'size': {
					'w': 3,
					'h': 12,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': '906f4ace-9fe7-4bee-a4e4-92df0578761c',
			'type': 'news',
			'position': {
				'x': 7,
				'y': 0,
				'size': {
					'w': 3,
					'h': 22,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': '04a31271-7e6d-42fd-9a3c-ab0f79818cdf',
			'type': 'heatmap',
			'position': {
				'x': 0,
				'y': 12,
				'size': {
					'w': 7,
					'h': 10,
				},
			},
			defaultStateType: 'forex',
		},
		{
			'id': 'd08fdb7f-a35d-47da-ad93-b0584f6c8048',
			'type': 'chart-price',
			'position': {
				'x': 0,
				'y': 6,
				'size': {
					'w': 4,
					'h': 6,
				},
			},
			defaultStateType: 'forex',
		},
	],
};
