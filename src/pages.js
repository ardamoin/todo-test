import { parseISO, isToday, isThisWeek } from "date-fns";
import { itemComponentGenerator } from "./items.js";

export function Page(todoItems, pageName) {
  this.todoItems = todoItems;
  const mainContent = document.querySelector(".main-content");

  const filter = (pageName) => {
    return this.todoItems.filter((item) => {
      const isoDateString = item.date.split("-").join("");
      const dateObject = parseISO(isoDateString);

      switch (pageName) {
        case "Inbox":
          return true;
        case "Today":
          return isToday(dateObject);
        case "This Week":
          return isThisWeek(dateObject);
        default:
          return item.project === pageName;
      }
    });
  };

  this.appendItems = function () {
    filter(pageName).forEach((element) => {
      mainContent.appendChild(itemComponentGenerator(element));
    });
  };

  this.clearItems = function () {
    mainContent.innerHTML = "";
  };
}
