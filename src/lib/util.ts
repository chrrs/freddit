export function resetAfterSubmit(e: Event) {
	// @ts-expect-error reset is a function on form events.
	setTimeout(() => e.target?.reset());
}

export function validateSort(sort: string | undefined): boolean {
	return sort === undefined || ['hot', 'top', 'rising', 'controversial', 'new'].includes(sort);
}
