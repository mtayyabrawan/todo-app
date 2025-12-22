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
import formatDate from "./utils/formatDate";

// types
import type { CreateTask, Status, Task } from "./types/main";
import toastAnimatinonRemover from "./utils/toast";

// DOM elements
const _searchForm = document.getElementById("search-form") as HTMLDivElement;
const _settingsForm = document.getElementById(
    "settings-form"
) as HTMLDivElement;
const _tasks = document.getElementById("tasks") as HTMLDivElement;
const _taskList = _tasks.children as HTMLCollectionOf<HTMLDivElement>;
const _markDone = document.getElementById("mark-done") as HTMLButtonElement;
const _markPending = document.getElementById(
    "mark-pending"
) as HTMLButtonElement;
const _markOverdue = document.getElementById(
    "mark-overdue"
) as HTMLButtonElement;
const _selectAll = document.getElementById("select-all") as HTMLButtonElement;
const _unSelect = document.getElementById("unselect") as HTMLButtonElement;
const _removeSelect = document.getElementById(
    "remove-selected"
) as HTMLButtonElement;
const _taskForm = document.getElementById("task-form") as HTMLFormElement;
const _categoryLists = document.getElementsByClassName(
    "categoryList"
) as HTMLCollectionOf<HTMLDataListElement>;
const _addNewBtn = _taskForm.children[5] as HTMLButtonElement;
const _textareas = document.querySelectorAll(
    "textarea"
) as NodeListOf<HTMLTextAreaElement>;
const _inputs = document.querySelectorAll(
    "input"
) as NodeListOf<HTMLInputElement>;
const _settingsBtn = document.getElementById(
    "settings-btn"
) as HTMLButtonElement;
const _newTaskBtn = document.getElementById("add-task") as HTMLButtonElement;
const _searchTaskBtn = document.getElementById(
    "search-tasks"
) as HTMLButtonElement;
const _selectedActions = document.getElementById(
    "selected-actions"
) as HTMLDivElement;
const _editModal = document.getElementById("edit-tasks") as HTMLDialogElement;
const _viewModal = document.getElementById("view-tasks") as HTMLDialogElement;
const _editForm = document.getElementById("edit-form") as HTMLFormElement;
const _toaster = document.querySelector("#toaster") as HTMLDivElement;

// global data variables
let tasks = getTasks();

let selectedTasks = 0;

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
_markDone.addEventListener("click", () => markStatusSelected("done"));
_markPending.addEventListener("click", () => markStatusSelected("pending"));
_markOverdue.addEventListener("click", () => markStatusSelected("overdue"));
_selectAll.addEventListener("click", selectAll);
_unSelect.addEventListener("click", unSelect);
_removeSelect.addEventListener("click", removeSelected);

// listener to remove single task node
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
    let deleteCount = 0;
    for (const _task of list) {
        if (_task.classList.contains("selected")) {
            unSelectTask(_task);
            deleteCount++;
            removeTask(
                _task.getAttribute("_id") as string,
                _task,
                false,
                false
            );
        }
    }
    toggleToast({
        title: "Tasks Deleted!",
        description: `${deleteCount} tasks deleted successfully!`,
        icon: "./cancel.svg",
        border: true,
    });
    setTasks();
}

// function to mark status of selected tasks
function markStatusSelected(status: Status) {
    let selectedCount = 0;

    for (const _task of _taskList) {
        if (_task.classList.contains("selected")) {
            selectedCount++;
            markStatus(_task, status);
        }
    }
    toggleToast({
        title: "Tasks Updated!",
        description: `${selectedCount} tasks marked as ${status} successfully!`,
        icon: "./icon-success-check.svg",
    });
    setTasks();
    unSelect();
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
    const _viewBtn = _task.children[2].children[0] as HTMLButtonElement;
    const _editBtn = _task.children[2].children[1] as HTMLButtonElement;
    const _removeBtn = _task.children[2].children[2] as HTMLButtonElement;
    _viewBtn.addEventListener("click", toggleModal);
    _editBtn.addEventListener("click", toggleModal);
    _removeBtn.addEventListener("click", singleRemover);
    _task.addEventListener("mousedown", listenSelector);
    return _task;
}

