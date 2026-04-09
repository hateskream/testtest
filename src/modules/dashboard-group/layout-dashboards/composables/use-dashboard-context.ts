import { inject, type InjectionKey, provide } from 'vue';

import type { ISection, IWidget, WidgetState } from '../model';

export interface IDashboardContext {
	updateWidgetState: (widgetId: string, state: WidgetState) => void;
	setWidgetStateType: (widgetId: string, stateType: string) => void;
	changeHeightWidget: (sectionId: string, widgetId: string, height: number) => void;
	changeMaxCountRowWidget: (sectionId: string, widgetId: string, maxCountRow: number) => void;
	changeWidthSection: (sectionId: string, width: number) => void;
	changeOrderWidgetsInSection: (sectionId: string, widgets: IWidget[], sectionHeight: number) => void;
	changeOrderSections: (sections: ISection[]) => void;
}

const DashboardContextKey: InjectionKey<IDashboardContext> = Symbol('DashboardContext');

export function createDashboardContext(context: IDashboardContext): IDashboardContext {
	provide(DashboardContextKey, context);

	return context;
}

export function useDashboardContext(): IDashboardContext {
	const context = inject(DashboardContextKey);

	if (!context) {
		throw new Error('useDashboardContext must be used within a dashboard layout');
	}

	return context;
}
