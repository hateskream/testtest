import { compareStrings } from '@/shared/lib';

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

export function toggleLocationRegion(locationFilters: ILocation[], region: string) {
	const locationIdx = locationFilters.findIndex(item =>
		compareStrings(region, item.region),
	)!;

	const isActive = !locationFilters[locationIdx].isActive;

	const countries = locationFilters[locationIdx].countries.map(item => ({
		...item,
		isActive,
	}));

	locationFilters[locationIdx] = {
		...locationFilters[locationIdx],
		countries,
		isActive,
	};

	return [...locationFilters];
}

export function toggleLocationCountry(locationFilters: ILocation[], region: string, countryCode: string) {
	const locationIdx = locationFilters.findIndex(item =>
		compareStrings(region, item.region),
	)!;

	let activeCountries = 0;

	const countries = locationFilters[locationIdx].countries.map(item => {
		if (compareStrings(countryCode, item.code)) {
			if (!item.isActive) {
				activeCountries += 1;
			}

			return {
				...item,
				isActive: !item.isActive,
			};
		}

		if (item.isActive) {
			activeCountries += 1;
		}

		return item;
	});

	const isActive = activeCountries !== 0;

	locationFilters[locationIdx] = {
		...locationFilters[locationIdx],
		countries,
		isActive,
	};

	return [...locationFilters];
}

export interface IActiveLocation {
	region: string;
	countries: string[];
}

export function getActiveLocations(locationFilters: ILocation[]): IActiveLocation[] {
	const countries: { region: string; countries: string[] }[] = [];

	locationFilters.forEach(location => {
		if (location.isActive) {
			const countryActiveCodes: string[] = [];

			location.countries.forEach(country => {
				country.isActive && countryActiveCodes.push(country.code);
			});

			countries.push({
				region: location.region,
				countries: countryActiveCodes,
			});
		}
	});

	return countries;
}

export function rehydrateLocations(locationFilters: ILocation[], activeLocations: IActiveLocation[]): ILocation[] {
	if (activeLocations.length === 0) {
		return locationFilters;
	}

	const updatedLocations = JSON.parse(JSON.stringify(locationFilters)) as ILocation[];

	updatedLocations.forEach(location => {
		location.isActive = false;
		location.countries.forEach(country => {
			country.isActive = false;
		});
	});

	activeLocations.forEach(activeLocation => {
		const locationToUpdate = updatedLocations.find(loc => loc.region === activeLocation.region);
		if (locationToUpdate) {
			locationToUpdate.isActive = true;

			activeLocation.countries.forEach(countryCode => {
				const countryToUpdate = locationToUpdate.countries.find(country => country.code === countryCode);
				if (countryToUpdate) {
					countryToUpdate.isActive = true;
				}
			});
		}
	});

	return updatedLocations;
}


export const LOCATIONS_DEFAULT: ILocation[] = [
	{
		countries: [
			{
				code: '1',
				name: 'United States',
				isActive: true,
			},
			{
				code: '2',
				name: 'Canada',
				isActive: true,
			},
		],
		isActive: true,
		isCanAllSwitch: true,
		region: 'North America',
	},

	{
		countries: [
			{
				code: '2',
				name: 'Mexico',
				isActive: true,
			},
			{
				code: '3',
				name: 'Brazil',
				isActive: true,
			},
			{
				code: '4',
				name: 'Chile',
				isActive: true,
			},
			{
				code: '5',
				name: 'Argentina',
				isActive: true,
			},
			{
				code: '6',
				name: 'Peru',
				isActive: true,
			},
		],
		isActive: true,
		isCanAllSwitch: true,
		region: 'Latin America',
	},

	{
		countries: [],
		region: 'Europe',
		isActive: true,
		isCanAllSwitch: true,
	},

	{
		countries: [
			{
				code: '7',
				name: 'UK',
				isActive: true,
			},
			{
				code: '8',
				name: 'France',
				isActive: true,
			},
			{
				code: '9',
				name: 'Germany',
				isActive: true,
			},
			{
				code: '10',
				name: 'Netherlands',
				isActive: true,
			},
			{
				code: '11',
				name: 'Switzerland',
				isActive: true,
			},
		],
		isCanAllSwitch: false,
		isActive: true,
		region: 'Western Europe',
	},

	{
		countries: [
			{
				code: '12',
				name: 'Poland',
				isActive: true,
			},
			{
				code: '13',
				name: 'Czech Republic',
				isActive: true,
			},
			{
				code: '14',
				name: 'Hungary',
				isActive: true,
			},
			{
				code: '15',
				name: 'Russia',
				isActive: true,
			},
		],
		isCanAllSwitch: false,
		isActive: true,
		region: 'Eastern Europe',
	},

	{
		countries: [],
		region: 'Asia-Pacific',
		isActive: true,
		isCanAllSwitch: true,
	},

	{
		countries: [
			{
				code: '16',
				name: 'Japan',
				isActive: true,
			},
			{
				code: '17',
				name: 'South Korea',
				isActive: true,
			},
			{
				code: '18',
				name: 'South Singapore',
				isActive: true,
			},
			{
				code: '19',
				name: 'China',
				isActive: true,
			},
			{
				code: '20',
				name: 'Australia',
				isActive: true,
			},
			{
				code: '21',
				name: 'New Zealand',
				isActive: true,
			},
		],
		isCanAllSwitch: false,
		isActive: true,
		region: 'Developed',
	},

	{
		countries: [
			{
				code: '22',
				name: 'India',
				isActive: true,
			},
			{
				code: '23',
				name: 'Indonesia',
				isActive: true,
			},
			{
				code: '24',
				name: 'Philippines',
				isActive: true,
			},
			{
				code: '25',
				name: 'Thailand',
				isActive: true,
			},
			{
				code: '26',
				name: 'Malaysia',
				isActive: true,
			},
			{
				code: '27',
				name: 'Vietnam',
				isActive: true,
			},
		],
		isCanAllSwitch: false,
		isActive: true,
		region: 'Emerging',
	},

	{
		countries: [
			{
				code: '28',
				name: 'IndSaudi Arabiaia',
				isActive: true,
			},
			{
				code: '29',
				name: 'UAE',
				isActive: true,
			},
			{
				code: '30',
				name: 'Israel',
				isActive: true,
			},
			{
				code: '31',
				name: 'South Africa',
				isActive: true,
			},
			{
				code: '32',
				name: 'Egypt',
				isActive: true,
			},
			{
				code: '33',
				name: 'Nigeria',
				isActive: true,
			},
			{
				code: '34',
				name: 'Kenya',
				isActive: true,
			},
		],
		isCanAllSwitch: true,
		isActive: true,
		region: 'Mcodedle East & Africa',
	},
];
