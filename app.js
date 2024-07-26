let tasks = [];
let app = document.querySelector(".mainApp");
let todoImg = document.querySelector(".todoImg");
let buttons = document.querySelectorAll(".editMenu .buttons");
let appWelcome = document.createElement("div");
appWelcome.classList.add("appWelcome");
appWelcome.setAttribute("id", "appWelcome");
let appHeading = document.createElement("h1");
appHeading.classList.add("appHeading");
let appPara = document.createElement("p");
appPara.classList.add("appPara");
appWelcome.appendChild(appHeading);
appWelcome.appendChild(appPara);
let headingData = "Todo App";
let paraData =
  "welcome! this is todo app created by muhammad tayyab raza awan.where you can add your daily tasks,edit them,view them & also you can delete them,to add a task click on add button given in left button,to edit any existing task click on edit button,to view all the existing task click on view button,to delete any task click on delete button.to support me please subscribe to my youtube channel,follow me on facebook & instagram.";
appHeading.innerText = "";
appPara.innerText = "";
setTimeout(() => {
  todoImg.remove();
  app.appendChild(appWelcome);
}, 1000);
async function textAnim(node, data, delay) {
  for (let letter = 0; letter < data.length; letter++) {
    await typeWriter(node, data[letter], delay);
  }
}
function typeWriter(node, letter, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (letter === " ") {
        node.innerHTML += " &nbsp;";
      } else {
        node.innerText += letter;
      }
      resolve();
    }, delay);
  });
}
setTimeout(() => {
  textAnim(appHeading, headingData, 250);
}, 1000);
setTimeout(() => {
  textAnim(appPara, paraData, 25);
}, 4000);
for (let button of buttons) {
  let buttonId = button.getAttribute("id");
  button.addEventListener("click", () => {
    if (buttonId === "addTask") {
      if (app.children[0].getAttribute("id") !== buttonId) {
        app.children[0].remove();
        addTask(app);
      }
    } else if (buttonId === "editTask") {
      if (app.children[0].getAttribute("id") !== buttonId) {
        app.children[0].remove();
        editTask(app);
      }
    } else if (buttonId === "viewTask") {
      if (app.children[0].getAttribute("id") !== buttonId) {
        app.children[0].remove();
        viewTask(app);
      }
    } else if (buttonId === "deleteTask") {
      if (app.children[0].getAttribute("id") !== buttonId) {
        app.children[0].remove();
        deleteTask(app);
      }
    }
  });
}
async function addTask(node) {
  let task = document.createElement("div");
  task.classList.add("appAddTask");
  let addTP = document.createElement("p");
  addTP.classList.add("addTP");
  let addTInBDiv = document.createElement("div");
  addTInBDiv.classList.add("addTInBDiv");
  let addTIn = document.createElement("input");
  addTIn.classList.add("addTIn");
  addTIn.setAttribute("type", "text");
  addTIn.required = true;
  addTIn.autofocus = true;
  addTIn.name = "Task";
  addTIn.placeholder = "Enter Task Here";
  addTIn.maxLength = 30;
  let addTB = document.createElement("button");
  addTB.classList.add("addTB");
  addTB.innerText = "Add Now";
  let addTPCon =
    "hey! to add task enter task below and now hit add button (daily task limit : 14)";
  addTInBDiv.appendChild(addTIn);
  let isICorrect;
  let isCCorrect;
  addTIn.addEventListener("input", () => {
    let inputStr = addTIn.value.trim();
    isICorrect = inputCheck(inputStr);
    if (isICorrect) {
      addTIn.classList.remove("inpWrong");
    } else {
      addTIn.classList.add("inpWrong");
    }
  });
  addTIn.addEventListener("change", () => {
    let inputStr = addTIn.value.trim();
    isCCorrect = inputCheck(inputStr);
    if (isCCorrect) {
      addTIn.classList.remove("inpWrong");
    } else {
      addTIn.classList.add("inpWrong");
    }
  });
  addTInBDiv.appendChild(addTB);
  task.appendChild(addTP);
  task.appendChild(addTInBDiv);
  node.appendChild(task);
  await textAnim(addTP, addTPCon, 25);
  addTB.addEventListener("click", () => {
    if (
      isICorrect &&
      isCCorrect &&
      addTIn.value.trim() != 0 &&
      tasks.length < 14
    ) {
      let taskValue = addTIn.value.trim();
      if (!tasks.includes(taskValue)) {
        addTB.innerText = "Task Added";
        tasks.push(taskValue);
        setTimeout(() => {
          addTB.innerText = "Add Task";
        }, 450);
      } else {
        addTB.innerText = "Already Exist";
        setTimeout(() => {
          addTB.innerText = "Add Task";
        }, 450);
      }
    } else if (
      !tasks.length < 14 &&
      isICorrect &&
      isCCorrect &&
      addTIn.value.trim() != 0
    ) {
      addTB.innerText = "List Full No Space Left";
    } else {
      addTB.innerText = "Wrong Input";
      setTimeout(() => {
        addTB.innerText = "Add Task";
      }, 450);
    }
  });
}
function inputCheck(valueStr) {
  let allValue = 0;
  for (let i = 0; i < valueStr.length; i++) {
    let value = valueStr.charCodeAt(i);
    if (
      value == 32 ||
      (value >= 97 && value <= 122) ||
      (value >= 65 && value <= 90)
    ) {
      allValue++;
    }
  }
  if (allValue == valueStr.length) {
    return true;
  } else {
    return false;
  }
}
function editTask(node) {
  let task = document.createElement("div");
  task.classList.add("appEditTask");
  node.appendChild(task);
}
async function viewTask(node) {
  let task = document.createElement("div");
  task.classList.add("appViewTask");
  let viewT = document.createElement("div");
  viewT.classList.add("viewT");
  let viewTH = document.createElement("h1");
  viewTH.classList.add("viewTH");
  let viewTHCon = "Your Task List";
  let viewTList = document.createElement("ul");
  viewTList.classList.add("viewTList");
  viewT.appendChild(viewTH);
  viewT.appendChild(viewTList);
  let viewTPB = document.createElement("div");
  viewTPB.classList.add("viewTPB");
  viewTPB.classList.add("disable");
  viewTPB.innerText = "<<";
  let viewTNB = document.createElement("div");
  viewTNB.classList.add("viewTNB");
  viewTNB.classList.add("disable");
  viewTNB.innerText = ">>";
  task.appendChild(viewTPB);
  task.appendChild(viewT);
  task.appendChild(viewTNB);
  node.appendChild(task);
  if (tasks.length == 0) {
    creatLi(viewTList, "Empty Task List");
  } else {
    if (tasks.length <= 8) {
      for (let task of tasks) {
        creatLi(viewTList, task);
      }
    } else {
      for (let i = 0; i < 8; i++) {
        creatLi(viewTList, tasks[i]);
      }
      viewTNB.classList.remove("disable");
      viewTNB.addEventListener("click", () => {
        removeLiV();
        for (let i = 8; i < tasks.length; i++) {
          creatLi(viewTList, tasks[i]);
        }
        viewTPB.classList.remove("disable");
        viewTNB.classList.add("disable");
      });
      viewTPB.addEventListener("click", () => {
        removeLiV();
        for (let i = 0; i < 8; i++) {
          creatLi(viewTList, tasks[i]);
        }
        viewTNB.classList.remove("disable");
        viewTPB.classList.add("disable");
      });
    }
  }
  await textAnim(viewTH, viewTHCon, 50);
}
function creatLi(parent, value) {
  let li = document.createElement("li");
  li.innerText = value;
  parent.appendChild(li);
}
function removeLiV() {
  let allLi = document.querySelectorAll(".viewTList li");
  for (let li of allLi) {
    li.remove();
  }
}
async function deleteTask(node) {
  let task = document.createElement("div");
  task.classList.add("appDeleteTask");
  let deleteT = document.createElement("div");
  deleteT.classList.add("deleteT");
  let deleteTH = document.createElement("h1");
  deleteTH.classList.add("deleteTH");
  let deleteTHCon = "Your Task List To Delete";
  let deleteTList = document.createElement("ul");
  deleteTList.classList.add("deleteTList");
  deleteT.appendChild(deleteTH);
  deleteT.appendChild(deleteTList);
  let deleteTPB = document.createElement("div");
  deleteTPB.classList.add("deleteTPB");
  deleteTPB.classList.add("disable");
  deleteTPB.innerText = "<<";
  let deleteTNB = document.createElement("div");
  deleteTNB.classList.add("deleteTNB");
  deleteTNB.classList.add("disable");
  deleteTNB.innerText = ">>";
  task.appendChild(deleteTPB);
  task.appendChild(deleteT);
  task.appendChild(deleteTNB);
  node.appendChild(task);
  if (tasks.length == 0) {
    creatLi(deleteTList, "Empty Task List");
  } else {
    if (tasks.length <= 8) {
      for (let task of tasks) {
        creatLiDelBtn(deleteTList, task);
      }
    } else {
      for (let i = 0; i < 8; i++) {
        creatLiDelBtn(deleteTList, tasks[i]);
      }
      if (tasks.length > 8) {
        deleteTNB.classList.remove("disable");
      }
      deleteTNB.addEventListener("click", () => {
        removeLiD();
        for (let i = 8; i < tasks.length; i++) {
          creatLiDelBtn(deleteTList, tasks[i]);
        }
        deleteTPB.classList.remove("disable");
        deleteTNB.classList.add("disable");
      });
      deleteTPB.addEventListener("click", () => {
        removeLiD();
        for (let i = 0; i < 8; i++) {
          creatLiDelBtn(deleteTList, tasks[i]);
        }
        if (tasks.length > 8) {
          deleteTNB.classList.remove("disable");
        }
        deleteTPB.classList.add("disable");
      });
    }
  }
  await textAnim(deleteTH, deleteTHCon, 50);
  node.appendChild(task);
}
function removeLiD() {
  let allLi = document.querySelectorAll(".deleteTList li");
  for (let li of allLi) {
    li.remove();
  }
}
function creatLiDelBtn(parent, value) {
  if (value !== undefined) {
    let li = document.createElement("li");
    let liPara = document.createElement("p");
    let deleteNB = document.querySelector(".deleteTNB");
    let deletePB = document.querySelector(".deleteTPB");
    liPara.classList.add("liPara");
    liPara.innerText = value;
    let delBtn = document.createElement("button");
    delBtn.classList.add("delBtn");
    delBtn.innerText = "Delete";
    li.appendChild(liPara);
    li.appendChild(delBtn);
    parent.appendChild(li);
    delBtn.addEventListener("click", () => {
      delBtn.parentElement.remove();
      let delTaskIdx = tasks.indexOf(delBtn.previousElementSibling.innerText);
      tasks.splice(delTaskIdx, 1);
      if (tasks.length > 8) {
        deleteNB.classList.remove("disabled");
      }
    });
  }
}