// function that controls selection of tasks element in DOM
function selectTask(_task: HTMLDivElement) {
    if (_task.classList.contains("selected")) return;
    selectedTasks++;
    if (!_selectedActions.classList.contains("flex")) {
        _selectedActions.classList.remove("hidden");
        _selectedActions.classList.add("flex");
    }
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
    if (!_task.classList.contains("selected")) return;
    selectedTasks--;
    if (selectedTasks === 0) {
        _selectedActions.classList.add("hidden");
        _selectedActions.classList.remove("flex");
    }
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
    task.status = task.status || "pending";
    task.createdAt = new Date().toLocaleString();
    if (tasks) {
        tasks.push(task as Task);
    } else {
        tasks = [task as Task];
    }
    setTasks();
    toggleToast({
        title: "New task added!",
        description: `"${task.title}" task created successfully!`,
        icon: "./icon-success-check.svg",
    });
    _tasks.appendChild(generateTask(task as Task));
}

function editTask(task: Task) {
    const { id } = task;
    if (tasks) {
        tasks = tasks.map(($task) => {
            if (id === $task.id) return task;
            return $task;
        }) as Task[];
    }
    setTasks();
    const _task = [..._taskList].find(
        ($task) => $task.getAttribute("_id") === id
    ) as HTMLDivElement;
    _task.remove();
    _tasks.appendChild(generateTask(task as Task));
}

