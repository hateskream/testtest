import { ref } from 'vue';

const numberKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

export type KeydownNumberKey = (typeof numberKeys)[number];
export type KeydownNumber = typeof numberKeys[number] extends `${infer N extends number}` ? N : never;

function isNumberKey(key: string): key is KeydownNumberKey {
	return numberKeys.some(value => value === key);
}

export type UseFilterKeydownHandler = (key: KeydownNumber, event: KeyboardEvent) => void;

export function useFilterKeydown(handler: UseFilterKeydownHandler) {
	const isActive = ref(false);

	function onKeydown(event: KeyboardEvent) {
		if (isNumberKey(event.key)) {
			handler(Number(event.key) as KeydownNumber, event);
		}
	}

	function start() {
		if (isActive.value) {
			return;
		}

		document.addEventListener('keydown', onKeydown);
		isActive.value = true;
	}

	function stop() {
		if (!isActive.value) {
			return;
		}

		document.removeEventListener('keydown', onKeydown);
		isActive.value = false;
	}

	return {
		start, stop, isActive,
	};
}
