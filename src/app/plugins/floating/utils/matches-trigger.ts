import type { FloatingTriggers } from '@/app/plugins/floating';

export function matchesTrigger(
	trigger: FloatingTriggers | FloatingTriggers[],
	value: FloatingTriggers | FloatingTriggers[],
) {
	const triggerArr = Array.isArray(trigger) ? trigger : [trigger];
	const valueArr = Array.isArray(value) ? value : [value];
	return triggerArr.some(t => valueArr.includes(t));
}
