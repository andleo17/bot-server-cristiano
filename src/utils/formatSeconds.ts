export function formatSeconds(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const restOfSeconds = seconds % 60;

	return `${minutes.toString().padStart(2, '0')}:${restOfSeconds
		.toString()
		.padStart(2, '0')}`;
}
