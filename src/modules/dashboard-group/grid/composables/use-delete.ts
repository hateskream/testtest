import { inject, provide, ref, type Ref } from 'vue';

const deleteKey = Symbol('deleteKey');

interface IDeleteProvider {
	canDelete: Ref<boolean>;
}

export function useDelete() {
	const canDelete = ref(false);

	function provideCanDelete() {
		provide<IDeleteProvider>(deleteKey, { canDelete });
	}

	function setCanDelete(value: boolean) {
		canDelete.value = value;
	}

	return {
		provideCanDelete,
		setCanDelete,
	};
}

export function useInjectCanDelete() {
	const { canDelete } = inject(deleteKey) as IDeleteProvider;

	return {
		canDelete,
	};
}
