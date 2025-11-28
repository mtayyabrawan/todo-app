// icons
import selectedIcon from "./assets/selected.svg";
import notSelectedIcon from "./assets/notselected.svg";
import detailIcon from "./assets/detail.svg";
import editIcon from "./assets/edit.svg";
import removeIcon from "./assets/remove.svg";

// utilities
import capitalize from "./utils/capitalize";
import { cleaner, enterSubmit } from "./utils/form";
import randomId from "./utils/randomId";

// types
import type { CreateTask, Task } from "./types/main";

// DOM elements
const _tasks = document.getElementById("tasks") as HTMLDivElement;
const _taskList = _tasks.children as HTMLCollectionOf<HTMLDivElement>;
const _selectAll = document.getElementById("select-all") as HTMLButtonElement;
const _unSelect = document.getElementById("unselect") as HTMLButtonElement;
const _removeSelect = document.getElementById(
    "remove-selected"
) as HTMLButtonElement;
const _taskForm = document.querySelector("form") as HTMLFormElement;
const _categoryList = _taskForm.children[3].children[2] as HTMLDataListElement;
const _addNewBtn = _taskForm.children[5] as HTMLButtonElement;
const _textareas = document.querySelectorAll(
    "textarea"
) as NodeListOf<HTMLTextAreaElement>;
const _inputs = document.querySelectorAll(
    "input"
) as NodeListOf<HTMLInputElement>;

// global data variables
let tasks = getTasks();

// function to generate all tasks
function generateTasks() {
    if (tasks !== null)
        for (const task of tasks) {
            _tasks.appendChild(generateTask(task));
        }
}

// function to set tasks array to localStorage
function setTasks() {
    localStorage.setItem("todo_app_tasks", JSON.stringify(tasks));
}

generateTasks();

// global task selection and deselection listeners
_selectAll.addEventListener("click", selectAll);
_unSelect.addEventListener("click", unSelect);
_removeSelect.addEventListener("click", removeSelected);

// listener to remove sngle task node
function singleRemover(evt: MouseEvent) {
    const btn = evt.currentTarget as HTMLButtonElement;
    removeTask(
        btn.id,
        btn.parentElement?.parentElement as HTMLDivElement,
        true
    );
}

// function to unselect all currently selected tasks DOM elements
function selectAll() {
    for (const _task of _taskList) {
        if (_task.classList.contains("selected")) continue;
        selectTask(_task);
    }
}

// function to select all tasks DOM elements
function unSelect() {
    for (const _task of _taskList) {
        if (!_task.classList.contains("selected")) continue;
        unSelectTask(_task);
    }
}

// function to remove selected tasks first removes DOM nodes and then removes from localStorage
function removeSelected() {
    const list = [..._taskList];
    for (const _task of list) {
        if (_task.classList.contains("selected")) {
            removeTask(_task.getAttribute("_id") as string, _task);
        }
    }
    setTasks();
}

// function to fetch all tasks from localStorage
function getTasks(): Task[] | null {
    let tasks = localStorage.getItem("todo_app_tasks");
    if (tasks === null || tasks.trim() === "") {
        return null;
    }
    return JSON.parse(tasks);
}

// function to get task by id
function getTask(id: string): Task | undefined {
    return tasks?.find((task) => task.id === id.trim());
}

// function to generate DOM task element
function generateTask(task: Task) {
    const _task = document.createElement("div");
    _task.setAttribute("_id", task.id);
    _task.classList.add(...["task", "w-full", "flex", "ac", task.status]);
    _task.innerHTML = `<div class="selection-manager hidden">
                    <input type="checkbox" id="${task.id}" class="hidden" />
                    <label for="${task.id}" class="w-full h-full">
                        <img src="${selectedIcon}" class="w-full h-full selected" />
                        <img src="${notSelectedIcon}" class="w-full h-full not-selected" />
                    </label>
                </div>
                <p>${task.title}</p>
                <div class="actions flex jc ac">
                    <button class="view" title="View more details" id="${task.id}">
                        <img src="${detailIcon}" class="w-full h-full" />
                    </button>
                    <button class="edit" title="Edit task" id="${task.id}">
                        <img src="${editIcon}" class="w-full h-full" />
                    </button>
                    <button class="remove" title="Remove task" id="${task.id}">
                        <img src="${removeIcon}" class="w-full h-full" />
                    </button>
                </div>`;
    const _removeBtn = _task.children[2].children[2] as HTMLButtonElement;
    _removeBtn.addEventListener("click", singleRemover);
    _task.addEventListener("mousedown", listenSelector);
    return _task;
}

