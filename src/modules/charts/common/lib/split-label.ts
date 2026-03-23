export function createSplitLabel(
	leftText: string,
	rightText: string,
	backgroundColor: string,
	textColor: string,
) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d')!;

	const paddingX = 7;
	const height = 16;
	const gap = 1;

	ctx.font = '520 9px \'Roboto Flex Variable\', sans-serif';

	const leftTextWidth = ctx.measureText(leftText).width;
	const rightTextWidth = ctx.measureText(rightText).width;

	const leftWidth = leftTextWidth + paddingX * 2;
	const rightWidth = rightTextWidth + paddingX * 2;

	canvas.width = leftWidth + rightWidth + gap;
	canvas.height = height;

	ctx.fillStyle = backgroundColor;
	ctx.beginPath();
	ctx.roundRect(0, 0, leftWidth, height, [6, 0, 0, 6]);
	ctx.fill();

	ctx.beginPath();
	ctx.roundRect(leftWidth + gap, 0, rightWidth, height, [0, 6, 6, 0]);
	ctx.fill();

	ctx.fillStyle = textColor;
	ctx.textBaseline = 'middle';
	ctx.fillText(leftText, paddingX, height / 2);

	ctx.fillText(rightText, leftWidth + gap + paddingX, height / 2);

	return canvas;
}
