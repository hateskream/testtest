import { notNullish } from '@vueuse/core';

import { isFeatureEnabled } from '@/shared/lib/feature-toggle.ts';

type DateFormatterOptions = Intl.DateTimeFormatOptions & { locale?: string };

type FormatterCacheKey = string;

export const CURRENT_LOCALE = navigator.language;
export const FALLBACK_LOCALE = 'en-US';

let localizationIsEnabled: boolean | undefined = undefined;

function getLocalizationIsEnabled() {
	if (localizationIsEnabled === undefined) {
		localizationIsEnabled = isFeatureEnabled('DATE_FORMAT_LOCALIZATION');
	}

	return localizationIsEnabled;
}

const formatters = new Map<FormatterCacheKey, Intl.DateTimeFormat>();

function buildCacheKey(
	locale: string,
	options: Intl.DateTimeFormatOptions,
): string {
	const optionsKey = Object.keys(options)
		.sort()
		.filter(key => notNullish((options as Record<string, unknown>)[key]))
		.map(key => `${key}:${(options as Record<string, unknown>)[key]}`)
		.join('|');

	return `${locale}|${optionsKey}`;
}

export function getDateFormatter(
	options: DateFormatterOptions = {},
): Intl.DateTimeFormat {
	const { locale = getLocalizationIsEnabled() ? CURRENT_LOCALE : FALLBACK_LOCALE } = options;

	const cacheKey = buildCacheKey(locale, options);

	let formatter = formatters.get(cacheKey);
	if (!formatter) {
		formatter = new Intl.DateTimeFormat(locale, options);
		formatters.set(cacheKey, formatter);
	}

	return formatter;
}
