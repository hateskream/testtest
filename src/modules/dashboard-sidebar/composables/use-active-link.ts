import { useRoute } from 'vue-router';

export function useActiveLink() {
	const route = useRoute();

	function isActive(routeName: string) {
		return route.name === routeName;
	}

	return {
		isActive,
	};
}
