import moveFocusInside, { focusInside, focusIsHidden } from 'focus-lock';

const makeFocusManager = () => {
	let trappedDomNodes: HTMLElement[] = [];
	let lastActiveElement: Element | null = null;

	const hasTrapped = () => !!trappedDomNodes.length;

	const isTrapped = (node: HTMLElement) => trappedDomNodes.includes(node);

	const focusOnBody = () => document.activeElement === document.body;

	const isFreeFocus = () => focusOnBody() || focusIsHidden();

	const lastTrapped = () => trappedDomNodes[trappedDomNodes.length - 1];

	const activateTrap = (domNode: HTMLElement, preventScroll?: boolean) => {
		if (!isFreeFocus() && !focusInside(domNode)) {
			moveFocusInside(domNode, lastActiveElement || document.body, { focusOptions: { preventScroll } });
			lastActiveElement = document.activeElement;
		}
	};

	const addDomNode = (domNode: HTMLElement, preventScroll?: boolean) => {
		if (!isTrapped(domNode)) {
			trappedDomNodes.push(domNode);
			activateTrap(domNode, preventScroll);
		}
	};

	const removeDomNode = (domNode: HTMLElement) => {
		trappedDomNodes = trappedDomNodes.filter(trapped => trapped !== domNode);

		if (hasTrapped()) {
			activateTrap(lastTrapped());
		}
	};

	const globalFocusInHandler = () => {
		if (hasTrapped()) {
			activateTrap(lastTrapped());
		}
	};

	const attachHandler = () => {
		document.addEventListener('focusin', globalFocusInHandler);
	};

	const detachHandler = () => {
		document.removeEventListener('focusin', globalFocusInHandler);
	};

	return {
		lockFocus(domNode: HTMLElement, preventScroll?: boolean): void {
			if (!hasTrapped()) {
				attachHandler();
			}

			addDomNode(domNode, preventScroll);
		},
		unlockFocus(domNode: HTMLElement): void {
			removeDomNode(domNode);

			if (!hasTrapped()) {
				detachHandler();
			}
		},
	};
};

export const { lockFocus, unlockFocus } = makeFocusManager();
