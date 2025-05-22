import { inject, provide, type Component } from 'vue';

const CurrentDashboardSymbol = Symbol('CurrentDashboard');

export function useProvideCurrentDashboard() {
	function provideComponent(component: Component) {
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
