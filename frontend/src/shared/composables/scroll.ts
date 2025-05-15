import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { useEventListener, useScrollLock } from '@vueuse/core'

type ScrollCallback = (offset: number) => void

export function useCustomScroll(container: Ref<HTMLElement | null>, onScroll: ScrollCallback) {
	const offset = ref(0)
	const maxScroll = ref(0)
	const isLocked = useScrollLock(document.body)
	const lastTouchY = ref<number | null>(null)

	const clamp = (val: number) => Math.min(Math.max(0, val), maxScroll.value)

	const handleScroll = (delta: number) => {
		offset.value = clamp(offset.value + delta)
		onScroll(offset.value)
	}

	const onWheel = (e: WheelEvent) => {
		e.preventDefault()
		handleScroll(e.deltaY)
	}

	const onTouchStart = (e: TouchEvent) => {
		lastTouchY.value = e.touches[0].clientY
	}

	const onTouchMove = (e: TouchEvent) => {
		e.preventDefault()
		const currentY = e.touches[0].clientY
		if (lastTouchY.value !== null) {
			handleScroll(lastTouchY.value - currentY)
		}
		lastTouchY.value = currentY
	}

	const onTouchEnd = () => {
		lastTouchY.value = null
	}

	onMounted(() => {
		isLocked.value = true

		if (container.value) {
			maxScroll.value = container.value.scrollHeight - container.value.clientHeight
		}

		useEventListener(container, 'wheel', onWheel, { passive: false })
		useEventListener(container, 'touchstart', onTouchStart, { passive: false })
		useEventListener(container, 'touchmove', onTouchMove, { passive: false })
		useEventListener(container, 'touchend', onTouchEnd, { passive: false })
	})

	onUnmounted(() => {
		isLocked.value = false
	})

	return {
		maxScroll,
		offset
	}
}
