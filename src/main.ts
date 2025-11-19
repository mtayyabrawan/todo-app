// icons
import selectedIcon from "./assets/selected.svg";
import notSelectedIcon from "./assets/notselected.svg";
import detailIcon from "./assets/detail.svg";
import editIcon from "./assets/edit.svg";
import removeIcon from "./assets/remove.svg";

// types
import type { Task } from "./types/main";

// DOM elements
const _tasks = document.getElementById("tasks") as HTMLDivElement;
const _taskList = _tasks.childNodes as NodeListOf<HTMLDivElement>;

// global data variables
let tasks = getTasks();

// fetching tasks from localStorage and appending them to DOM
for (const task of tasks!) {
    _tasks.appendChild(generateTask(task));
}

// adding selector event listener to all task elements
_taskList.forEach((_task) => {
    _task.addEventListener("mousedown", listenSelector);
});

// function to fetch all tasks from localStorage
function getTasks(): Task[] | null {
    let tasks = localStorage.getItem("todo_app_tasks");
    if (tasks === null || tasks.trim() === "") {
        return null;
    }
    return JSON.parse(tasks);
}

// function to generate DOM task element
function generateTask(task: Task) {
    const _task = document.createElement("div");
    _task.setAttribute("_id", task.id);
    _task.classList.add(...["task", "w-full", "flex", "ac"]);
    _task.innerHTML = `<div class="selection-manager hidden">
                    <input type="checkbox" id="${task.id}" class="hidden" />
                    <label for="${task.id}" class="w-full h-full">
                        <img src="${selectedIcon}" class="w-full h-full selected" />
                        <img src="${notSelectedIcon}" class="w-full h-full not-selected" />
                    </label>
                </div>
                <p>${task.title}</p>
                <div class="actions flex jc ac">
                    <button class="view" title="View more details">
                        <img src="${detailIcon}" class="w-full h-full" />
                    </button>
                    <button class="edit" title="Edit task">
                        <img src="${editIcon}" class="w-full h-full" />
                    </button>
                    <button class="remove" title="Remove task">
                        <img src="${removeIcon}" class="w-full h-full" />
                    </button>
                </div>`;
    return _task;
}

// function that controls selection and deselection of tasks element in DOM
function selectTask(_task: HTMLDivElement) {
    const _select = _task.children[0] as HTMLDivElement;
    const _selectionBtn = _select.children[0] as HTMLInputElement;
    const _actions = _task.children[2] as HTMLDivElement;
    _task.classList.add("selected");
    _task.addEventListener("dblclick", () => {
        _task.classList.remove("selected");
        _actions.classList.remove("hidden");
        _select.classList.add("hidden");
    });
    _select.classList.remove("hidden");
    _selectionBtn.checked = true;
    _selectionBtn.addEventListener("change", () => {
        _task.classList.remove("selected");
        _actions.classList.remove("hidden");
        _select.classList.add("hidden");
    });
    _actions.classList.add("hidden");
}

// listener to task elements for selection
function listenSelector(event: MouseEvent) {
    const _task = event.target as HTMLDivElement;
    const selectorTimer = setTimeout(() => selectTask(_task), 200);
    _task.addEventListener("mouseup", () => {
        clearTimeout(selectorTimer);
    });
    _task.addEventListener("mouseleave", () => {
        clearTimeout(selectorTimer);
    });
}
