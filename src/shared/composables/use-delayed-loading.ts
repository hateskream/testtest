import { ref, nextTick } from 'vue';

interface IOptions {
	delay?: number;
	immediate?: boolean;
}

export function useDelayedLoading(
	{
		delay,
		immediate,
	}: IOptions = {
		immediate: true,
		delay: 1_000,
	},
) {
	const loading = ref(false);

	function triggerLoading() {
		loading.value = true;

		nextTick(() => {
			setTimeout(() => {
				loading.value = false;
			}, delay);
		});
	}

	immediate && triggerLoading();

	return {
		loading,
		triggerLoading,
	};
}
