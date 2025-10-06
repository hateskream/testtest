export const DATA_CAP = 30;
export const BITCOIN_THRESHOLD = 8;
export const ALTCOIN_THRESHOLD = 23;

export const widgetColor = {
	bitcoinSeason: '#FEB358',
	neutralSeason: 'rgba(77, 77, 77, 0.40)',
	altcoinSeason: 'rgba(65, 59, 150, 0.60)',
};

export const widgetActiveColor = {
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
