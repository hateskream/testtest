import { useHead } from '@unhead/vue';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useRoute } from 'vue-router';

type UseAppHeadOptions = {
	appName?: string;
	title?: MaybeRefOrGetter<string>;
	description?: MaybeRefOrGetter<string>;
};

export function useAppHead(options: UseAppHeadOptions = {}) {
	const route = useRoute();

	const appName = computed(() => options.appName ?? 'i88');

	const title = computed(() => toValue(options.title) ?? route.meta.title ?? appName.value);
	const description = computed(() => toValue(options.description) ?? route.meta.description ?? appName.value);

	// TODO: Change to correct url
	const canonical = computed(() => `https://demo-front.planet9.uk${route.path}`);

	// TODO: Twitter image, site link in tw, etc..

	useHead({
		title,
		meta: [
			{ name: 'description', content: description },
			{ name: 'robots', content: 'index,follow' },
			{ property: 'og:type', content: 'website' },
			{ property: 'og:title', content: title },
			{ property: 'og:description', content: description },
			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'twitter:title', content: title },
			{ name: 'twitter:description', content: description },
		],
		link: [
			{ rel: 'canonical', href: canonical },
		],
	});
}
