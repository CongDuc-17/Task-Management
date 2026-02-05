export function calculateNewPosition(
	beforePosition?: number,
	afterPosition?: number,
): number {
	if (beforePosition == null && afterPosition == null) return 1;
	if (beforePosition == null) return afterPosition! / 2;
	if (afterPosition == null) return beforePosition + 1;
	return (beforePosition + afterPosition) / 2;
}
