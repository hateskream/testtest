import type { App, Component } from 'vue';

declare global {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		__vcalendar_initialized__?: boolean;
	}
}

export {};

let promise: Promise<{ DatePicker: Component }> | null = null;
let currentApp: App | undefined;

export function registerVCalendar(app: App) {
	currentApp = app;

	if (!window.__vcalendar_initialized__) {
		window.__vcalendar_initialized__ = false;
	}
}

export function setupVCalendar() {
	if (promise) {
		return promise;
	}

	promise = new Promise((resolve, reject) => {
		if (currentApp === undefined) {
			reject(new Error('VCalendar is not registered'));
			return;
		}

		if (window.__vcalendar_initialized__) {
			const component = currentApp.component('VDatePicker');

			if (component) {
				return resolve({ DatePicker: component });
			}
		}

		window.__vcalendar_initialized__ = false;

		import('v-calendar').then(async module => {
			module.setupCalendar(currentApp!, {});

			currentApp!.component('VDatePicker', module.DatePicker);

			import('v-calendar/style.css').then(() => {
				window.__vcalendar_initialized__ = true;

				return resolve({ DatePicker: currentApp!.component('VDatePicker')! });
			}).catch(() => {
				window.__vcalendar_initialized__ = false;
				promise = null;
				reject();
			});
		}).catch(() => {
			window.__vcalendar_initialized__ = false;
			promise = null;
			reject();
		});
	});

	return promise;
}
