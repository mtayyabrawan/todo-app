import type { ContactData } from "./types/main";

const _form = document.querySelector("form") as HTMLFormElement;
const _formBtn = document.querySelector("button") as HTMLButtonElement;
const _inputs = document.querySelectorAll(
    "input"
) as NodeListOf<HTMLInputElement>;
const _textarea = document.querySelector("textarea") as HTMLTextAreaElement;
const _success = document.querySelector("#success") as HTMLDivElement;

function cleaner(evt: InputEvent) {
    const _target = evt.currentTarget as HTMLInputElement | HTMLTextAreaElement;
    let value = _target.value.trimStart();
    _target.value = value
        .replace(/[\n]+/g, "\n")
        .replace(/([^\n^\w][\s])+/g, " ");
}

for (const _input of [..._inputs, _textarea]) {
    _input.addEventListener(
        "input",
        cleaner as EventListenerOrEventListenerObject
    );
}

_textarea.addEventListener("keypress", (evt) => {
    if (evt.key === "Enter" && !evt.shiftKey && !evt.altKey && !evt.ctrlKey) {
        _formBtn.click();
    }
});

_form.addEventListener("submit", (event) => {
    _formBtn.disabled = true;
    event.preventDefault();
    const _target = event.currentTarget as HTMLFormElement;
    const invalidField = _target.querySelector(":user-invalid") as
        | HTMLInputElement
        | HTMLTextAreaElement;
    if (invalidField) {
        invalidField.focus();
        _formBtn.disabled = false;
        return;
    }
    const fd = new FormData(_target);
    const formData: Partial<ContactData> = {};
    fd.forEach((val, key) => {
        formData[key as keyof ContactData] = val.toString().trim();
    });
    // Do some api stuff here
    _form.reset();
    _formBtn.disabled = false;
    _success.classList.add("animate");
});

_success.addEventListener("animationend", (evt) => {
    const _target = evt.currentTarget as HTMLDivElement;
    _target.classList.remove("animate");
});
