
import { WidgetType } from '../widget';
import type { PresetLayout } from './types';

export const STOCK_DASHBOARD_PRESET: PresetLayout = {
	2: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 3, size: { w: 2, h: 8 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 0, y: 11, size: { w: 2, h: 6 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 0, y: 17, size: { w: 2, h: 9 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 0, y: 26, size: { w: 2, h: 4 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 0, y: 30, size: { w: 2, h: 8 } } },
	],
	4: [
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 0, size: { w: 2, h: 6 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 0, y: 6, size: { w: 4, h: 7 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 0, y: 19, size: { w: 4, h: 8 } } },
		{ id: 'news-main', type: WidgetType.News, position: { x: 0, y: 13, size: { w: 4, h: 6 } } },
		{ id: 'performance-main', type: WidgetType.Performance, position: { x: 2, y: 0, size: { w: 2, h: 6 } } },
	],

	6: [
		{
			'id': '022e011f-14d8-48aa-b58d-ff7320fb5a25',
			'type': 'price',
			'position': {
				'x': 2,
				'y': 0,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': 'fa603756-ccce-46a0-b323-b6c5703213e6',
			'type': 'market',
			'position': {
				'x': 0,
				'y': 7,
				'size': {
					'w': 4,
					'h': 8,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': '19660725-12c5-4f15-8ac4-c692d50ae05c',
			'type': 'news',
			'position': {
				'x': 4,
				'y': 7,
				'size': {
					'w': 2,
					'h': 8,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': 'a147e076-4d17-470d-8de4-58258540703e',
			'type': 'performance',
			'position': {
				'x': 0,
				'y': 0,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': '8e127c4e-d8a1-4e18-8c34-4d49c0c7d08a',
			'type': 'chart-price',
			'position': {
				'x': 4,
				'y': 0,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': '833be485-33f4-48ef-b1f6-01332b5ad564',
			'type': 'calendar',
			'position': {
				'x': 0,
				'y': 15,
				'size': {
					'w': 6,
					'h': 6,
				},
			},
			defaultStateType: 'stock',
		},
	],
	8: [
		{
			'id': 'be6734b4-7407-4eaf-9889-f74163a42e55',
			'type': 'price',
			'position': {
				'x': 2,
				'y': 0,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': 'a634beac-2463-48ff-aed5-0d2de01c2f0c',
			'type': 'market',
			'position': {
				'x': 0,
				'y': 7,
				'size': {
					'w': 4,
					'h': 8,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': 'abfa17ba-3ff7-4ea7-9901-c76c7f135789',
			'type': 'news',
			'position': {
				'x': 6,
				'y': 0,
				'size': {
					'w': 2,
					'h': 15,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': '56ae39c4-8ee3-4fde-95c9-9f60fd569c40',
			'type': 'performance',
			'position': {
				'x': 0,
				'y': 0,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': 'd97a60a3-a41f-4318-8db8-6ec1ff6aa3d5',
			'type': 'chart-price',
			'position': {
				'x': 4,
				'y': 0,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': '1eee6607-4694-4268-8bc9-27d5080661ac',
			'type': 'calendar',
			'position': {
				'x': 4,
				'y': 7,
				'size': {
					'w': 2,
					'h': 8,
				},
			},
			defaultStateType: 'stock',
		},
	],
	10: [
		{
			'id': 'ab064f36-a5ea-4a34-88d0-6479bae655ce',
			'type': 'news',
			'position': {
				'x': 7,
				'y': 0,
				'size': {
					'w': 3,
					'h': 21,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': 'b90846d9-3888-4b95-a503-3c5ab9dc4cb5',
			'type': 'calendar',
			'position': {
				'x': 4,
				'y': 0,
				'size': {
					'w': 3,
					'h': 15,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': '12ca5db8-4698-4d24-a0e6-327582cc8e5a',
			'type': 'price',
			'position': {
				'x': 2,
				'y': 0,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': '3658a5fe-fec9-4975-8fc4-8320029b9985',
			'type': 'performance',
			'position': {
				'x': 0,
				'y': 0,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': 'f95652b9-fec8-478f-98c2-c0cc4b1a2538',
			'type': 'market',
			'position': {
				'x': 0,
				'y': 15,
				'size': {
					'w': 7,
					'h': 6,
				},
			},
			defaultStateType: 'stock',
		},
		{
			'id': 'b1150c51-a2f9-49ad-a060-882b875d4df4',
			'type': 'chart-price',
			'position': {
				'x': 0,
				'y': 7,
				'size': {
					'w': 4,
					'h': 8,
				},
			},
			defaultStateType: 'stock',
		},
	],
};
