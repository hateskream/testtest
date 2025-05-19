import { inject, provide, readonly, ref, type Ref } from 'vue';

import type { IDashboardInstance } from '@/modules/dashboard-group';

const provideDndKey = Symbol('provideDndKey');

type DnDFuncType = () => void;
type SetterType = (func: DnDFuncType) => void;

interface IDnDProvider {
	setDrag: SetterType;
	setDragEnd: SetterType;
	newDashboard: Ref<IDashboardInstance | null>;
}

export function useDndHandler() {
	const drag = ref<DnDFuncType>(() => {});
	const dragEnd = ref<DnDFuncType>(() => {});
	const newDashboard = ref<IDashboardInstance | null>(null);


	function provideSetterDndHandler() {
		provide<IDnDProvider>(provideDndKey, {
			setDrag,
			setDragEnd,
			newDashboard,
		});
	}

	function setDrag(func: () => void) {
		drag.value = func;
	}

	function setDragEnd(func: () => void) {
		dragEnd.value = func;
	}

	function setNewDashboard(dashboard: IDashboardInstance | null) {
		newDashboard.value = dashboard;
	}

	return {
		provideSetterDndHandler,
		onDrag: readonly(drag),
		onDragEnd: readonly(dragEnd),
		setNewDashboard,
	};
}

export function useInjectSetterDndHandler() {
	const dnDProvider = inject(provideDndKey) as IDnDProvider;

	return {
		dnDProvider,
	};
}
