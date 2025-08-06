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
	if (rank <= 7) {
		return widgetColor.bitcoinSeason;
	} else if (rank <= 23) {
		return widgetColor.neutralSeason;
	} else {
		return widgetColor.altcoinSeason;
	}
};


export const getActiveColorByRank = (rank: number) => {
	if (rank <= 7) {
		return widgetActiveColor.bitcoinSeason;
	} else if (rank <= 23) {
		return widgetActiveColor.neutralSeason;
	} else {
		return widgetActiveColor.altcoinSeason;
	}
};

export const getSeasonNameByRank = (rank: number) => {
	if (rank <= 7) {
		return 'Bitcoin season';
	} else if (rank <= 23) {
		return 'Neutral season';
	} else {
		return 'Altcoin season';
	}
};
