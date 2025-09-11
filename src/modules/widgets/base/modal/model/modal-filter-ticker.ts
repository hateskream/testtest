export interface IModalFilterTicker {
	id: string;
	image: string;
	name: string;
	ticker: string;
	imageType: 'icon' | 'image';
	type: {
		value: string;
		name: string;
	};
	isSelected: boolean;
}
