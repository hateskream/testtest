export interface IWebsite {
	label: string;
	url: string;
}

export interface ISocialsItem {
	icon: string;
	url: string;
}

export interface IContentItem {
	website: IWebsite;
	socials: ISocialsItem[];
}

export interface ILinksTabsResponse {
	tabs: IContentItem[];
}
