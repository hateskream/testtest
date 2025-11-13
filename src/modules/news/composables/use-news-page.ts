import { useRoute, useRouter } from 'vue-router';

export function useNewsPage() {
	const router = useRouter();
	const route = useRoute();

	function getPathString(id: string, slug: string, option: { memo: boolean }) {
		const base = `/news/${slug}/${id}`;

		if (!option.memo) {
			return base;
		}

		const separator = route.fullPath.includes('?') ? '&' : '?';
		return `${base}${separator}redirectedFrom=${encodeURIComponent(route.fullPath)}`;
	}

	async function redirect(id: string, slug: string) {
		await router.push(getPathString(id, slug, { memo: false }));
	}

	async function redirectWithMemo(id: string, slug: string) {
		await router.push(getPathString(id, slug, { memo: true }));
	}

	return { getPathString, redirect, redirectWithMemo };
}
