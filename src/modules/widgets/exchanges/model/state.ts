import type { ISort, ITableColumn } from '@/modules/cell';
import { MarketType } from './exchanges';
import { CRYPTO_DEX_COLUMNS, CRYPTO_CEX_COLUMNS } from './crypto';
import { STOCK_ALL_COLUMNS } from './stock';


export interface ISettings {
	column: ITableColumn[];
	sort: ISort | null;
}

type SettingsByMarket = Record<MarketType, ISettings>;

export interface IState {
	activeMarket: MarketType;
	settings: SettingsByMarket;
}

const DEFAULT_STATE: IState = {
	activeMarket: MarketType.CryptoCEX,
	settings: {
		[MarketType.CryptoCEX]: {
			column: CRYPTO_CEX_COLUMNS,
			sort: null,
		},
		[MarketType.CryptoDEX]: {
			column: CRYPTO_DEX_COLUMNS,
			sort: null,
		},
		[MarketType.Stock]: {
			column: STOCK_ALL_COLUMNS,
			sort: null,
		},
	},
};

export function getDefaultState(): IState {
	return structuredClone(DEFAULT_STATE);
}

export function getDefaultSettings(): ISettings {
	return {
		column: CRYPTO_CEX_COLUMNS,
		sort: null,
	};
}

interface IPreset {
	columns: ITableColumn[];
}

type Presets = Record<MarketType, IPreset>;

export const PRESETS: Presets = {
	[MarketType.CryptoCEX]: {
		columns: CRYPTO_CEX_COLUMNS,
	},
	[MarketType.CryptoDEX]: {
		columns: CRYPTO_DEX_COLUMNS,
	},
	[MarketType.Stock]: {
		columns: STOCK_ALL_COLUMNS,
	},
};

