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
const openDropdownMenu = (index, currDropdownMenu) => {
    currDropdownMenu.style.display =
        currDropdownMenu.style.display === "block" ? "none" : "block";
    isRotated = !isRotated;
    arrow[index].style.transform = isRotated
        ? "rotate(180deg)"
        : "rotate(0deg)";
};
dropdownHeader.forEach((item, index) => {
    var _a;
    // console.log("index: ", index);
    // console.log("item: ", item);
    const dropdownMenu = (_a = item.parentElement) === null || _a === void 0 ? void 0 : _a.children[1];
    item.addEventListener("click", (e) => {
        e.preventDefault();
        openDropdownMenu(index, dropdownMenu);
    });
    item.addEventListener("keydown", (e) => {
        var _a;
        if (e.key === "Enter") {
            // e.preventDefault(); // optional: prevent default form submission
            openDropdownMenu(index, dropdownMenu);
        }
        if (e.key === "ArrowDown") {
            openDropdownMenu(index, dropdownMenu);
            const dropdownList = (_a = item === null || item === void 0 ? void 0 : item.parentElement) === null || _a === void 0 ? void 0 : _a.children[1].children[0];
            // console.log("first eleemtn", dropdownList);
            dropdownList.focus();
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
    let focusedIndex = 0;
    // const menuItems: HTMLLIElement[] = item?.parentElement
    // 	?.children as HTMLLIElement[];
    // item.addEventListener("keydown", (e: KeyboardEvent) => {
    // 	if (e.key === "ArrowDown") {
    // 		e.preventDefault();
    // 		focusedIndex = (focusedIndex + 1) % menuItems.length;
    // 		menuItems[focusedIndex].focus();
    // 	} else if (e.key === "ArrowUp") {
    // 		e.preventDefault();
    // 		focusedIndex =
    // 			(focusedIndex - 1 + menuItems.length) % menuItems.length;
    // 		menuItems[focusedIndex].focus();
    // 	} else if (e.key === "Escape") {
    // 		e.preventDefault();
    // 		openDropdownMenu();
    // 	} else if (e.key === "Tab") {
    // 		openDropdownMenu();
    // 	} else if (e.key === "Enter") {
    // 		e.preventDefault();
    // 		alert(`You selected: ${menuItems[focusedIndex].textContent}`);
    // 		closeMenu();
    // 		break;
    // 	}
    // });
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
