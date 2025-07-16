import { watch, type Ref } from 'vue';

export function useLoadDashboard(colNum: Ref<number>, loader: ((cn: number)=> void)) {
	watch(
		() => colNum.value,
		cn => {
			loader(cn);
		},
	);
}
