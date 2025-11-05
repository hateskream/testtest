import {
	Fragment,
	type SlotsType,
	type VNode,
} from 'vue';
import { unrefElement } from '@vueuse/core';
import {
	defineComponent,
	h,
	ref,
	toRefs,
} from 'vue';

import { usePresence } from '@/shared/ui/presence/use-presence.ts';

export default defineComponent({
	name: 'PresenceComponent',
	props: {
		state: {
			type: Boolean,
			required: true,
		},
		forceMount: {
			type: Boolean,
		},
	},
	slots: {} as SlotsType<{
		default: (opts: { present: boolean }) => VNode[];
	}>,
	setup(props, { slots, expose }) {
		const { state, forceMount } = toRefs(props);

		const node = ref<HTMLElement>();
		const { isPresent } = usePresence(state, node);
		expose({ present: isPresent });

		let children = slots.default({ present: isPresent.value });

		children = renderSlotFragments(children || []);

		if (children && children?.length > 1) {
			throw new Error('invalid children. must be only 1 root');
		}

		return () => {
			if (forceMount.value || state.value || isPresent.value) {
				return h(slots.default({ present: isPresent.value })[0] as VNode, {
					ref: (v) => {
						const el = unrefElement(v as HTMLElement);

						if (typeof el?.hasAttribute === 'undefined') {
							return el;
						}

						return el;
					},
				});
			} else {
				return null;
			}
		};
	},
});

export function renderSlotFragments(children?: VNode[]): VNode[] {
	if (!children) {
		return [];
	}
	return children.flatMap((child) => {
		if (child.type === Fragment) {
			return renderSlotFragments(child.children as VNode[]);
		}

		return [child];
	});
}
