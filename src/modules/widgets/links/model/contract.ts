export interface IWebsite {
	label: string;
	url: string;
}

export interface ISocialsItem {
	icon: string;
	url: string;
}

export interface ILinksTabsResponse {
	website: IWebsite;
	socials: ISocialsItem[];
	tags?: string[];
	summarized?: string;
}

export interface ILinksTabsRequest {
	tickerId: string;
}
