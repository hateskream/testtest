import { useHead } from '@unhead/vue';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useRoute } from 'vue-router';

interface IUseAppHeadOptions {
	/**
	 * Keep titles under 60 characters to avoid truncation in search results
	 */
	title?: MaybeRefOrGetter<string>;
	titleTemplate?: MaybeRefOrGetter<string>;
	description?: MaybeRefOrGetter<string>;
	/**
	 * Image url for og:image and twitter:image
	 */
	image?: MaybeRefOrGetter<string>;
}

export function useAppHead(options: IUseAppHeadOptions = {}) {
	const route = useRoute();

	const title = computed(() => toValue(options.title) ?? route.meta.title);
	const description = computed(() => toValue(options.description) ?? route.meta.description);

	const defaultTitleTemplate = '%s %separator %appName';
	const titleTemplate = computed(() =>
		toValue(options.titleTemplate) ??
		route.meta.titleTemplate ??
		defaultTitleTemplate,
	);

	const defaultImage = '/images/preview.png';
	const image = computed(() => toValue(options.image) ?? route.meta.image ?? defaultImage);

	// og-title, og-description infer from title, description
	useHead({
		title,
		titleTemplate,
		meta: [
			{ name: 'description', content: description },
			{ name: 'robots', content: 'index,follow' },
			{ property: 'og:type', content: 'website' },
			{ property: 'og:image', content: image },
			{ property: 'twitter:card', content: 'summary_large_image' },
			{ property: 'twitter:title', content: title },
			{ property: 'twitter:description', content: description },
			{ property: 'twitter:image', content: image },
		],
	});
}
