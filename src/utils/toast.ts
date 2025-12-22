function toastAnimatinonRemover(evt: AnimationEvent) {
    const _target = evt.currentTarget as HTMLDivElement;
    _target.classList.remove("animate");
}

export default toastAnimatinonRemover;
