import {
  todoFormGenerator,
  todoItem,
  itemComponentGenerator,
  detailsFormGenerator,
  addProjectPopUpGenerator,
} from "./items.js";
import { mainPages, pageToggler, todos } from "./nav.js";
import { remove } from "lodash";
import { Page } from "./pages.js";
import { savePagesAndTodos } from "./storage.js";

export function addTodoBtnEventListener() {
  const addTodo = document.querySelector(".add-task");

  addTodo.addEventListener("click", () => {
    overlayToggle.enable();
    document.body.appendChild(todoFormGenerator());
  });
}

export function editBtnEventListener() {
  const parentForm = this.closest("[data-info]");
  const dataInfoValue = parentForm.getAttribute("data-info");
  const dataInfoObject = JSON.parse(dataInfoValue);
  const targetItemComponent = document.querySelector(
    `.main-content [data-info='${dataInfoValue}']`
  );

  const bodyDiv = this.closest(".form-body");
  const closeBtn = bodyDiv.parentNode.querySelector(".form-close");
  const newTitle = bodyDiv.querySelector(".form-title");
  const newDescription = bodyDiv.querySelector(".form-details");
  const newDate = bodyDiv.querySelector(".date-input");
  const newPriority = bodyDiv.querySelector("button.active");
  const newObject = todoItem(
    newTitle.value,
    newDescription.value,
    newDate.value,
    newPriority.textContent,
    dataInfoObject.project,
    dataInfoObject.done
  );

  updateItemComponent(targetItemComponent, newObject);

  for (let i = 0; i < todos.length; i++) {
    if (JSON.stringify(todos[i]) === dataInfoValue) {
      todos.splice(i, 1, newObject);
      savePagesAndTodos();
    }
  }

  closeBtn.click();
  overlayToggle.disable();
}

function updateItemComponent(targetItemComponent, todoItem) {
  const priorityStrip = targetItemComponent.querySelector(".priority-strip");
  const title = targetItemComponent.querySelector(".todo-title");
  const date = targetItemComponent.querySelector(".todo-date");

  priorityStrip.classList.remove(priorityStrip.classList[1]);
  priorityStrip.classList.add(`priority-${todoItem.priority}`);

  title.textContent = todoItem.title;
  date.textContent = todoItem.date;

  targetItemComponent.setAttribute("data-info", JSON.stringify(todoItem));
}

const overlayToggle = (function () {
  const overlay = document.querySelector(".overlay");

  const enable = () => {
    overlay.classList.add("enabled");
    makeBackgroundItemsStatic(true);
  };
  const disable = () => {
    overlay.classList.remove("enabled");
    makeBackgroundItemsStatic(false);
  };

  return { enable, disable };
})();

export function closeBtnEventListener() {
  const bodyNode = document.body;
  const formNode = this.closest("body>div");

  bodyNode.removeChild(formNode);
  overlayToggle.disable();
}

export function submitBtnEventListener() {
  const bodyDiv = this.parentNode.parentNode;
  const closeBtn = bodyDiv.parentNode.querySelector(".form-close");
  const title = bodyDiv.querySelector(".form-title");
  const description = bodyDiv.querySelector(".form-details");
  const date = bodyDiv.querySelector(".date-input");
  const priority = bodyDiv.querySelector("button.active").textContent;
  const context = document
    .querySelector(".main-content")
    .getAttribute("context");
  const activePage = document.querySelector(".active");

  const fields = [
    { key: "Title", element: title },
    { key: "Date", element: date },
  ];

  let emptyField;

  for (let field of fields) {
    if (field.element.value === "") {
      emptyField = field.key;
      emptyFieldAlert(emptyField);
      break;
    }
  }

  if (emptyField === undefined) {
    const newItem = todoItem(
      title.value,
      description.value,
      date.value,
      priority,
      context
    );
    closeBtn.click();
    todos.push(newItem);
    insertTodoItemComponent(newItem);
    activePage.click();
    savePagesAndTodos();
  }
}

