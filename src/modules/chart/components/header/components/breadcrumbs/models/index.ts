export enum BreadCrumbType {
	Common = 'common',
	Svg = 'svg',
}

interface IBreadCrumb {
	name: string;
	type: BreadCrumbType;
	isActive: boolean;
}

export type IBreadCrumbsProps = IBreadCrumb[];

export const breadCrumbsData: IBreadCrumbsProps = [
	{
		name: 'Markets',
		type: BreadCrumbType.Common,
		isActive: false,
	},
	{
		name: 'USA',
		type: BreadCrumbType.Common,
		isActive: false,
	},
	{
		name: 'more',
		type: BreadCrumbType.Svg,
		isActive: false,
	},
	{
		name: 'Motor vehicles',
		type: BreadCrumbType.Common,
		isActive: false,
	},
	{
		name: 'TSLA',
		type: BreadCrumbType.Common,
		isActive: true,
	},
];
