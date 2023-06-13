import "./style.css";
import { Page } from "./pages.js";

const sidebar = document.querySelector(".sidebar");

function hideSidebar() {
  sidebar.style.minWidth = "0";
  sidebar.style.width = "0";
  sidebar.classList.add("hidden");
}

function showSidebar() {
  sidebar.style.minWidth = "250px";
  sidebar.style.width = "250px";
  sidebar.classList.remove("hidden");
}

export function sidebarToggler() {
  if (sidebar.classList.contains("hidden")) {
    showSidebar();
  } else {
    hideSidebar();
  }
}

export let todos = [];

export const updator = {
  updateTodos: (newTodos) => {
    todos = newTodos;
  },
  updatePages: (newPages) => {
    for (let key in newPages) {
      newPages[key] = new Page(todos, key);
    }

    mainPages = newPages;
  },
};

export let inboxPage = new Page(todos, "Inbox");
let todayPage = new Page(todos, "Today");
let weekPage = new Page(todos, "This Week");

export let mainPages = {
  Inbox: inboxPage,
  Today: todayPage,
  "This Week": weekPage,
};

export function pageToggler() {
  const pages = Array.from(document.querySelectorAll(".page"));
  const mainContent = document.querySelector(".main-content");

  pages.forEach((page) => {
    page.addEventListener("click", () => {
      const otherPages = pages.filter((p) => p !== page);

      otherPages.forEach((p) => {
        p.classList.remove("active");
        if (mainPages[p.textContent]) {
          mainPages[p.textContent].clearItems();
        }
      });

      if (mainPages[page.textContent]) {
        mainPages[page.textContent].appendItems();
      }
      page.classList.add("active");

      if (
        page.textContent !== "Inbox" &&
        page.textContent !== "Today" &&
        page.textContent !== "This Week"
      ) {
        mainContent.setAttribute("context", page.textContent);
      } else {
        mainContent.setAttribute("context", "inbox");
      }
    });
  });
}
