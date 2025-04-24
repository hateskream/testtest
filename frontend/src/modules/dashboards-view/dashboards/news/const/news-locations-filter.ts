import type { INewsLocation } from '../model';

export const NEWS_LOCATIONS: INewsLocation[] = [
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