// function that controls selection of tasks element in DOM
function selectTask(_task: HTMLDivElement) {
    const _select = _task.children[0] as HTMLDivElement;
    const _selectionBtn = _select.children[0] as HTMLInputElement;
    const _actions = _task.children[2] as HTMLDivElement;
    _task.classList.add("selected");
    _task.addEventListener("dblclick", () => unSelectTask(_task));
    _select.classList.remove("hidden");
    _selectionBtn.checked = true;
    _selectionBtn.addEventListener("change", () => unSelectTask(_task));
    _actions.classList.add("hidden");
}

// function to unselect a certian task
function unSelectTask(_task: HTMLDivElement) {
    const _select = _task.children[0] as HTMLDivElement;
    const _actions = _task.children[2] as HTMLDivElement;
    _task.classList.remove("selected");
    _actions.classList.remove("hidden");
    _select.classList.add("hidden");
}

// listener to task elements for selection
function listenSelector(event: MouseEvent) {
    const _task = event.currentTarget as HTMLDivElement;
    const _actions = _task.querySelector(".actions");
    const _target = event.target as HTMLElement;
    if (_actions?.contains(_target)) return;
    const selectorTimer = setTimeout(() => selectTask(_task), 200);
    _task.addEventListener("mouseup", () => {
        clearTimeout(selectorTimer);
    });
    _task.addEventListener("mouseleave", () => {
        clearTimeout(selectorTimer);
    });
}

// function to create new tasks and append it to DOM
function createTask(task: CreateTask) {
    task.id = randomId({ inner: 6, outer: 4 });
    if (!task.status) task.status = "pending";
    task.createdAt = new Date().toLocaleString();
    if (tasks) {
        tasks.push(task as Task);
    } else {
        tasks = [task as Task];
    }
    setTasks();
    _tasks.appendChild(generateTask(task as Task));
}

// function to remove certian task weather from DOMor from localStorage
async function removeTask(
    id: string,
    _task: HTMLDivElement,
    db: boolean = false
) {
    const removingTask = getTask(id);
    if (!removingTask) return "Task not found";
    tasks = tasks?.filter((task) => task.id !== removingTask.id)!;
    _task.remove();
    if (db) {
        setTasks();
    }
}

for (const _input of [..._inputs, ..._textareas]) {
    _input.addEventListener(
        "input",
        cleaner as EventListenerOrEventListenerObject
    );
}

for (const _textarea of [..._textareas]) {
    _textarea.addEventListener("keypress", (evt) =>
        enterSubmit(evt, _addNewBtn)
    );
}

// loads existing task categories to te datalist
function loadCategoryList() {
    _categoryList.innerHTML = ``;
    if (tasks !== null) {
        const categories = new Set(tasks?.map((task) => task.category));
        for (const category of categories) {
            _categoryList.innerHTML += `<option value="${capitalize(category)}">${capitalize(category)}</option>`;
        }
    }
}

document.addEventListener("DOMContentLoaded", loadCategoryList);

// task creation listener
function taskCreator(event: SubmitEvent) {
    event.preventDefault();
    _addNewBtn.disabled = true;
    const _target = event.currentTarget as HTMLFormElement;
    const invalidField = _target.querySelector(":user-invalid") as
        | HTMLInputElement
        | HTMLTextAreaElement;
    if (invalidField) {
        invalidField.focus();
        _addNewBtn.disabled = false;
        return;
    }
    const fd = new FormData(_target);
    const formData: Partial<CreateTask> = {};
    fd.forEach((val, key) => {
        const value = val.toString().trim();
        switch (key) {
            case "status":
                formData.status = value as CreateTask["status"];
                break;
            default:
                formData[key as keyof Omit<CreateTask, "status">] = value;
        }
    });
    if (formData.category) formData.category = formData.category.toLowerCase();
    createTask(formData as CreateTask);
    loadCategoryList();
    _taskForm.reset();
    _addNewBtn.disabled = false;
}

_taskForm.addEventListener("submit", taskCreator);
