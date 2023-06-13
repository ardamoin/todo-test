import {
  addProjectBtnEventListener,
  makeAddProjectDiv,
  makeNewProject,
} from "./events.js";
import { todos, mainPages, updator, pageToggler } from "./nav.js";

export function savePagesAndTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("pages", JSON.stringify(mainPages));
}

export function checkStorage() {
  updator.updateTodos(JSON.parse(localStorage.getItem("todos")));
  updator.updatePages(JSON.parse(localStorage.getItem("pages")));

  mainPages["Inbox"].appendItems();
  const sidebar = document.querySelector(".sidebar");

  for (let key in mainPages) {
    if (key !== "Inbox" && key !== "Today" && key !== "This Week") {
      sidebar.removeChild(document.querySelector(".add-project"));
      sidebar.appendChild(makeNewProject(key));
      sidebar.appendChild(makeAddProjectDiv());
      addProjectBtnEventListener();
      pageToggler();
    }
  }
}
