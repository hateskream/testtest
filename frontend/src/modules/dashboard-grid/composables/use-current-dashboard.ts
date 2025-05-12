import { inject, provide, type Component } from 'vue';

const CurrentDashboardSymbol = Symbol('CurrentDashboard');

export function useProvideCurrentDashboard() {
	function provideComponent(component: Component) {
		if (!component) {
			throw new Error('Current dashboard component is not provided');
		}

		provide(CurrentDashboardSymbol, component);
	}

	return {
		provideComponent,
	};
}

export function useInjectCurrentDashboardInject() {
	const currentDashboard = inject(CurrentDashboardSymbol) as Component;

	return {
		currentDashboard,
	};
}
