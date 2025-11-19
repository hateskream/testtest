import type { IGenericTableRow } from '@/modules/table';
import { SymbolType } from '@/modules/cell';
import { IconIds } from '@/shared/ui/icon';

export const mockIndexData = [
	{
		id: 'Index-FTSE-MIB',
		data: {
			symbol: {
				symbolType: SymbolType.Index,
				srcImg: IconIds.Italy,
				ticker: 'FTSE MIB',
				indexName: 'Italy',
			},
			changePrice24h: {
				value: '+ 38',
				currencySymbol: '$',
			},
			changePrice24hPercent: {
				value: '1.00',
			},
			volatility: {
				value: 'volatile',
			},
		},
	},
	{
		id: 'Index-Ibovespa',
		data: {
			symbol: {
				symbolType: SymbolType.Index,
				srcImg: IconIds.Brazil,
				ticker: 'Ibovespa',
				indexName: 'Brazil',
			},
			changePrice24h: {
				value: '+ 38',
				currencySymbol: '$',
			},
			changePrice24hPercent: {
				value: '1.00',
			},
			volatility: {
				value: 'volatile',
			},
		},
	},
	{
		id: 'Index-OMXS30',
		data: {
			symbol: {
				symbolType: SymbolType.Index,
				srcImg:  IconIds.Sweden,
				ticker: 'OMXS30',
				indexName: 'Sweden',
			},
			changePrice24h: {
				value: '+ 38',
				currencySymbol: '$',
			},
			changePrice24hPercent: {
				value: '1.00',
			},
			volatility: {
				value: 'volatile',
			},
		},
	},
	{
		id: 'Index-IBEX35',
		data: {
			symbol: {
				symbolType: SymbolType.Index,
				srcImg: IconIds.Spain,
				ticker: 'IBEX 35',
				indexName: 'Spain',
			},
			changePrice24h: {
				value: '+ 38',
				currencySymbol: '$',
			},
			changePrice24hPercent: {
				value: '1.00',
			},
			volatility: {
				value: 'volatile',
			},
		},
	},
	{
		id: 'Index-Text',
		data: {
			symbol: {
				symbolType: SymbolType.Index,
				srcImg: IconIds.Germany,
				ticker: 'Text',
				indexName: 'Germany',
			},
			changePrice24h: {
				value: '+ 38',
				currencySymbol: '$',
			},
			changePrice24hPercent: {
				value: '1.00',
			},
			volatility: {
				value: 'volatile',
			},
		},
	},
	{
		id: 'Index-FTSES',
		data: {
			symbol: {
				symbolType: SymbolType.Index,
				srcImg: IconIds.Italy,
				ticker: 'FTSES',
				indexName: 'Italy',
			},
			changePrice24h: {
				value: '+ 38',
				currencySymbol: '$',
			},
			changePrice24hPercent: {
				value: '1.00',
			},
			volatility: {
				value: 'volatile',
			},
		},
	},
	{
		id: 'Index-UO100',
		data: {
			symbol: {
				symbolType: SymbolType.Index,
				srcImg: IconIds.Brazil,
				ticker: 'UO 100',
				indexName: 'Brazil',
			},
			changePrice24h: {
				value: '+ 38',
				currencySymbol: '$',
			},
			changePrice24hPercent: {
				value: '1.00',
			},
			volatility: {
				value: 'volatile',
			},
		},
	},
] as unknown as IGenericTableRow[];
