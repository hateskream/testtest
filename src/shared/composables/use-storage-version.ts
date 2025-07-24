// @ts-expect-error there is no error coz its defined in vite.config.ts
const APP_VERSION = __APP_VERSION__ as string;

export const useStorageVersion = () => {
	const VERSION_KEY = 'app_version';

	const compareVersions = () => {
		const savedVersion = localStorage.getItem(VERSION_KEY);
		return savedVersion === APP_VERSION;
	};

	const updateVersion = () => {
		localStorage.setItem(VERSION_KEY, APP_VERSION);
	};

	return {
		compareVersions,
		updateVersion,
	};
};
