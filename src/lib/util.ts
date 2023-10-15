export function resetAfterSubmit(e: Event) {
	// @ts-expect-error reset is a function on form events.
	setTimeout(() => e.target?.reset());
}
