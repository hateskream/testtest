import { inject, provide } from 'vue';

const PINNED_LEVEL_KEY = Symbol('PINNED_LEVEL');

export function providePinnedLevel(level = 1) {
	provide(PINNED_LEVEL_KEY, level);
	return level;
}

export function usePinnedLevel() {
	return inject<number>(PINNED_LEVEL_KEY, 1);
}
