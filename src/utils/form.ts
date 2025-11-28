export function cleaner(evt: InputEvent) {
    const _target = evt.currentTarget as HTMLInputElement | HTMLTextAreaElement;
    let value = _target.value.trimStart();
    _target.value = value
        .replace(/[\n]+/g, "\n")
        .replace(/([^\n^\w][\s])+/g, " ");
}

export function enterSubmit(evt: KeyboardEvent, _btn: HTMLButtonElement) {
    if (evt.key === "Enter" && !evt.shiftKey && !evt.altKey && !evt.ctrlKey) {
        _btn.click();
    }
}
