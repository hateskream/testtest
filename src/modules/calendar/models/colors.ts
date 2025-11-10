export const HIGHLIGHT_COLORS = {
	favorite: {
		'--light-start': 'rgba(230,171,10,0)',
		'--light-mid': 'rgba(230,171,10,0.2)',
		'--light-border': 'rgba(230,171,10,0.7)',
	},
	soon: {
		'--light-start': 'rgba(230,0,0,0)',
		'--light-mid': 'rgba(230,0,0,0.2)',
		'--light-border': 'rgba(230,0,0,0.7)',
	},
	none: {
		'--light-start': 'transparent',
		'--light-mid': 'transparent',
		'--light-border': 'transparent',
	},
} as const;

export function getHighlightColor(favorite: boolean, soon: boolean) {
	if (favorite) {
		return HIGHLIGHT_COLORS.favorite;
	}
	if (soon) {
		return HIGHLIGHT_COLORS.soon;
	}
	return HIGHLIGHT_COLORS.none;
}

