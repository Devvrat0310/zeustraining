import { navbarDropdownMenu } from "./components/hamburgerDropdown.js";
import { courseCardsTemp } from "./components/courseCardItem.js";
import { notificationWrapper } from "./components/notifications.js";
import { announcementsWrapper } from "./components/announcements.js";

const dropdownHeader = document.querySelectorAll(".dropdown-header");
const dropdownMenu = document.getElementsByClassName("dropdown-menu");
const inputField = document.querySelectorAll(".dropdown-header input");
const arrow = document.getElementsByClassName("dropdown-arrow");

let isRotated = false;

dropdownHeader.forEach((item, index) => {
	// console.log("index: ", index);
	// console.log("item: ", item);
	item.addEventListener("click", (e) => {
		e.preventDefault();
		dropdownMenu[index].style.display =
			dropdownMenu[index].style.display === "block" ? "none" : "block";

		isRotated = !isRotated;
		arrow[index].style.transform = isRotated
			? "rotate(180deg)"
			: "rotate(0deg)";
	});
});

document.querySelectorAll(".dropdown-menu li").forEach((item, index) => {
	// console.log("index:", index);
	const targetDiv = item.parentElement.parentElement.children[0].children[0];
	const parentDropdown = item.parentElement;
	console.log("targetDiv", targetDiv);
	item.addEventListener("click", () => {
		const tempContent = targetDiv.value;
		targetDiv.value = item.textContent;
		item.textContent = tempContent;
		parentDropdown.style.display = "none";
	});
});

document.addEventListener("click", (event) => {
	event.preventDefault();
	for (let i = 0; i < dropdownMenu.length; i++) {
		// console.log(dropdownHeader[i]);
		if (
			!dropdownHeader[i].contains(event.target) &&
			!dropdownMenu[i].contains(event.target)
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

const showAllButton = document.querySelectorAll(".show-all-button");
const notifications = document.querySelectorAll(".notifications");

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

function normal() {
	console.log("this", this);
}

const arr = () => {
	console.log("this", this);
};

normal();
arr();
