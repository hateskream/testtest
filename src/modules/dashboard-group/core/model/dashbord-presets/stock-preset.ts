
import { MarketType } from '@/modules/market';
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
			'id': '8bc12e3b-242c-4d72-9dd7-6ac56ff16679',
			'type': 'price',
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
			'id': '842981f5-63de-4fa0-937b-181e98451803',
			'type': 'market-cap',
			'position': {
				'x': 4,
				'y': 0,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
		},
		{
			'id': 'abac040a-e535-46d3-9295-40a00bf1f2ee',
			'type': 'market',
			'position': {
				'x': 0,
				'y': 7,
				'size': {
					'w': 4,
					'h': 8,
				},
			},
		},
		{
			'id': '3023231b-f618-43e9-8f0d-013af1d1b927',
			'type': 'news',
			'position': {
				'x': 4,
				'y': 7,
				'size': {
					'w': 2,
					'h': 8,
				},
			},
			defaultStateType: MarketType.Stock,
		},
		{
			'id': '542a2309-109e-4de1-a15c-2d316a15ee28',
			'type': 'performance',
			'position': {
				'x': 2,
				'y': 0,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
		},
		{
			'id': 'f4a99130-cd48-422d-8ca0-5c99d8468d32',
			'type': 'market-cap',
			'position': {
				'x': 2,
				'y': 0,
				'size': {
					'w': 3,
					'h': 7,
				},
			},
		},
	],
	8: [
		{
			'id': '903a53a1-29d0-44a2-8df7-db737425f254',
			'type': 'performance',
			'position': {
				'x': 0,
				'y': 0,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
		},
		{
			'id': 'aae18fdc-b0a6-4536-97d6-06423947ff82',
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
			'id': '69c46b76-69b5-42ef-9ce2-cd3a5aeabccb',
			'type': 'market',
			'position': {
				'x': 4,
				'y': 0,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
		},
		{
			'id': '241aa4d6-97b1-4628-9ddd-a907e861f1b6',
			'type': 'news',
			'position': {
				'x': 6,
				'y': 0,
				'size': {
					'w': 2,
					'h': 14,
				},
			},
		},
		{
			'id': '99b9b592-cfc1-44a8-870d-b7a87f2f423c',
			'type': 'calendar',
			'position': {
				'x': 4,
				'y': 7,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
		},
		{
			'id': '466477a8-3a81-4bb3-88ef-9682e7e950e9',
			'type': 'market',
			'position': {
				'x': 0,
				'y': 7,
				'size': {
					'w': 4,
					'h': 7,
				},
			},
		},
	],
	10: [
		{
			'id': '3f8699ef-8571-41d5-9d9d-661a72c19ce2',
			'type': 'news',
			'position': {
				'x': 7,
				'y': 0,
				'size': {
					'w': 3,
					'h': 21,
				},
			},
			defaultStateType: MarketType.Stock,
		},
		{
			'id': 'e3b3d088-7549-4e81-b2be-bb76caed9bd0',
			'type': 'calendar',
			'position': {
				'x': 4,
				'y': 0,
				'size': {
					'w': 3,
					'h': 15,
				},
			},
		},
		{
			'id': '87453f1d-d9d8-45a0-8e20-3eff6bcbc2da',
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
			'id': 'f77fe8c2-7bc1-427b-b831-259882b22d7f',
			'type': 'performance',
			'position': {
				'x': 0,
				'y': 0,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
		},
		{
			'id': 'cf67f10a-a619-45bd-b07d-7cb9ecbeddba',
			'type': 'market-cap',
			'position': {
				'x': 0,
				'y': 7,
				'size': {
					'w': 4,
					'h': 8,
				},
			},
		},
		{
			'id': 'f362c3b5-e204-4820-a804-f0bcae62d1bf',
			'type': 'market',
			'position': {
				'x': 0,
				'y': 15,
				'size': {
					'w': 7,
					'h': 6,
				},
			},
		},
	],
};
