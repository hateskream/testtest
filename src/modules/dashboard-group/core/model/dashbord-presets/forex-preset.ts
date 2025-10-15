import { MarketType } from '@/modules/market';
import { WidgetType } from '../widget';
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
			'id': '6ce3ad14-23cb-430d-9ddc-be255f39441a',
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
			'id': 'e11b0c0b-be8f-4ef0-ab5c-ca17cc83edf0',
			'type': 'performance',
			'position': {
				'x': 0,
				'y': 0,
				'size': {
					'w': 2,
					'h': 6,
				},
			},
		},
		{
			'id': '6e6835fc-412d-4f9d-bcd3-36fd026c6bdb',
			'type': 'market-cap',
			'position': {
				'x': 4,
				'y': 0,
				'size': {
					'w': 2,
					'h': 6,
				},
			},
		},
		{
			'id': 'fe0d4f20-a5d2-47df-aeed-78108cacb4d4',
			'type': 'news',
			'position': {
				'x': 4,
				'y': 6,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
		},
		{
			'id': '672c01f0-d232-4cc3-8b08-8d12227a8bb5',
			'type': 'heatmap',
			'position': {
				'x': 0,
				'y': 6,
				'size': {
					'w': 4,
					'h': 7,
				},
			},
		},
		{
			'id': '1d7d3e8c-445f-47b4-8500-6c457fd64b9a',
			'type': 'calendar',
			'position': {
				'x': 0,
				'y': 13,
				'size': {
					'w': 6,
					'h': 7,
				},
			},
		},
	],
	8: [
		{
			'id': '244795de-ab62-4be7-97bb-7a3c82cc9912',
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
			'id': '7e3a2f10-7bdc-4025-8747-0cf506042ea9',
			'type': 'performance',
			'position': {
				'x': 0,
				'y': 0,
				'size': {
					'w': 2,
					'h': 6,
				},
			},
		},
		{
			'id': 'ee2732cd-c480-4f33-826d-5dc95dca348d',
			'type': 'market-cap',
			'position': {
				'x': 4,
				'y': 0,
				'size': {
					'w': 2,
					'h': 6,
				},
			},
		},
		{
			'id': 'd6414137-6a4a-42d1-9c08-9073fca5a8b9',
			'type': 'news',
			'position': {
				'x': 6,
				'y': 0,
				'size': {
					'w': 2,
					'h': 15,
				},
			},
			defaultStateType: MarketType.Forex,
		},
		{
			'id': '5a06e948-f5c9-4db0-8a96-42ce16d09d79',
			'type': 'heatmap',
			'position': {
				'x': 0,
				'y': 6,
				'size': {
					'w': 4,
					'h': 7,
				},
			},
		},
		{
			'id': '97e27c4b-de6e-48f4-a0cf-970085bfb1c2',
			'type': 'calendar',
			'position': {
				'x': 4,
				'y': 6,
				'size': {
					'w': 2,
					'h': 7,
				},
			},
		},
	],
	10: [
		{
			'id': '52f05a49-f865-4d3a-9f47-a0fd584ce1b9',
			'type': 'performance',
			'position': {
				'x': 0,
				'y': 0,
				'size': {
					'w': 2,
					'h': 6,
				},
			},
		},
		{
			'id': '01b12fdd-2ae4-49f2-83b9-336a146aa984',
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
			'id': 'a19e5d5d-6d70-4191-a955-d72054f77d32',
			'type': 'calendar',
			'position': {
				'x': 4,
				'y': 0,
				'size': {
					'w': 3,
					'h': 12,
				},
			},
		},
		{
			'id': 'd15aacb4-0535-449e-8746-54151852164c',
			'type': 'news',
			'position': {
				'x': 7,
				'y': 0,
				'size': {
					'w': 3,
					'h': 22,
				},
			},
			defaultStateType: MarketType.Forex,
		},
		{
			'id': '29789f1a-ac08-4181-9acf-ea4d1617ac1a',
			'type': 'market-cap',
			'position': {
				'x': 0,
				'y': 6,
				'size': {
					'w': 4,
					'h': 6,
				},
			},
		},
		{
			'id': '0483f613-7f73-420c-b21c-d4de9cda0a29',
			'type': 'heatmap',
			'position': {
				'x': 0,
				'y': 12,
				'size': {
					'w': 7,
					'h': 10,
				},
			},
		},
	],
};
