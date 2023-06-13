import "./style.css";
import icon from "./todo-icon.png";
import { sidebarToggler, pageToggler, inboxPage } from "./nav.js";
import { addProjectBtnEventListener, addTodoBtnEventListener } from "./events.js";
import { checkStorage } from "./storage.js";

const todoIcon = document.createElement("link");
todoIcon.rel = "icon";
todoIcon.href = icon;
document.head.appendChild(todoIcon);

const toggler = document.querySelector(".navbar-toggler");
toggler.addEventListener("click", sidebarToggler);

pageToggler();
addTodoBtnEventListener();
addProjectBtnEventListener();

inboxPage.appendItems();

checkStorage();
