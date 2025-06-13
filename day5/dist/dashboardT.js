var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { navbarDropdownMenu } from "./components/hamburgerDropdownT.js";
import { courseCardsTemp } from "./components/courseCardItemT.js";
import { notificationWrapper } from "./components/notificationsT.js";
import { announcementsWrapper } from "./components/announcementsT.js";
const courseCardsTempRead = courseCardsTemp;
const notificationWrapperRead = notificationWrapper;
const announcementsWrapperRead = announcementsWrapper;
const dropdownHeader = document.querySelectorAll(".dropdown-header");
const dropdownMenu = document.querySelectorAll(".dropdown-menu");
const inputField = document.querySelectorAll(".dropdown-header input");
const arrow = document.querySelectorAll(".dropdown-arrow");
let isRotated = false;
const openDropdownMenu = (index) => {
    dropdownMenu[index].style.display =
        dropdownMenu[index].style.display === "block" ? "none" : "block";
    isRotated = !isRotated;
    arrow[index].style.transform = isRotated ? "rotate(180deg)" : "rotate(0deg)";
};
dropdownHeader.forEach((item, index) => {
    // console.log("index: ", index);
    // console.log("item: ", item);
    item.addEventListener("click", (e) => {
        e.preventDefault();
        openDropdownMenu(index);
    });
    item.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            // e.preventDefault(); // optional: prevent default form submission
            openDropdownMenu(index);
        }
    });
});
document.querySelectorAll(".dropdown-menu li").forEach((item, index) => {
    var _a, _b;
    // console.log("index:", index);
    const targetDiv = (_b = (_a = item === null || item === void 0 ? void 0 : item.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.children[0].children[0];
    const parentDropdown = item.parentElement;
    console.log("targetDiv", targetDiv);
    item.addEventListener("click", () => {
        var _a;
        const tempContent = targetDiv.value;
        targetDiv.value = (_a = item.textContent) !== null && _a !== void 0 ? _a : "";
        item.textContent = tempContent;
        parentDropdown.style.display = "none";
    });
});
document.addEventListener("click", (event) => {
    event.preventDefault();
    for (let i = 0; i < dropdownMenu.length; i++) {
        // console.log(dropdownHeader[i]);
        if (!dropdownHeader[i].contains(event.target) &&
            !dropdownMenu[i].contains(event.target)) {
            dropdownMenu[i].style.display = "none";
            arrow[i].style.transform = "rotate(0deg)";
        }
    }
});
// Show menu hamburger menu
const navbarMenuImage = document.getElementsByClassName("navbar-menu-image")[0];
let showHambugerMenu = false;
navbarMenuImage.addEventListener("click", (e) => {
    e.preventDefault();
    if (showHambugerMenu) {
        navbarDropdownMenu.style.display = "none";
    }
    else {
        navbarDropdownMenu.style.display = "flex";
    }
    showHambugerMenu = !showHambugerMenu;
});
const hamburgerItem = document.getElementsByClassName("hamburger-item");
for (let i = 0; i < hamburgerItem.length; i++) {
    hamburgerItem[i].addEventListener("click", (e) => {
        e.preventDefault();
        showHambugerMenu = !showHambugerMenu;
        navbarDropdownMenu.style.display = "none";
    });
}
// show all notification
const showAllButton = document.querySelectorAll(".show-all-button");
const notifications = document.querySelectorAll(".notifications");
showAllButton.forEach((button, index) => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        if (button.innerHTML === "Show All") {
            notifications[index].style.height = "fit-content";
            notifications[index].style.overflowY = "hidden";
            button.innerHTML = "Show Less";
        }
        else {
            notifications[index].style.height = "400px";
            notifications[index].style.overflowY = "scroll";
            button.innerHTML = "Show All";
        }
    });
});
let [person, fruit, , day] = ["Monty", "apple", "reading", "tomorrow"];
var sentence = `${person} will eat an ${fruit} ${day}.`;
console.log(sentence);
const f1 = () => __awaiter(void 0, void 0, void 0, function* () {
    setTimeout(() => {
        console.log(`3 seconds have passed`);
    }, 3000);
});
const fetchUrl = () => {
    setTimeout(() => {
        console.log(`3 seconds have passed`);
    }, 3000);
};
const f2 = () => __awaiter(void 0, void 0, void 0, function* () {
    const temp = yield fetchUrl();
    const temp2 = yield fetchUrl();
});
f1();
f2();
// const urls = [
// 	"https://en.wikipedia.org/wiki/Canada",
// 	"https://en.wikipedia.org/wiki/Nigeria",
// 	"https://en.wikipedia.org/wiki/Vietnam",
// ];
// const f3 = async () => {
// 	const countryInfo = await Promise.all(
// 		urls.map(async (url) => {
// 			const resp = await fetch(url);
// 			return resp.text();
// 		})
// 	);
// };
// f3();
