export interface ICountry {
	name: string;
	code: string;
	isActive: boolean;
}

export interface ILocation {
	region: string;
	isActive: boolean;
	isCanAllSwitch: boolean;
	countries: ICountry[];
}
