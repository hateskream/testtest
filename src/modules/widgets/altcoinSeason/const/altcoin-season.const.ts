export const DATA_CAP = 30;
export const BITCOIN_THRESHOLD = 8;
export const MIDDLE_THRESHOLD = 15;
export const ALTCOIN_THRESHOLD = 23;

export interface IAltcoinSeasonColors {
	bitcoinSeason: string;
	neutralSeason: string;
	altcoinSeason: string;
}

export const graphColor: IAltcoinSeasonColors = {
	bitcoinSeason: 'rgba(136, 93, 36, 0.15)',
	neutralSeason: 'rgba(77, 77, 77, 0.40)',
	altcoinSeason: 'rgba(65, 59, 150, 0.15)',
};

export const graphActiveColor: IAltcoinSeasonColors = {
	bitcoinSeason: 'rgba(136, 93, 36, 0.45)',
	neutralSeason: 'rgba(77, 77, 77, 0.40)',
	altcoinSeason: 'rgba(65, 59, 150, 0.45)',
};

export const widgetColor: IAltcoinSeasonColors = {
	bitcoinSeason: 'rgba(136, 93, 36, 0.40)',
	neutralSeason: 'rgba(77, 77, 77, 0.40)',
	altcoinSeason: 'rgba(65, 59, 150, 0.60)',
};

export const widgetActiveColor: IAltcoinSeasonColors = {
	bitcoinSeason: '#FEB358',
	neutralSeason: '#FFFFFF',
	altcoinSeason: '#7A8BF9',
};

export const getColorByRank = (rank: number) => {
	if (rank <= BITCOIN_THRESHOLD) {
		return widgetColor.bitcoinSeason;
	} else if (rank <= ALTCOIN_THRESHOLD) {
		return widgetColor.neutralSeason;
	} else {
		return widgetColor.altcoinSeason;
	}
};


export const getActiveColorByRank = (rank: number) => {
	if (rank <= BITCOIN_THRESHOLD) {
		return widgetActiveColor.bitcoinSeason;
	} else if (rank <= ALTCOIN_THRESHOLD) {
		return widgetActiveColor.neutralSeason;
	} else {
		return widgetActiveColor.altcoinSeason;
	}
};

export const getSeasonNameByRank = (rank: number) => {
	if (rank <= BITCOIN_THRESHOLD) {
		return 'Bitcoin season';
	} else if (rank <= ALTCOIN_THRESHOLD) {
		return 'Neutral season';
	} else {
		return 'Altcoin season';
	}
};
