import { navbarDropdownMenu } from "./components/hamburgerDropdownT.js";
import { courseCardsTemp } from "./components/courseCardItemT.js";
import { notificationWrapper } from "./components/notificationsT.js";
import { announcementsWrapper } from "./components/announcementsT.js";

const courseCardsTempRead: HTMLDivElement = courseCardsTemp;
const notificationWrapperRead: HTMLDivElement = notificationWrapper;
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

const openDropdownMenu = (
	index: number,
	currDropdownMenu: HTMLUListElement
) => {
	currDropdownMenu.style.display =
		currDropdownMenu.style.display === "block" ? "none" : "block";

	isRotated = !isRotated;
	arrow[index].style.transform = isRotated
		? "rotate(180deg)"
		: "rotate(0deg)";
};

dropdownHeader.forEach((item, index) => {
	// console.log("index: ", index);
	// console.log("item: ", item);
	const dropdownMenu: HTMLUListElement = item.parentElement
		?.children[1] as HTMLUListElement;

	item.addEventListener("click", (e) => {
		e.preventDefault();
		openDropdownMenu(index, dropdownMenu);
	});
	item.addEventListener("keydown", (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			// e.preventDefault(); // optional: prevent default form submission
			openDropdownMenu(index, dropdownMenu);
		}
		if (e.key === "ArrowDown") {
			openDropdownMenu(index, dropdownMenu);
			const dropdownList: HTMLLIElement = item?.parentElement?.children[1]
				.children[0] as HTMLLIElement;

			// console.log("first eleemtn", dropdownList);
			dropdownList.focus();
		}
	});
});

document.querySelectorAll(".dropdown-menu li").forEach((item, index) => {
	// console.log("index:", index);
	const targetDiv: HTMLInputElement = item?.parentElement?.parentElement
		?.children[0].children[0] as HTMLInputElement;

	const parentDropdown: HTMLUListElement =
		item.parentElement as HTMLUListElement;
	console.log("targetDiv", targetDiv);
	item.addEventListener("click", () => {
		const tempContent = targetDiv.value;
		targetDiv.value = item.textContent ?? "";
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
