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

export function compareDisplaySettings(settings1: IDisplaySettings, settings2: IDisplaySettings): boolean {
	return (
		settings1.isShowDate === settings2.isShowDate &&
        settings1.isShowSource === settings2.isShowSource &&
        settings1.isShowDesc === settings2.isShowDesc &&
        settings1.isShowAuthor === settings2.isShowAuthor &&
        settings1.isShowSymbols === settings2.isShowSymbols &&
        settings1.isShowScore === settings2.isShowScore &&
        settings1.isShowSentiment === settings2.isShowSentiment
	);
}
