/* eslint-disable @stylistic/max-len */
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
			'id': 'b98aadfb-dbec-4213-ae26-b1c571471182',
			'type': 'fear-greed',
			'position': {
				'x': 3,
				'y': 0,
				'size': {
					'w': 1,
					'h': 3,
				},
			},
		},
		{
			'id': 'fd051f7f-7ecc-4f31-845c-37646fcc51c8',
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
			'id': 'c26213e5-de4c-4aee-8f8b-a753681c4ce1',
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
			'id': '290a20f1-72dc-4c88-b4ea-5482718ae960',
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
			'id': '216f10b6-e158-4ca2-bf88-cd8a2ac264cf',
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
			'id': '5a1537a7-0a98-4c35-8571-a53efa9892dd',
			'type': 'market',
			'position': {
				'x': 0,
				'y': 6,
				'size': {
					'w': 4,
					'h': 8,
				},
			},
		},
		{
			'id': '854a99d3-03f2-47e1-878c-26b0e06cb3a2',
			'type': 'news',
			'position': {
				'x': 4,
				'y': 6,
				'size': {
					'w': 2,
					'h': 8,
				},
			},
			'defaultStateType': 'crypto',
		},
		{
			'id': 'e896b316-e8e6-4440-b78b-68236e22b344',
			'type': 'eth-gas',
			'position': {
				'x': 2,
				'y': 0,
				'size': {
					'w': 1,
					'h': 3,
				},
			},
		},
	],
	'8': [
		{
			'id': 'f5224d13-ab9f-4535-85a1-5a2dcfe07a36',
			'type': 'fear-greed',
			'position': {
				'x': 3,
				'y': 0,
				'size': {
					'w': 1,
					'h': 3,
				},
			},
		},
		{
			'id': 'b6943127-c75d-4b69-81c7-0f1d89e390eb',
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
			'id': '39efe5aa-e651-468f-8e8d-58260f414894',
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
			'id': '539664de-e37c-493c-b596-8c77afb03fd6',
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
			'id': '16cd2635-8ad4-4fd7-90bd-2e48226ffcad',
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
			'id': 'cfe44046-8704-426a-b43b-64f748c2e574',
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
		{
			'id': '52632ecf-fb03-4de9-922a-5cfb90e141b7',
			'type': 'news',
			'position': {
				'x': 6,
				'y': 0,
				'size': {
					'w': 2,
					'h': 14,
				},
			},
			'defaultStateType': 'crypto',
		},
		{
			'id': '03217f19-bcb7-4411-abaf-e8cc26cb596e',
			'type': 'eth-gas',
			'position': {
				'x': 2,
				'y': 0,
				'size': {
					'w': 1,
					'h': 3,
				},
			},
		},
	],
	10: [
		{
			'id': 'df0e7a36-a182-455d-8b40-c767bba9855f',
			'type': 'fear-greed',
			'position': {
				'x': 0,
				'y': 5,
				'size': {
					'w': 2,
					'h': 3,
				},
			},
		},
		{
			'id': '20a96ab7-a14e-4220-b0cd-e20af78b4224',
			'type': 'market-cap',
			'position': {
				'x': 2,
				'y': 0,
				'size': {
					'w': 3,
					'h': 8,
				},
			},
		},
		{
			'id': 'a148d447-f460-4ad9-8f4c-66aebd720109',
			'type': 'bitcoin-dominance',
			'position': {
				'x': 5,
				'y': 0,
				'size': {
					'w': 3,
					'h': 8,
				},
			},
		},
		{
			'id': 'f8929a90-4b0c-4ae1-8bd0-191d640ddea8',
			'type': 'news',
			'position': {
				'x': 8,
				'y': 0,
				'size': {
					'w': 2,
					'h': 21,
				},
			},
			'defaultStateType': 'crypto',
		},
		{
			'id': 'b2cf3594-0386-4b48-b082-1d280fe6835f',
			'type': 'price',
			'position': {
				'x': 0,
				'y': 8,
				'size': {
					'w': 5,
					'h': 5,
				},
			},
		},
		{
			'id': '0b6ba8b3-8c68-4e96-872a-0c3ec4cb3f90',
			'type': 'altcoin-season',
			'position': {
				'x': 5,
				'y': 8,
				'size': {
					'w': 3,
					'h': 14,
				},
			},
		},
		{
			'id': '39d1060d-de8b-412a-8abc-15106c057c5d',
			'type': 'market',
			'position': {
				'x': 0,
				'y': 13,
				'size': {
					'w': 5,
					'h': 9,
				},
			},
		},
		{
			'id': '3bc35755-3b55-4448-ae1f-7582eaed72bf',
			'type': 'eth-gas',
			'position': {
				'x': 0,
				'y': 0,
				'size': {
					'w': 2,
					'h': 5,
				},
			},
		},
	],
};
