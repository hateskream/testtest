export function generateRandomColor() {
	const letters = '0123456789ABCDEF';
	let color = '#';
	// oxlint-disable-next-line no-plusplus
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
