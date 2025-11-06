import { ref, onMounted, onUnmounted, computed, type Ref } from 'vue';

interface IScrollbarConfig {
	thumbSize: number;
	trackWidth: number;
	grabAreaPadding: number;
	borderRadius: number;
	borderWidth: number;
	fixedThumbLength: number;
	showOnHover?: boolean;
	hoverAreaExpand?: number;
}

const DEFAULT_CONFIG: IScrollbarConfig = {
	thumbSize: 6,
	trackWidth: 6,
	grabAreaPadding: 8,
	borderRadius: 6,
	borderWidth: 1,
	fixedThumbLength: 40,
	showOnHover: true,
	hoverAreaExpand: 4,
};

export function useCustomScrollbar(
	scrollContainerRef: Ref<HTMLElement | null>,
	config: Partial<IScrollbarConfig> = {},
) {
	const finalConfig = { ...DEFAULT_CONFIG, ...config };

	const showVerticalScrollbar = ref(false);
	const showHorizontalScrollbar = ref(false);
	const verticalThumbHeight = ref(0);
	const verticalThumbTop = ref(0);
	const horizontalThumbWidth = ref(0);
	const horizontalThumbLeft = ref(0);

	const isDraggingVertical = ref(false);
	const isDraggingHorizontal = ref(false);
	const dragStartY = ref(0);
	const dragStartX = ref(0);
	const scrollStartTop = ref(0);
	const scrollStartLeft = ref(0);

	const verticalTrackRef = ref<HTMLElement | null>(null);
	const horizontalTrackRef = ref<HTMLElement | null>(null);

	const updateScrollbars = () => {
		const container = scrollContainerRef.value;
		if (!container) {
			return;
		}

		const {
			scrollHeight,
			clientHeight,
			scrollTop,
			scrollWidth,
			clientWidth,
			scrollLeft,
		} = container;

		showVerticalScrollbar.value = scrollHeight > clientHeight;
		if (showVerticalScrollbar.value) {
			verticalThumbHeight.value = finalConfig.fixedThumbLength;

			const containerHeight = clientHeight;
			const availableTrackHeight =
				containerHeight - finalConfig.grabAreaPadding * 2 - finalConfig.fixedThumbLength;

			const maxScrollTop = scrollHeight - clientHeight;
			verticalThumbTop.value = maxScrollTop > 0 && availableTrackHeight > 0
				? (scrollTop / maxScrollTop) * availableTrackHeight
				: 0;
		}

		showHorizontalScrollbar.value = scrollWidth > clientWidth;
		if (showHorizontalScrollbar.value) {
			horizontalThumbWidth.value = finalConfig.fixedThumbLength;

			const containerWidth = clientWidth;
			const availableTrackWidth = containerWidth - finalConfig.grabAreaPadding * 2 - finalConfig.fixedThumbLength;

			const maxScrollLeft = scrollWidth - clientWidth;
			horizontalThumbLeft.value = maxScrollLeft > 0 && availableTrackWidth > 0
				? (scrollLeft / maxScrollLeft) * availableTrackWidth
				: 0;
		}
	};

	const setDraggingCursor = (isDragging: boolean) => {
		if (isDragging) {
			document.body.style.cursor = 'grabbing';
			document.body.style.userSelect = 'none';
		} else {
			document.body.style.cursor = '';
			document.body.style.userSelect = '';
		}
	};

	const handleVerticalMouseMove = (e: MouseEvent) => {
		if (!isDraggingVertical.value || !scrollContainerRef.value) {
			return;
		}

		const deltaY = e.clientY - dragStartY.value;
		const container = scrollContainerRef.value;
		const maxScrollTop = container.scrollHeight - container.clientHeight;

		const containerHeight = container.clientHeight;
		const availableTrackHeight = containerHeight - finalConfig.grabAreaPadding * 2 - finalConfig.fixedThumbLength;

		if (availableTrackHeight > 0 && maxScrollTop > 0) {
			const scrollRatio = maxScrollTop / availableTrackHeight;
			const newScrollTop = scrollStartTop.value + deltaY * scrollRatio;
			container.scrollTop = Math.max(0, Math.min(maxScrollTop, newScrollTop));
		}
	};

	const handleVerticalMouseUp = () => {
		isDraggingVertical.value = false;
		setDraggingCursor(false);
		document.removeEventListener('mousemove', handleVerticalMouseMove);
		document.removeEventListener('mouseup', handleVerticalMouseUp);
	};

	const handleVerticalMouseDown = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		isDraggingVertical.value = true;
		dragStartY.value = e.clientY;
		scrollStartTop.value = scrollContainerRef.value?.scrollTop || 0;
		setDraggingCursor(true);
		document.addEventListener('mousemove', handleVerticalMouseMove);
		document.addEventListener('mouseup', handleVerticalMouseUp);
	};

	const handleHorizontalMouseMove = (e: MouseEvent) => {
		if (!isDraggingHorizontal.value || !scrollContainerRef.value) {
			return;
		}

		const deltaX = e.clientX - dragStartX.value;
		const container = scrollContainerRef.value;
		const maxScrollLeft = container.scrollWidth - container.clientWidth;

		const containerWidth = container.clientWidth;
		const availableTrackWidth = containerWidth - finalConfig.grabAreaPadding * 2 - finalConfig.fixedThumbLength;

		if (availableTrackWidth > 0 && maxScrollLeft > 0) {
			const scrollRatio = maxScrollLeft / availableTrackWidth;
			const newScrollLeft = scrollStartLeft.value + deltaX * scrollRatio;
			container.scrollLeft = Math.max(0, Math.min(maxScrollLeft, newScrollLeft));
		}
	};

	const handleHorizontalMouseUp = () => {
		isDraggingHorizontal.value = false;
		setDraggingCursor(false);
		document.removeEventListener('mousemove', handleHorizontalMouseMove);
		document.removeEventListener('mouseup', handleHorizontalMouseUp);
	};

	const handleHorizontalMouseDown = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		isDraggingHorizontal.value = true;
		dragStartX.value = e.clientX;
		scrollStartLeft.value = scrollContainerRef.value?.scrollLeft || 0;
		setDraggingCursor(true);
		document.addEventListener('mousemove', handleHorizontalMouseMove);
		document.addEventListener('mouseup', handleHorizontalMouseUp);
	};

	const handleVerticalTrackClick = (e: MouseEvent) => {
		if (!verticalTrackRef.value || !scrollContainerRef.value) {
			return;
		}
		if ((e.target as HTMLElement).classList.contains('custom-scrollbar-thumb')) {
			return;
		}

		const rect = verticalTrackRef.value.getBoundingClientRect();
		const clickY = e.clientY - rect.top - finalConfig.grabAreaPadding;
		const thumbCenter = clickY - finalConfig.fixedThumbLength / 2;

		const container = scrollContainerRef.value;
		const maxScrollTop = container.scrollHeight - container.clientHeight;

		const containerHeight = container.clientHeight;
		const availableTrackHeight = containerHeight - finalConfig.grabAreaPadding * 2 - finalConfig.fixedThumbLength;

		if (availableTrackHeight > 0) {
			const scrollRatio = thumbCenter / availableTrackHeight;
			container.scrollTop = Math.max(0, Math.min(maxScrollTop, scrollRatio * maxScrollTop));
		}
	};

	const handleHorizontalTrackClick = (e: MouseEvent) => {
		if (!horizontalTrackRef.value || !scrollContainerRef.value) {
			return;
		}
		if ((e.target as HTMLElement).classList.contains('custom-scrollbar-thumb')) {
			return;
		}

		const rect = horizontalTrackRef.value.getBoundingClientRect();
		const clickX = e.clientX - rect.left - finalConfig.grabAreaPadding;
		const thumbCenter = clickX - finalConfig.fixedThumbLength / 2;

		const container = scrollContainerRef.value;
		const maxScrollLeft = container.scrollWidth - container.clientWidth;

		const containerWidth = container.clientWidth;
		const availableTrackWidth = containerWidth - finalConfig.grabAreaPadding * 2 - finalConfig.fixedThumbLength;

		if (availableTrackWidth > 0) {
			const scrollRatio = thumbCenter / availableTrackWidth;
			container.scrollLeft = Math.max(0, Math.min(maxScrollLeft, scrollRatio * maxScrollLeft));
		}
	};

	onMounted(() => {
		const container = scrollContainerRef.value;
		if (!container) {
			return;
		}

		updateScrollbars();
		container.addEventListener('scroll', updateScrollbars);
		window.addEventListener('resize', updateScrollbars);

		const resizeObserver = new ResizeObserver(updateScrollbars);
		resizeObserver.observe(container);

		onUnmounted(() => {
			container.removeEventListener('scroll', updateScrollbars);
			window.removeEventListener('resize', updateScrollbars);
			resizeObserver.disconnect();

			setDraggingCursor(false);

			document.removeEventListener('mousemove', handleVerticalMouseMove);
			document.removeEventListener('mouseup', handleVerticalMouseUp);
			document.removeEventListener('mousemove', handleHorizontalMouseMove);
			document.removeEventListener('mouseup', handleHorizontalMouseUp);
		});
	});

	const scrollbarStyles = computed(() => {
		const { thumbSize,
			trackWidth,
			borderRadius,
			borderWidth,
			fixedThumbLength,
			showOnHover,
			hoverAreaExpand } = finalConfig;

		return `
			.custom-scrollbar-container {
				position: relative;
			}

			.custom-scrollbar-track {
				position: absolute;
				z-index: 1000;
				background: transparent;
				${showOnHover ? `
					opacity: 0;
					transition: opacity 0.3s ease;
				` : ''}
			}

			/* Expanded hover area for vertical scrollbar */
			.custom-scrollbar-track.vertical::before {
				content: '';
				position: absolute;
				top: 0;
				bottom: 0;
				left: -${hoverAreaExpand}px;
				right: -${hoverAreaExpand}px;
				background: transparent;
			}

			/* Expanded hover area for horizontal scrollbar */
			.custom-scrollbar-track.horizontal::before {
				content: '';
				position: absolute;
				left: 0;
				right: 0;
				top: -${hoverAreaExpand}px;
				bottom: -${hoverAreaExpand}px;
				background: transparent;
			}

			/* Show scrollbars on hover of container, track, or when dragging */
			${showOnHover ? `
				.custom-scrollbar-container.is-hovered .custom-scrollbar-track,
				.custom-scrollbar-track:hover,
				.custom-scrollbar-track.is-dragging {
					opacity: 1;
				}

				/* Also show when hovering on the scrollbar content area */
				.custom-scrollbar-content:hover ~ .custom-scrollbar-track {
					opacity: 1;
				}
			` : ''}

			.custom-scrollbar-track.vertical {
				top: 0;
				right: 0;
				bottom: 0;
				width: ${trackWidth}px;
			}

			.custom-scrollbar-track.horizontal {
				left: 0;
				right: 0;
				bottom: 0;
				height: ${trackWidth}px;
			}

			.custom-scrollbar-track.horizontal.with-vertical {
				right: ${trackWidth}px;
			}

			.custom-scrollbar-track.vertical.with-horizontal {
				bottom: ${trackWidth}px;
			}

			.custom-scrollbar-thumb {
				position: absolute;
				background: var(--icon-color-base-300);
				border: ${borderWidth}px solid rgb(255 255 255 / 5%);
				border-radius: ${borderRadius}px;
				cursor: grab;
				transition: background 0.2s ease;
			}

			.custom-scrollbar-thumb:hover {
				background: var(--icon-color-base-300-effect);
			}

			.custom-scrollbar-thumb:active,
			.custom-scrollbar-thumb.dragging {
				cursor: grabbing;
				background: var(--icon-color-base-300-effect);
			}

			.custom-scrollbar-thumb.vertical {
				left: 50%;
				transform: translateX(-50%);
				width: ${thumbSize}px;
				height: ${fixedThumbLength}px;
			}

			.custom-scrollbar-thumb.horizontal {
				top: 50%;
				transform: translateY(-50%);
				height: ${thumbSize}px;
				width: ${fixedThumbLength}px;
			}

			.custom-scrollbar-content {
				scrollbar-width: none;
				-ms-overflow-style: none;
			}

			.custom-scrollbar-content::-webkit-scrollbar {
				display: none;
			}
		`;
	});

	return {
		showVerticalScrollbar,
		showHorizontalScrollbar,
		verticalThumbHeight,
		verticalThumbTop,
		horizontalThumbWidth,
		horizontalThumbLeft,
		isDraggingVertical,
		isDraggingHorizontal,
		verticalTrackRef,
		horizontalTrackRef,
		updateScrollbars,
		handleVerticalMouseDown,
		handleHorizontalMouseDown,
		handleVerticalTrackClick,
		handleHorizontalTrackClick,
		scrollbarStyles,
		config: finalConfig,
	};
}
