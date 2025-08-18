export interface IDisplaySettings {
	isShowDate: boolean;
	isShowSource: boolean;
	isShowDesc: boolean;
	isShowAuthor: boolean;
	isShowSymbols: boolean;
	isShowScore: boolean;
	isShowSentiment: boolean;
}

export type SettingKey = keyof IDisplaySettings;

export function toggleSetting(settings: IDisplaySettings, key: SettingKey): IDisplaySettings {
	return { ...settings, [key]: !settings[key] };
}
