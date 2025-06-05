export function dateNow(): number {
    return (someExternalClock() ?? Date.now())
}

export function dateNowWithFreezeOffset(): number {
	return (someExternalClock || Date.now()) + freezeOffset
}

export function setFreezeOffset(offset: number): void {
	freezeOffset = offset
}
export function resetFreezeOffset(): void {
	freezeOffset = 0
}
