import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { IconIds } from '@/shared/ui/icon';

interface IPeriodData {
	min: number;
	max: number;
	current: number;
	start: number;
	symbol: string;
}

interface IAllTimeData {
	high: {
		value: number;
		date: string;
		percentage: number;
	};
	low: {
		value: number;
		date: string;
		percentage: number;
	};
}

interface IExchange {
	id: number;
	source: string;
	fullName: string;
	symbol: string;
	currency: string;
	currency_symbol: string;
	displaySymbol: string;
	isPrimary: boolean;
	price: number;
	change: {
		points: number;
		percentage: number;
	};
	openTime: string;
	closeTime: string;
	iconId: IconIds;
	periods: {
		'1D': IPeriodData;
		'1W': IPeriodData;
		'1M': IPeriodData;
		'3M': IPeriodData;
		'1Y': IPeriodData;
	};
	allTime: IAllTimeData;
}

interface IPriceRange {
	min: number;
	max: number;
}

export const useChartStore = defineStore('chart', () => {
	const exchanges = ref<IExchange[]>([
		{
			id: 1,
			source: 'NASDAQ',
			fullName: 'NASDAQ Stock Market',
			symbol: 'TSLA',
			currency: 'USD',
			currency_symbol: '$',
			displaySymbol: 'TSLA : USD',
			isPrimary: true,
			price: 248.71,
			change: {
				points: 0.93,
				percentage: 0.33,
			},
			openTime: '13:30:00',
			closeTime: '20:00:00',
			iconId: IconIds.NASDAQ,
			periods: {
				'1D': {
					min: 212.34,
					max: 262.53,
					current: 248.71,
					start: 230.15,
					symbol: '$',
				},
				'1W': {
					min: 198.76,
					max: 275.90,
					current: 248.71,
					start: 250.80,
					symbol: '$',
				},
				'1M': {
					min: 185.30,
					max: 290.45,
					current: 248.71,
					start: 195.60,
					symbol: '$',
				},
				'3M': {
					min: 175.20,
					max: 300.10,
					current: 248.71,
					start: 280.75,
					symbol: '$',
				},
				'1Y': {
					min: 150.80,
					max: 310.25,
					current: 248.71,
					start: 160.40,
					symbol: '$',
				},
			},
			allTime: {
				high: {
					value: 318.39,
					date: '2025-01-20',
					percentage: -21.89,
				},
				low: {
					value: 56.71,
					date: '2010-07-14',
					percentage: 338.61,
				},
			},
		},
		{
			id: 2,
			source: 'GETTEX',
			fullName: 'GETTEX Exchange',
			symbol: 'TL0',
			currency: 'EUR',
			currency_symbol: '€',
			displaySymbol: 'TL0 : EUR',
			isPrimary: false,
			price: 229.45,
			change: {
				points: -0.78,
				percentage: -0.34,
			},
			openTime: '06:00:00',
			closeTime: '20:00:00',
			iconId: IconIds.GETTEX,
			periods: {
				'1D': {
					min: 195.20,
					max: 242.15,
					current: 229.45,
					start: 221.30,
					symbol: '€',
				},
				'1W': {
					min: 183.45,
					max: 254.70,
					current: 229.45,
					start: 235.20,
					symbol: '€',
				},
				'1M': {
					min: 171.80,
					max: 268.30,
					current: 229.45,
					start: 180.45,
					symbol: '€',
				},
				'3M': {
					min: 162.15,
					max: 277.90,
					current: 229.45,
					start: 265.60,
					symbol: '€',
				},
				'1Y': {
					min: 139.75,
					max: 287.25,
					current: 229.45,
					start: 148.20,
					symbol: '€',
				},
			},
			allTime: {
				high: {
					value: 294.50,
					date: '2024-12-15',
					percentage: -22.09,
				},
				low: {
					value: 52.40,
					date: '2010-06-28',
					percentage: 337.88,
				},
			},
		},
		{
			id: 3,
			source: 'TRADEGATE',
			fullName: 'Tradegate Exchange',
			symbol: 'TL0',
			currency: 'EUR',
			currency_symbol: '€',
			displaySymbol: 'TL0 : EUR',
			isPrimary: false,
			price: 229.50,
			change: {
				points: 0.82,
				percentage: 0.36,
			},
			openTime: '07:00:00',
			closeTime: '21:00:00',
			iconId: IconIds.TRADEGATE,
			periods: {
				'1D': {
					min: 195.25,
					max: 242.20,
					current: 229.50,
					start: 221.35,
					symbol: '€',
				},
				'1W': {
					min: 183.50,
					max: 254.75,
					current: 229.50,
					start: 235.25,
					symbol: '€',
				},
				'1M': {
					min: 171.85,
					max: 268.35,
					current: 229.50,
					start: 180.50,
					symbol: '€',
				},
				'3M': {
					min: 162.20,
					max: 277.95,
					current: 229.50,
					start: 265.65,
					symbol: '€',
				},
				'1Y': {
					min: 139.80,
					max: 287.30,
					current: 229.50,
					start: 148.25,
					symbol: '€',
				},
			},
			allTime: {
				high: {
					value: 294.55,
					date: '2024-12-15',
					percentage: -22.08,
				},
				low: {
					value: 52.45,
					date: '2010-06-28',
					percentage: 337.76,
				},
			},
		},
		{
			id: 4,
			source: 'TSX',
			fullName: 'Toronto Stock Exchange',
			symbol: 'TSLA',
			currency: 'CAD',
			currency_symbol: 'C$',
			displaySymbol: 'TSLA : CAD',
			isPrimary: false,
			price: 339.85,
			change: {
				points: -1.32,
				percentage: -0.39,
			},
			openTime: '14:30:00',
			closeTime: '21:00:00',
			iconId: IconIds.TSX,
			periods: {
				'1D': {
					min: 288.87,
					max: 357.83,
					current: 339.85,
					start: 331.20,
					symbol: 'C$',
				},
				'1W': {
					min: 270.39,
					max: 377.31,
					current: 339.85,
					start: 345.80,
					symbol: 'C$',
				},
				'1M': {
					min: 252.11,
					max: 394.59,
					current: 339.85,
					start: 261.45,
					symbol: 'C$',
				},
				'3M': {
					min: 237.89,
					max: 407.81,
					current: 339.85,
					start: 395.20,
					symbol: 'C$',
				},
				'1Y': {
					min: 203.91,
					max: 423.79,
					current: 339.85,
					start: 218.65,
					symbol: 'C$',
				},
			},
			allTime: {
				high: {
					value: 445.72,
					date: '2024-11-08',
					percentage: -23.74,
				},
				low: {
					value: 79.42,
					date: '2010-05-20',
					percentage: 327.92,
				},
			},
		},
		{
			id: 5,
			source: 'BYMA',
			fullName: 'Bolsas y Mercados Argentinos',
			symbol: 'TSLA',
			currency: 'ARS',
			currency_symbol: '$',
			displaySymbol: 'TSLA : ARS',
			isPrimary: false,
			price: 225689.30,
			change: {
				points: 754.62,
				percentage: 0.33,
			},
			openTime: '14:00:00',
			closeTime: '21:00:00',
			iconId: IconIds.BYMA,
			periods: {
				'1D': {
					min: 191835.91,
					max: 237542.69,
					current: 225689.30,
					start: 219087.45,
					symbol: '$',
				},
				'1W': {
					min: 180551.84,
					max: 250826.76,
					current: 225689.30,
					start: 233421.85,
					symbol: '$',
				},
				'1M': {
					min: 169267.98,
					max: 264110.62,
					current: 225689.30,
					start: 175689.20,
					symbol: '$',
				},
				'3M': {
					min: 158997.05,
					max: 270378.55,
					current: 225689.30,
					start: 262145.78,
					symbol: '$',
				},
				'1Y': {
					min: 135414.02,
					max: 281964.58,
					current: 225689.30,
					start: 145287.95,
					symbol: '$',
				},
			},
			allTime: {
				high: {
					value: 312458.74,
					date: '2024-10-29',
					percentage: -27.78,
				},
				low: {
					value: 68952.45,
					date: '2009-11-18',
					percentage: 227.38,
				},
			},
		},
		{
			id: 6,
			source: 'LSX',
			fullName: 'London Stock Exchange',
			symbol: 'A1CX3T',
			currency: 'EUR',
			currency_symbol: '€',
			displaySymbol: 'A1CX3T : EUR',
			isPrimary: false,
			price: 229.40,
			change: {
				points: -0.79,
				percentage: -0.34,
			},
			openTime: '08:00:00',
			closeTime: '16:30:00',
			iconId: IconIds.LSX,
			periods: {
				'1D': {
					min: 194.99,
					max: 241.81,
					current: 229.40,
					start: 220.95,
					symbol: '€',
				},
				'1W': {
					min: 183.07,
					max: 254.23,
					current: 229.40,
					start: 234.85,
					symbol: '€',
				},
				'1M': {
					min: 172.05,
					max: 267.75,
					current: 229.40,
					start: 179.98,
					symbol: '€',
				},
				'3M': {
					min: 161.82,
					max: 277.28,
					current: 229.40,
					start: 265.12,
					symbol: '€',
				},
				'1Y': {
					min: 139.17,
					max: 286.63,
					current: 229.40,
					start: 147.85,
					symbol: '€',
				},
			},
			allTime: {
				high: {
					value: 293.84,
					date: '2024-12-22',
					percentage: -21.95,
				},
				low: {
					value: 51.87,
					date: '2010-07-05',
					percentage: 342.11,
				},
			},
		},
		{
			id: 7,
			source: 'XETR',
			fullName: 'Xetra Stock Exchange',
			symbol: 'TL0',
			currency: 'EUR',
			currency_symbol: '€',
			displaySymbol: 'TL0 : EUR',
			isPrimary: false,
			price: 229.55,
			change: {
				points: 0.84,
				percentage: 0.37,
			},
			openTime: '07:00:00',
			closeTime: '15:30:00',
			iconId: IconIds.XETR,
			periods: {
				'1D': {
					min: 195.12,
					max: 241.98,
					current: 229.55,
					start: 221.48,
					symbol: '€',
				},
				'1W': {
					min: 183.62,
					max: 254.48,
					current: 229.55,
					start: 235.38,
					symbol: '€',
				},
				'1M': {
					min: 172.17,
					max: 267.93,
					current: 229.55,
					start: 180.62,
					symbol: '€',
				},
				'3M': {
					min: 161.74,
					max: 277.36,
					current: 229.55,
					start: 265.78,
					symbol: '€',
				},
				'1Y': {
					min: 139.92,
					max: 287.18,
					current: 229.55,
					start: 148.37,
					symbol: '€',
				},
			},
			allTime: {
				high: {
					value: 294.62,
					date: '2024-12-18',
					percentage: -22.10,
				},
				low: {
					value: 52.52,
					date: '2010-06-15',
					percentage: 337.01,
				},
			},
		},
		{
			id: 8,
			source: 'B3',
			fullName: 'Brasil Bolsa Balcão',
			symbol: 'TSLA34',
			currency: 'BRL',
			currency_symbol: 'R$',
			displaySymbol: 'TSLA34 : BRL',
			isPrimary: false,
			price: 1251.43,
			change: {
				points: -4.42,
				percentage: -0.35,
			},
			openTime: '13:00:00',
			closeTime: '20:00:00',
			iconId: IconIds.B3,
			periods: {
				'1D': {
					min: 1063.72,
					max: 1318.50,
					current: 1251.43,
					start: 1208.95,
					symbol: 'R$',
				},
				'1W': {
					min: 1001.14,
					max: 1389.00,
					current: 1251.43,
					start: 1275.87,
					symbol: 'R$',
				},
				'1M': {
					min: 938.57,
					max: 1459.50,
					current: 1251.43,
					start: 978.25,
					symbol: 'R$',
				},
				'3M': {
					min: 876.00,
					max: 1501.86,
					current: 1251.43,
					start: 1447.12,
					symbol: 'R$',
				},
				'1Y': {
					min: 751.43,
					max: 1564.29,
					current: 1251.43,
					start: 805.94,
					symbol: 'R$',
				},
			},
			allTime: {
				high: {
					value: 1688.92,
					date: '2024-09-12',
					percentage: -25.91,
				},
				low: {
					value: 298.75,
					date: '2010-12-03',
					percentage: 318.85,
				},
			},
		}
	]);

	const activeExchangeId = ref(
		exchanges.value.find(exchange => exchange.isPrimary)?.id || 1,
	);

	const activeExchange = computed(() =>
		exchanges.value.find(exchange => exchange.id === activeExchangeId.value),
	);

	const allExchanges = computed(() => exchanges.value);

	const primaryExchange = computed(() =>
		exchanges.value.find(exchange => exchange.isPrimary),
	);

	const isActiveMarketOpen = computed(() => {
		if (!activeExchange.value) {
			return false;
		}
		return isMarketOpen(activeExchange.value.id);
	});

	const activeExchangePeriods = computed(() => {
		return activeExchange.value?.periods || null;
	});

	const activeExchangeAllTime = computed(() => {
		return activeExchange.value?.allTime || null;
	});

	function setActiveExchange(id: number) {
		const exchange = exchanges.value.find(singleExchange => singleExchange.id === id);
		if (exchange) {
			activeExchangeId.value = id;
			return true;
		}
		return false;
	}

	function isMarketOpen(exchangeId: number) {
		const exchange = exchanges.value.find(e => e.id === exchangeId);
		if (!exchange) {
			return false;
		}

		const now = new Date();
		const currentHour = now.getUTCHours();
		const currentMinute = now.getUTCMinutes();
		const currentSecond = now.getUTCSeconds();

		const currentTimeInSeconds =
			currentHour * 3600 + currentMinute * 60 + currentSecond;

		const openTimeParts = exchange.openTime.split(':').map(Number);
		const closeTimeParts = exchange.closeTime.split(':').map(Number);

		const openTimeInSeconds =
			openTimeParts[0] * 3600 + openTimeParts[1] * 60 + openTimeParts[2];
		const closeTimeInSeconds =
			closeTimeParts[0] * 3600 + closeTimeParts[1] * 60 + closeTimeParts[2];

		if (openTimeInSeconds < closeTimeInSeconds) {
			return currentTimeInSeconds >= openTimeInSeconds &&
				currentTimeInSeconds <= closeTimeInSeconds;
		} else {
			return currentTimeInSeconds >= openTimeInSeconds ||
				currentTimeInSeconds <= closeTimeInSeconds;
		}
	}

	function generateRandomDate(yearsBack: number): string {
		const now = new Date();
		const pastDate = new Date(now.getTime() - (Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000));
		return pastDate.toISOString().split('T')[0];
	}

	function randomizeExchanges() {
		const priceRanges: Record<string, IPriceRange> = {
			'USD': { min: 200, max: 300 },
			'EUR': { min: 180, max: 280 },
			'CAD': { min: 280, max: 400 },
			'ARS': { min: 200000, max: 250000 },
			'BRL': { min: 1100, max: 1400 },
			'JPY': { min: 35000, max: 40000 },
			'AUD': { min: 320, max: 420 },
		};

		exchanges.value = exchanges.value.map(exchange => {
			let range = { min: 200, max: 300 };
			if (exchange.currency === 'USD') {
				range = priceRanges['USD'];
			} else if (exchange.currency === 'EUR') {
				range = priceRanges['EUR'];
			} else if (exchange.currency === 'CAD') {
				range = priceRanges['CAD'];
			} else if (exchange.currency === 'ARS') {
				range = priceRanges['ARS'];
			} else if (exchange.currency === 'BRL') {
				range = priceRanges['BRL'];
			} else if (exchange.currency === 'JPY') {
				range = priceRanges['JPY'];
			} else if (exchange.currency === 'AUD') {
				range = priceRanges['AUD'];
			}

			const newPrice = parseFloat((Math.random() * (range.max - range.min) + range.min).toFixed(2));

			const changePercentage = parseFloat((Math.random() * 3 - 1.5).toFixed(2));
			const changePoints = parseFloat((newPrice * changePercentage / 100).toFixed(2));

			const tradingDuration = Math.floor(Math.random() * 4) + 6;
			const startHour = Math.floor(Math.random() * 24);
			const endHour = (startHour + tradingDuration) % 24;

			function formatTime(hour: number) {
				return `${hour.toString().padStart(2, '0')}:00:00`;
			}

			const openTime = formatTime(startHour);
			const closeTime = formatTime(endHour);

			function generatePeriodData(basePrice: number, volatility: number): IPeriodData {
				const min = parseFloat((basePrice * (1 - volatility)).toFixed(2));
				const max = parseFloat((basePrice * (1 + volatility)).toFixed(2));
				const start = parseFloat((min + Math.random() * (max - min)).toFixed(2));

				return {
					min,
					max,
					current: basePrice,
					start,
					symbol: exchange.currency_symbol,
				};
			}

			const periods = {
				'1D': generatePeriodData(newPrice, 0.05),
				'1W': generatePeriodData(newPrice, 0.12),
				'1M': generatePeriodData(newPrice, 0.25),
				'3M': generatePeriodData(newPrice, 0.35),
				'1Y': generatePeriodData(newPrice, 0.45),
			};

			const allPeriodMaxes = Object.values(periods).map(period => period.max);
			const allPeriodMins = Object.values(periods).map(period => period.min);
			const absoluteMax = Math.max(...allPeriodMaxes);
			const absoluteMin = Math.min(...allPeriodMins);

			const allTimeHigh = parseFloat((absoluteMax * (1.05 + Math.random() * 0.25)).toFixed(2));
			const allTimeLow = parseFloat((absoluteMin * (0.3 + Math.random() * 0.4)).toFixed(2));

			const highPercentage = parseFloat((((newPrice - allTimeHigh) / allTimeHigh) * 100).toFixed(2));
			const lowPercentage = parseFloat((((newPrice - allTimeLow) / allTimeLow) * 100).toFixed(2));

			return {
				...exchange,
				price: newPrice,
				change: {
					points: changePoints,
					percentage: changePercentage,
				},
				openTime,
				closeTime,
				periods,
				allTime: {
					high: {
						value: allTimeHigh,
						date: generateRandomDate(2),
						percentage: highPercentage,
					},
					low: {
						value: allTimeLow,
						date: generateRandomDate(15),
						percentage: lowPercentage,
					},
				},
			};
		});
	}

	return {
		exchanges,
		activeExchangeId,
		activeExchange,
		allExchanges,
		primaryExchange,
		isActiveMarketOpen,
		activeExchangePeriods,
		activeExchangeAllTime,
		setActiveExchange,
		isMarketOpen,
		randomizeExchanges,
	};
});
