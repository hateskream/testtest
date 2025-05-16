import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { IconIds } from '@/shared/ui/icon';


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
		},
		// {
		// 	id: 9,
		// 	source: 'JPX',
		// 	fullName: 'Japan Exchange Group',
		// 	symbol: 'TSLA',
		// 	currency: 'JPY',
		// 	currency_symbol: '¥',
		// 	displaySymbol: 'TSLA : JPY',
		// 	isPrimary: false,
		// 	price: 37428.55,
		// 	change: {
		// 		points: 124.88,
		// 		percentage: 0.33
		// 	},
		// 	openTime: '00:00:00',
		// 	closeTime: '06:00:00',
		// 	iconId: IconIds.JPX
		// },
		// {
		// 	id: 10,
		// 	source: 'ASX',
		// 	fullName: 'Australian Securities Exchange',
		// 	symbol: 'TSLA',
		// 	currency: 'AUD',
		// 	currency_symbol: 'A$',
		// 	displaySymbol: 'TSLA : AUD',
		// 	isPrimary: false,
		// 	price: 374.62,
		// 	change: {
		// 		points: -1.42,
		// 		percentage: -0.38
		// 	},
		// 	openTime: '23:00:00',
		// 	closeTime: '05:00:00',
		// 	iconId: IconIds.ASX
		// }
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

	function setActiveExchange(id:number) {
		const exchange = exchanges.value.find(singleExchange => singleExchange.id === id);
		if (exchange) {
			activeExchangeId.value = id;
			return true;
		}
		return false;
	}

	function isMarketOpen(exchangeId:number) {
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

			const formatTime = (hour:number) => {
				return `${hour.toString().padStart(2, '0')}:00:00`;
			};

			const openTime = formatTime(startHour);
			const closeTime = formatTime(endHour);

			return {
				...exchange,
				price: newPrice,
				change: {
					points: changePoints,
					percentage: changePercentage,
				},
				openTime,
				closeTime,
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
		setActiveExchange,
		isMarketOpen,
		randomizeExchanges,
	};
});
