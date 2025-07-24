// @ts-expect-error there is no error coz its defined in vite.config.ts
const APP_VERSION = __APP_VERSION__ as string;

export const useStorageVersion = () => {
	const VERSION_KEY = 'app_version';

	const clearAllCookies = () => {
		document.cookie.split(';').forEach(cookie => {
			const eqPos = cookie.indexOf('=');
			const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
		});
	};

	const clearLocalStorage = () => {
		localStorage.clear();
	};

	const compareVersions = () => {
		const savedVersion = localStorage.getItem(VERSION_KEY);
		return savedVersion === APP_VERSION;
	};

	const updateVersion = () => {
		localStorage.setItem(VERSION_KEY, APP_VERSION);
	};

	return {
		clearAllCookies,
		clearLocalStorage,
		compareVersions,
		updateVersion,
	};
};
