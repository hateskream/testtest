export type SegmentedBarSegment = {
	id: string | number;
	value: number;
	color: string;
};

export interface ISegmentedBarProps {
	/**
	 * List of segments
	 */
	segments: SegmentedBarSegment[];

	/**
	 * Height of each segment in pixels.
	 * @default 14
	 */
	segmentHeight?: number;

	/**
	 * Minimum width of a segment in pixels.
	 * If calculated width is smaller, this value will be used instead.
	 * @default 2
	 */
	minSegmentWidth?: number;

	/**
	 * Gap between segments in pixels.
	 * @default 1
	 */
	gap?: number;

	/**
	 * Whether to render delimiters between segments.
	 */
	showDelimiter?: boolean;

	/**
	 * Width of the delimiter in pixels.
	 * @default 1
	 */
	delimiterWidth?: number;

	/**
	 * Color of the delimiter between segments.
	 * If not provided, the delimiter color falls back to the color of the segment.
	 */
	delimiterColor?: string;
}