// function to remove certian task weather from DOMor from localStorage
async function removeTask(
    id: string,
    _task: HTMLDivElement,
    db: boolean = false,
    toast: boolean = true
) {
    const removingTask = getTask(id);
    if (!removingTask) return "Task not found";
    tasks = tasks?.filter((task) => task.id !== removingTask.id)!;
    if (toast) {
        toggleToast({
            title: "Task Deleted!",
            description: `"${removingTask.title}" task deleted successfully!`,
            icon: "./cancel.svg",
            border: true,
        });
    }
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
    [..._categoryLists].forEach((_categoryList) => {
        _categoryList.innerHTML = ``;
        if (tasks !== null) {
            const categories = new Set(tasks.map((task) => task.category));
            for (const category of categories) {
                _categoryList.innerHTML += `<option value="${capitalize(category)}">${capitalize(category)}</option>`;
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", loadCategoryList);

// task creation listener
function taskSubmitHandler(event: SubmitEvent) {
    event.preventDefault();
    const _target = event.currentTarget as HTMLFormElement;
    const _submitBtn = _target.querySelector("button") as HTMLButtonElement;
    _submitBtn.disabled = true;
    const invalidField = _target.querySelector(":user-invalid") as
        | HTMLInputElement
        | HTMLTextAreaElement;
    if (invalidField) {
        invalidField.focus();
        _submitBtn.disabled = false;
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
    const formAction = _target.getAttribute("data-form-action") as
        | "create"
        | "edit";
    if (formAction === "create") {
        createTask(formData as CreateTask);
    } else {
        editTask(formData as Task);
        _editModal.close();
    }
    loadCategoryList();
    _target.reset();
    _submitBtn.disabled = false;
}

_taskForm.addEventListener("submit", taskSubmitHandler);
_editForm.addEventListener("submit", taskSubmitHandler);

function selectedActionsHandler() {
    _tasks.classList.remove("hidden");
    if (selectedTasks > 0) {
        _selectedActions.classList.remove("hidden");
    } else {
        _selectedActions.classList.add("hidden");
    }
}

_newTaskBtn.addEventListener("click", () => {
    if (_taskForm.classList.contains("hidden")) {
        _tasks.classList.add("hidden");
        _taskForm.classList.remove("hidden");
        _searchForm.classList.add("hidden");
        _settingsForm.classList.add("hidden");
        _selectedActions.classList.add("hidden");
    } else {
        _taskForm.classList.add("hidden");
        selectedActionsHandler();
    }
});

_searchTaskBtn.addEventListener("click", () => {
    if (_searchForm.classList.contains("hidden")) {
        _tasks.classList.add("hidden");
        _taskForm.classList.add("hidden");
        _searchForm.classList.remove("hidden");
        _settingsForm.classList.add("hidden");
        _selectedActions.classList.add("hidden");
    } else {
        _searchForm.classList.add("hidden");
        selectedActionsHandler();
    }
});

_settingsBtn.addEventListener("click", () => {
    if (_settingsForm.classList.contains("hidden")) {
        _tasks.classList.add("hidden");
        _taskForm.classList.add("hidden");
        _searchForm.classList.add("hidden");
        _settingsForm.classList.remove("hidden");
        _selectedActions.classList.add("hidden");
    } else {
        _settingsForm.classList.add("hidden");
        selectedActionsHandler();
    }
});

function markStatus(
    _task: HTMLDivElement,
    status: Status = "done",
    db: boolean = false
) {
    const task = getTask(_task.getAttribute("_id") as string);
    if (!task || task.status === status) return "Task not found";
    if (tasks !== null) {
        tasks = tasks.map(($task) => {
            return {
                ...$task,
                status: $task.id === task.id ? status : $task.status,
                dueDate:
                    status === "overdue"
                        ? formatDate(new Date().toISOString())
                        : $task.dueDate,
            };
        });
    }
    if (db) setTasks();
    ["done", "pending", "overdue"].forEach((sts) => {
        if (sts === status) {
            _task.classList.add(sts);
        } else {
            _task.classList.remove(sts);
        }
    });
}

function toggleModal(evt: MouseEvent) {
    const _target = evt.currentTarget as HTMLButtonElement;
    const id = _target.id;
    const action = _target.className as "edit" | "view";
    if (tasks) {
        const task = tasks.find(($task) => $task.id === id) as Task;
        if (action === "edit") {
            _editModal.showModal();
            const _inputs = _editForm.querySelectorAll(
                "input,textarea"
            ) as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;
            _inputs[0].value = task.title;
            _inputs[1].value = formatDate(new Date(task.dueDate).toISOString());
            _inputs[2].value = capitalize(task.category);
            _inputs[3].value = task.description;
            _inputs[4].value = task.id;
            _inputs[5].value = task.status;
            _inputs[6].value = task.createdAt;
        } else {
            _viewModal.showModal();
            const _nodes = _viewModal.children as HTMLCollectionOf<HTMLElement>;
            _nodes[0].innerText = task.title;
            _nodes[1].innerText = task.description;
            _nodes[2].innerText = capitalize(task.category);
            _nodes[3].innerText = capitalize(task.status);
            _nodes[3].id = task.status;
            _nodes[4].innerText = `Due Date : ${new Date(task.dueDate).toLocaleString()}`;
            _nodes[5].innerText = `Created At : ${new Date(task.createdAt).toLocaleString()}`;
        }
    }
}

[_editModal, _viewModal].forEach((_modal) => {
    _modal.addEventListener("click", (evt) => {
        const _target = evt.target as HTMLElement;
        if (_modal.isSameNode(_target)) _modal.close();
    });
});

function toggleToast({
    title,
    description,
    icon,
    border,
}: Record<"title" | "description" | "icon", string> & { border?: boolean }) {
    const _icon = _toaster.children[0] as HTMLImageElement;
    const _title = _toaster.children[1] as HTMLHeadingElement;
    const _description = _toaster.children[2] as HTMLParagraphElement;
    _title.innerText = title;
    _description.innerText = description;
    _icon.src = icon;
    if (border) {
        _icon.classList.add("border");
    }
    _toaster.classList.add("animate");
    _toaster.addEventListener("animationend", toastAnimatinonRemover);
}
