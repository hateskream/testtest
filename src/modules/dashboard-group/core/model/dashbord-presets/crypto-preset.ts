/* eslint-disable @stylistic/max-len */
import { MarketType } from '@/modules/market';
import { WidgetType } from '../widget';
import type { PresetLayout } from './types';

export const CRYPTO_DASHBOARD_PRESET: PresetLayout = {
	2: [
		{ id: 'news-main', type: WidgetType.News, position: { x: 0, y: 29, size: { w: 2, h: 6 } } },
		{ id: 'bitcoin-dominance-main', type: WidgetType.BitcoinDominance, position: { x: 0, y: 9, size: { w: 2, h: 3 } } },
		{ id: 'altcoin-season-main', type: WidgetType.AltcoinSeason, position: { x: 0, y: 18, size: { w: 2, h: 3 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 0, y: 12, size: { w: 2, h: 6 } } },
		{ id: 'fear-greed-main', type: WidgetType.FearGreed, position: { x: 0, y: 0, size: { w: 2, h: 3 } } },
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 3, size: { w: 2, h: 6 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 0, y: 35, size: { w: 2, h: 8 } } },
	],
	4: [
		{ id: 'news-main', type: WidgetType.News, position: { x: 0, y: 29, size: { w: 2, h: 6 } } },
		{ id: 'bitcoin-dominance-main', type: WidgetType.BitcoinDominance, position: { x: 0, y: 9, size: { w: 2, h: 3 } } },
		{ id: 'altcoin-season-main', type: WidgetType.AltcoinSeason, position: { x: 0, y: 18, size: { w: 2, h: 3 } } },
		{ id: 'market-cap-main', type: WidgetType.MarketCap, position: { x: 0, y: 12, size: { w: 2, h: 6 } } },
		{ id: 'fear-greed-main', type: WidgetType.FearGreed, position: { x: 0, y: 0, size: { w: 2, h: 3 } } },
		{ id: 'price-main', type: WidgetType.Price, position: { x: 0, y: 3, size: { w: 2, h: 6 } } },
		{ id: 'market-main', type: WidgetType.Market, position: { x: 0, y: 35, size: { w: 2, h: 8 } } },
	],


	'6': [
		{
			'id': 'ab468903-a1fa-4089-933f-1e69ec664a84',
			'type': 'fear-greed',
			'position': {
				'x': 2,
				'y': 0,
				'size': {
					'w': 2,
					'h': 3,
				},
			},
		},
		{
			'id': '393e0da7-61e3-4f08-973b-33c3a2f03feb',
			'type': 'price',
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
			'id': '5c90e9c0-eb73-4afc-a1f8-b45035e5c34a',
			'type': 'market-cap',
			'position': {
				'x': 2,
				'y': 3,
				'size': {
					'w': 2,
					'h': 3,
				},
			},
		},
		{
			'id': '44b3f689-1d4d-441c-9446-428b4b191cc4',
			'type': 'bitcoin-dominance',
			'position': {
				'x': 4,
				'y': 0,
				'size': {
					'w': 2,
					'h': 3,
				},
			},
		},
		{
			'id': '3b685667-ce7b-44ea-ae49-05411b7d7473',
			'type': 'altcoin-season',
			'position': {
				'x': 4,
				'y': 3,
				'size': {
					'w': 2,
					'h': 3,
				},
			},
		},
		{
			'id': '7c7d2846-6f9d-4fcb-84dd-40a5da377541',
			'type': 'market',
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
			'id': 'd2d3c650-54e6-4f5e-bea4-15fffc33bcef',
			'type': 'news',
			'position': {
				'x': 4,
				'y': 3,
				'size': {
					'w': 2,
					'h': 8,
				},
			},
			defaultStateType: MarketType.Crypto,
		},
	],
	'8': [
		{
			'id': '0f0bb66c-94ca-4814-a459-2ba6a7e0a0d6',
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
			'id': '4c933e67-7ed3-4c06-9d8c-c8193583e34b',
			'type': 'bitcoin-dominance',
			'position': {
				'x': 4,
				'y': 0,
				'size': {
					'w': 2,
					'h': 3,
				},
			},
		},
		{
			'id': 'b0edb319-71f0-4c6a-abfd-349559c0a6d1',
			'type': 'altcoin-season',
			'position': {
				'x': 4,
				'y': 3,
				'size': {
					'w': 2,
					'h': 3,
				},
			},
		},
		{
			'id': '4be6084c-c611-475e-b603-cb351291398c',
			'type': 'market-cap',
			'position': {
				'x': 2,
				'y': 3,
				'size': {
					'w': 2,
					'h': 3,
				},
			},
		},
		{
			'id': '8e651adf-7340-4d92-88e6-6e43a5071e8c',
			'type': 'fear-greed',
			'position': {
				'x': 2,
				'y': 0,
				'size': {
					'w': 2,
					'h': 3,
				},
			},
		},
		{
			'id': '3a1f31db-f750-4704-998d-0aaa3d115594',
			'type': 'price',
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
			'id': 'cb0243fb-e378-42de-b9e6-8056da7e969c',
			'type': 'market',
			'position': {
				'x': 0,
				'y': 6,
				'size': {
					'w': 6,
					'h': 8,
				},
			},
		},
	],
	10: [
		{
			'id': 'db750a7a-89fe-479f-8740-2fd48969b33f',
			'type': 'fear-greed',
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
			'id': '5fff94a1-243d-4624-8b18-bbb3ad81c47b',
			'type': 'market-cap',
			'position': {
				'x': 2,
				'y': 0,
				'size': {
					'w': 4,
					'h': 6,
				},
			},
		},
		{
			'id': 'f9519733-0926-42e5-8cbb-8139cd58ce4f',
			'type': 'bitcoin-dominance',
			'position': {
				'x': 6,
				'y': 0,
				'size': {
					'w': 4,
					'h': 6,
				},
			},
		},
		{
			'id': '82f9d166-0ccb-4f90-981b-2629eb5caebb',
			'type': 'news',
			'position': {
				'x': 10,
				'y': 0,
				'size': {
					'w': 2,
					'h': 17,
				},
			},
		},
		{
			'id': '77f1b985-fad9-430d-ab61-1d1e392b3c24',
			'type': 'price',
			'position': {
				'x': 0,
				'y': 6,
				'size': {
					'w': 6,
					'h': 5,
				},
			},
		},
		{
			'id': 'ae20ecd8-8f4a-483e-bb0f-df35b1560398',
			'type': 'altcoin-season',
			'position': {
				'x': 6,
				'y': 6,
				'size': {
					'w': 4,
					'h': 11,
				},
			},
		},
		{
			'id': '3d9b95f8-daa9-400b-a906-f1523d8bc670',
			'type': 'market',
			'position': {
				'x': 0,
				'y': 11,
				'size': {
					'w': 6,
					'h': 6,
				},
			},
		},
	],
};
