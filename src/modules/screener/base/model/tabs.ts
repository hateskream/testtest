import { ScreenerType, screenerTypeToLabel } from './screener-type';
import { RouteNames, RouteScreenerType } from '@/types/route.d';

export interface IScreenerTab {
	id: RouteScreenerType;
	label: string;
	name: RouteNames;
}

export const SCREENER_TABS: IScreenerTab[] = [
	{
		id: RouteScreenerType.STOCK,
		label: screenerTypeToLabel[ScreenerType.Stock],
		name: RouteNames.ScreenerStock,
	},
	{
		id: RouteScreenerType.CRYPTO,
		label: screenerTypeToLabel[ScreenerType.Crypto],
		name: RouteNames.ScreenerCrypto,
	},
	{
		id: RouteScreenerType.ETF,
		label: screenerTypeToLabel[ScreenerType.ETF],
		name: RouteNames.ScreenerEtf,
	},
	{
		id: RouteScreenerType.BOND,
		label: screenerTypeToLabel[ScreenerType.Bond],
		name: RouteNames.ScreenerBond,
	},
	{
		id: RouteScreenerType.CEX,
		label: screenerTypeToLabel[ScreenerType.CEX],
		name: RouteNames.ScreenerCex,
	},
	{
		id: RouteScreenerType.DEX,
		label: screenerTypeToLabel[ScreenerType.DEX],
		name: RouteNames.ScreenerDex,
	},
];

