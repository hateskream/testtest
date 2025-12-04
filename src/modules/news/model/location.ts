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

export interface IActiveLocation {
	region: string;
	countries: string[];
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

export const REGION_RELATIONS: Record<string, string[]> = {
	'Europe': ['Western Europe', 'Eastern Europe'],
	'Asia-Pacific': ['Developed', 'Emerging'],
};

export const PARENT_OF_REGION: Record<string, string> = Object.entries(REGION_RELATIONS)
	.flatMap(([parent, children]) => children.map(child => [child, parent] as const))
	.reduce((acc, [child, parent]) => {
		acc[child] = parent;
		return acc;
	}, {} as Record<string, string>);

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

function setRegionActive(state: ILocation[], region: string, isActive: boolean) {
	const idx = state.findIndex(x => compareStrings(x.region, region));
	if (idx === -1) {
		return state;
	}

	const updatedCountries = state[idx].countries.map(country => ({
		...country,
		isActive,
	}));

	state[idx] = {
		...state[idx],
		isActive,
		countries: updatedCountries,
	};

	return state;
}

function setChildRegionsActive(state: ILocation[], parentRegion: string, isActive: boolean) {
	const children = REGION_RELATIONS[parentRegion];
	let newState = cloneState(state);

	if (!children) {
		return newState;
	}

	for (const childRegion of children) {
		newState = setRegionActive(state, childRegion, isActive);
	}

	return newState;
}

function cloneState(state: ILocation[]) {
	return state.map(location => ({
		...location,
		countries: location.countries.map(c => ({ ...c })),
	}));
}

function syncParentRegionByChildren(state: ILocation[], childRegion: string) {
	const parentRegion = PARENT_OF_REGION[childRegion];
	if (!parentRegion) {
		return state;
	}

	const children = REGION_RELATIONS[parentRegion] ?? [];

	const parentShouldBeActive = children.some(region => {
		const idx = state.findIndex(x => compareStrings(x.region, region));
		return idx !== -1 && state[idx].isActive;
	});

	const parentIdx = state.findIndex(x => compareStrings(x.region, parentRegion));

	if (parentIdx !== -1) {
		state[parentIdx] = {
			...state[parentIdx],
			isActive: parentShouldBeActive,
		};
	}

	return state;
}

export function toggleLocationRegion(locationFilters: ILocation[], region: string) {
	let state = cloneState(locationFilters);

	const idx = state.findIndex(item => compareStrings(region, item.region));
	if (idx === -1) {
		return state;
	}

	const nextActive = !state[idx].isActive;
	state = setRegionActive(state, region, nextActive);

	if (REGION_RELATIONS[region]) {
		state = setChildRegionsActive(state, region, nextActive);
	}

	if (PARENT_OF_REGION[region]) {
		state = syncParentRegionByChildren(state, region);
	}

	return state;
}

export function toggleLocationCountry(locationFilters: ILocation[], region: string, countryCode: string) {
	let state = cloneState(locationFilters);

	const regionIdx = state.findIndex(item => compareStrings(region, item.region));
	if (regionIdx === -1) {
		return state;
	}

	let activeCount = 0;

	const updatedCountries = state[regionIdx].countries.map(country => {
		if (compareStrings(country.code, countryCode)) {
			const next = !country.isActive;

			if (next) {
				activeCount += 1;
			}

			return { ...country, isActive: next };
		}

		if (country.isActive) {
			activeCount += 1;
		}

		return country;
	});

	state[regionIdx] = {
		...state[regionIdx],
		countries: updatedCountries,
		isActive: activeCount > 0,
	};

	state = syncParentRegionByChildren(state, region);

	return state;
}

export function compareLocations(locations1: ILocation[], locations2: ILocation[]): boolean {
	if (locations1.length !== locations2.length) {
		return false;
	}

	for (let i = 0; i < locations1.length; i += 1) {
		if (!compareLocation(locations1[i], locations2[i])) {
			return false;
		}
	}

	return true;
}

function compareLocation(location1: ILocation, location2: ILocation): boolean {
	if (
		location1.region !== location2.region ||
		location1.isActive !== location2.isActive ||
		location1.isCanAllSwitch !== location2.isCanAllSwitch
	) {
		return false;
	}
	return compareCountries(location1.countries, location2.countries);
}

export function getSelectedCountryNames(locations: ILocation[]): string[] {
	const selected = new Set<string>();

	const add = (name: string) => selected.add(name);

	for (const loc of locations) {
		const children = REGION_RELATIONS[loc.region];

		if (children && loc.isCanAllSwitch && loc.isActive) {
			const activeChildCountries = children
				.flatMap(child =>
					locations.find(location => compareStrings(location.region, child))
						?.countries.filter(c => c.isActive)
						.map(c => c.name) ?? [],
				);

			if (activeChildCountries.length > 0) {
				activeChildCountries.forEach(add);
			} else {
				add(loc.region);
			}

			continue;
		}

		const activeCountries = loc.countries.filter(country => country.isActive);
		if (activeCountries.length > 0) {
			activeCountries.forEach(country => add(country.name));
			continue;
		}

		if (loc.isCanAllSwitch && loc.isActive) {
			add(loc.region);
		}
	}

	return [...selected];
}

function compareCountries(countries1: ICountry[], countries2: ICountry[]): boolean {
	if (countries1.length !== countries2.length) {
		return false;
	}
	for (let i = 0; i < countries1.length; i += 1) {
		if (
			countries1[i].name !== countries2[i].name ||
			countries1[i].code !== countries2[i].code ||
			countries1[i].isActive !== countries2[i].isActive
		) {
			return false;
		}
	}
	return true;
}
