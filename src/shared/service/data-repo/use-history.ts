import { ref, toRaw, type UnwrapRef } from 'vue';

import { queryClient } from '../query-client';

interface IOptions<T> {
	key: string[];
	repository: (data: T) => Promise<void>;
	maxHistory?: number;
}


export function useHistoryManager<T>(options: IOptions<T>) {
	const undoStack = ref<T[]>([]);
	const redoStack = ref<T[]>([]);
	const MAX_HISTORY = options.maxHistory ?? 20;

	function pushToHistory(prev: T) {
		undoStack.value.push(JSON.parse(JSON.stringify(prev)));
		if (undoStack.value.length > MAX_HISTORY) {
			undoStack.value.shift();
		}
		redoStack.value = [];
	}

	function getCurrent(): T | undefined {
		return queryClient.getQueryData<T>(options.key);
	}

	function setState(state: T | UnwrapRef<T>) {
		const raw = toRaw(state) as T;
		queryClient.setQueryData<T>(options.key, raw);
		options.repository(raw);
		queryClient.invalidateQueries({ queryKey: options.key });
	}

	function undo() {
		if (undoStack.value.length === 0) {
			return;
		}
		const prev = undoStack.value.pop();
		if (prev) {
			const current = getCurrent();
			if (current) {
				redoStack.value.push(JSON.parse(JSON.stringify(current)));
			}
			setState(prev as T);
		}
	}

	function redo() {
		if (redoStack.value.length === 0) {
			return;
		}
		const next = redoStack.value.pop();
		if (next) {
			const current = getCurrent();
			if (current) {
				undoStack.value.push(JSON.parse(JSON.stringify(current)));
			}
			setState(next as T);
		}
	}

	function clearHistory() {
		undoStack.value = [];
		redoStack.value = [];
	}

	return {
		undoStack,
		redoStack,
		pushToHistory,
		undo,
		redo,
		clearHistory,
	};
}