export function deleteBtnEventListener() {
  const mainContent = document.querySelector(".main-content");
  const component = this.parentNode;

  mainContent.removeChild(component);
  _.remove(
    todos,
    (obj) => JSON.stringify(obj) === component.getAttribute("data-info")
  );
  savePagesAndTodos();
}

export function detailsBtnEventListener() {
  const parent = this.parentNode;
  const detailsPage = detailsFormGenerator(
    JSON.parse(parent.getAttribute("data-info"))
  );
  overlayToggle.enable();
  document.body.appendChild(detailsPage);
}

export function addEditBtnEventListener(editButton) {
  editButton.addEventListener("click", function () {
    const parent = this.parentNode;
    const editPage = todoFormGenerator(
      false,
      JSON.parse(parent.getAttribute("data-info"))
    );
    overlayToggle.enable();
    document.body.appendChild(editPage);
  });
}

export function addProjectBtnEventListener() {
  const addProjectBtn = document.querySelector(".add-project");
  const sidebar = document.querySelector(".sidebar");

  addProjectBtn.addEventListener("click", () => {
    sidebar.removeChild(addProjectBtn);
    sidebar.appendChild(addProjectPopUpGenerator());
    savePagesAndTodos();
  });
}

export function submitProjectEventListener() {
  const sidebar = document.querySelector(".sidebar");
  const textInput = document.querySelector(".pu-text");
  const projectName = textInput.value;

  if (projectName !== "") {
    sidebar.removeChild(textInput.closest(".pop-up"));
    sidebar.appendChild(makeNewProject(projectName));
    sidebar.appendChild(makeAddProjectDiv());
    addProjectBtnEventListener();
    mainPages[projectName] = new Page(todos, projectName);
    pageToggler();
    savePagesAndTodos();
  }
}

export function cancelProjectEventListener() {
  const sidebar = document.querySelector(".sidebar");
  const popUp = sidebar.querySelector(".pop-up");

  sidebar.removeChild(popUp);
  sidebar.appendChild(makeAddProjectDiv());
  addProjectBtnEventListener();
}

export function insertTodoItemComponent(todoItem) {
  document
    .querySelector(".main-content")
    .appendChild(itemComponentGenerator(todoItem));
}

function makeBackgroundItemsStatic(makeStatic) {
  const elements = [".header", ".content", ".add-task"];
  const pointerEvents = makeStatic ? "none" : "";

  elements.forEach((element) => {
    const el = document.querySelector(element);
    el.style.pointerEvents = pointerEvents;
  });
}

function emptyFieldAlert(fieldName) {
  window.alert(`${fieldName} is required`);
}

export function makeNewProject(projectName) {
  const newProject = document.createElement("div");
  const projectNameSpan = document.createElement("span");
  const deleteProjectImg = document.createElement("i");
  deleteProjectImg.classList.add("bi", "bi-x-lg");
  newProject.classList.add("sidebar-item", "page", "new-project");
  projectNameSpan.textContent = projectName;
  newProject.append(projectNameSpan, deleteProjectImg);

  deleteProjectImg.addEventListener("click", deleteProjectEventListener);

  return newProject;
}

export function makeAddProjectDiv() {
  const addProjectDiv = document.createElement("div");
  const plusImg = document.createElement("i");
  const text = document.createTextNode("Add Project");
  addProjectDiv.classList.add("add-project");
  plusImg.classList.add("bi", "bi-plus-lg");

  addProjectDiv.append(plusImg, text);

  return addProjectDiv;
}

function deleteProjectEventListener(event) {
  const projectToRemove = this.closest(".new-project");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");
  const inboxDiv = sidebar.querySelector(".page-inbox");
  const activeDiv = sidebar.querySelector(".active");
  event.stopPropagation();

  _.remove(todos, (obj) => obj.project === projectToRemove.textContent);
  delete mainPages[projectToRemove.textContent];
  sidebar.removeChild(projectToRemove);
  mainContent.setAttribute("context", "inbox");

  if (activeDiv) {
    activeDiv.click();
  } else {
    inboxDiv.click();
  }
  savePagesAndTodos();
}
