export interface IWebsite {
	label: string;
	link: string;
}

export interface ISocialsItem {
	logo_url: string;
	link: string;
}

export interface ILinksTabsResponse {
	ticker_id: string;
	website?: IWebsite;
	socials?: ISocialsItem[];
	tags?: string[];
}

export interface ILinksTabsRequest {
	ticker_id: string;
}
