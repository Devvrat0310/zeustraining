import { navbarDropdownMenu } from "./components/hamburgerDropdownT.js";
import { courseCardsTemp } from "./components/courseCardItemT.js";
import { notificationsWrapper } from "./components/notificationsT.js";
import { announcementsWrapper } from "./components/announcementsT.js";

const courseCardsTempRead: HTMLDivElement = courseCardsTemp;
const notificationWrapperRead: HTMLDivElement = notificationsWrapper;
const announcementsWrapperRead: HTMLDivElement = announcementsWrapper;

const dropdownHeader: NodeListOf<HTMLDivElement> =
	document.querySelectorAll(".dropdown-header");
const dropdownMenu: NodeListOf<HTMLDivElement> =
	document.querySelectorAll(".dropdown-menu");
const inputField: NodeListOf<HTMLInputElement> = document.querySelectorAll(
	".dropdown-header input"
);
const arrow: NodeListOf<HTMLImageElement> =
	document.querySelectorAll(".dropdown-arrow");

let isRotated = false;
let focusedIndex = 0;

const openDropdownMenu = (currDropdownMenu: HTMLUListElement) => {
	currDropdownMenu.style.display =
		currDropdownMenu.style.display === "block" ? "none" : "block";

	const currArrow: HTMLImageElement = currDropdownMenu.parentElement
		?.children[0].children[1] as HTMLImageElement;

	if (currArrow.style.transform === "rotate(180deg)") {
		currArrow.style.transform = "rotate(0deg)";
	} else {
		currArrow.style.transform = "rotate(180deg)";
	}
	// currArrow.style.transform = isRotated ? "rotate(180deg)" : "rotate(0deg)";
};

dropdownHeader.forEach((item, index) => {
	// console.log("index: ", index);
	// console.log("item: ", item);
	const dropdownMenu: HTMLUListElement = item.parentElement
		?.children[1] as HTMLUListElement;

	item.addEventListener("click", (e) => {
		e.preventDefault();
		openDropdownMenu(dropdownMenu);
	});
	item.addEventListener("keydown", (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			// e.preventDefault(); // optional: prevent default form submission
			openDropdownMenu(dropdownMenu);
		}
		if (e.key === "ArrowDown") {
			openDropdownMenu(dropdownMenu);
			const dropdownList: HTMLLIElement = item?.parentElement?.children[1]
				.children[0] as HTMLLIElement;

			focusedIndex = 1;
			console.log("dropdownList:", dropdownList);
			dropdownList.focus();
		}
	});
});

document.querySelectorAll(".dropdown-menu li").forEach((item, index) => {
	const targetDiv: HTMLInputElement = item?.parentElement?.parentElement
		?.children[0].children[0] as HTMLInputElement;

	const parentDropdown: HTMLUListElement =
		item.parentElement as HTMLUListElement;
	console.log("targetDiv", targetDiv);
	item.addEventListener("click", () => {
		const tempContent = targetDiv.value;
		targetDiv.value = item.textContent ?? "";
		item.textContent = tempContent;
		openDropdownMenu(parentDropdown);
	});

	const menuItems: HTMLUListElement = item?.parentElement as HTMLUListElement;

	item.addEventListener("keydown", (e: Event) => {
		console.log("event Listendd:", item);
		e.preventDefault();
		const keyboardEvent = e as KeyboardEvent;
		keyboardEvent.preventDefault();

		const menuItemsLen: number = menuItems.children.length;
		focusedIndex = focusedIndex % menuItemsLen;

		const currLiElement: HTMLLIElement = menuItems.children[
			focusedIndex
		] as HTMLLIElement;

		if (keyboardEvent.key === "ArrowDown") {
			focusedIndex = (focusedIndex + 1) % menuItemsLen;
			currLiElement.focus();
			console.log(currLiElement, "currLiElement");
		} else if (keyboardEvent.key === "ArrowUp") {
			// keyboardEvent.preventDefault();
			focusedIndex = (focusedIndex - 1 + menuItemsLen) % menuItemsLen;
			currLiElement.focus();
		} else if (keyboardEvent.key === "Escape") {
			// keyboardEvent.preventDefault();
			openDropdownMenu(parentDropdown);
		} else if (keyboardEvent.key === "Tab") {
			openDropdownMenu(parentDropdown);
		} else if (keyboardEvent.key === "Enter") {
			const tempContent = targetDiv.value;
			targetDiv.value = item.textContent ?? "";
			item.textContent = tempContent;
			// e.preventDefault();
			// alert(`You selected: ${currLiElement.textContent}`);
			openDropdownMenu(parentDropdown);
		}
	});
});

document.addEventListener("click", (event: Event) => {
	event.preventDefault();
	for (let i = 0; i < dropdownMenu.length; i++) {
		// console.log(dropdownHeader[i]);
		if (
			!dropdownHeader[i].contains(event.target as Node) &&
			!dropdownMenu[i].contains(event.target as Node)
		) {
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
	} else {
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

const showAllButton: NodeListOf<HTMLButtonElement> =
	document.querySelectorAll(".show-all-button");
const notifications: NodeListOf<HTMLDivElement> =
	document.querySelectorAll(".notifications");

showAllButton.forEach((button, index) => {
	button.addEventListener("click", (e) => {
		e.preventDefault();

		if (button.innerHTML === "Show All") {
			notifications[index].style.height = "fit-content";
			notifications[index].style.overflowY = "hidden";
			button.innerHTML = "Show Less";
		} else {
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
