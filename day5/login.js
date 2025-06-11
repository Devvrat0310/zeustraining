// function togglePasswordVisibility(e) {}

let passwordVisibilityIcon = document.getElementsByClassName(
	"show-password-button"
)[0];

passwordVisibilityIcon.addEventListener("click", (e) => {
	e.preventDefault();
	let passwordInputField = document.getElementsByClassName(
		"user-detail-password"
	)[0];

	let visibilityType = passwordInputField.type;

	if (visibilityType === "text") passwordInputField.type = "password";
	else passwordInputField.type = "text";
});

let radioDistrictOne = document.getElementsByClassName(
	"school-type--input-label"
)[0];

let toggleRadioOne = false;
let toggleRadioTwo = false;

let radioButtonOne = document.getElementsByClassName("radio-button")[0];
let radioButtonTwo = document.getElementsByClassName("radio-button")[1];

// function toggleRadioButton(e, rO, rT, tO, tT) {
// 	e.preventDefault();

// 	rO.src = "assets/icons/radio-button-on.svg";
// 	tO = true;

// 	if (tT == true) {
// 		rT.src = "assets/icons/radio-button-off.svg";
// 		tT = false;
// 	}

// 	return;
// }

radioDistrictOne.addEventListener("click", (e) => {
	// toggleRadioButton(
	// 	e,
	// 	radioButtonOne,
	// 	radioButtonTwo,
	// 	toggleRadioOne,
	// 	toggleRadioTwo
	// );
	e.preventDefault();

	radioButtonOne.src = "assets/icons/radio-button-on.svg";
	toggleRadioOne = true;

	if (toggleRadioTwo == true) {
		radioButtonTwo.src = "assets/icons/radio-button-off.svg";
		toggleRadioTwo = false;
	}

	return;
});

let radioDistrictTwo = document.getElementsByClassName(
	"school-type--input-label"
)[1];

radioDistrictTwo.addEventListener("click", (e) => {
	// toggleRadioButton(
	// 	e,
	// 	radioButtonTwo,
	// 	radioButtonOne,
	// 	toggleRadioTwo,
	// 	toggleRadioOne
	// );
	e.preventDefault();

	radioButtonTwo.src = "assets/icons/radio-button-on.svg";
	toggleRadioTwo = true;

	if (toggleRadioOne == true) {
		radioButtonOne.src = "assets/icons/radio-button-off.svg";
		toggleRadioOne = false;
	}
});

let rememberMeContainer = document.getElementsByClassName(
	"remember-me-container"
)[0];

let toggleRememberMeContainer = false;

console.log(rememberMeContainer);

rememberMeContainer.addEventListener("click", (e) => {
	e.preventDefault();
	let checkbox = document.getElementsByClassName("remember-me-button")[0];
	console.log(checkbox);

	if (toggleRememberMeContainer === true) {
		checkbox.src = "assets/icons/checkbox-unchecked.svg";
		toggleRememberMeContainer = false;
	} else {
		checkbox.src = "assets/icons/checkbox-checked.svg";
		toggleRememberMeContainer = true;
	}
	console.log(checkbox.src);

	return;
});

const dropdownHeader = document.querySelectorAll(".dropdown-header");
const dropdownMenu = document.getElementsByClassName("dropdown-menu");
// const dropdownMenu = document.querySelector(".dropdown-menu");
const inputField = document.querySelectorAll(".dropdown-header input");
const arrow = document.getElementsByClassName("dropdown-arrow");
const sortByDropdown = document.getElementsByClassName("sort-by-dropdown");

const temp = document.querySelectorAll(".dropdown-menu li");

let isRotated = false;

console.log("dropdownHeader: ", dropdownHeader);
console.log("temp: ", temp);

dropdownHeader.forEach((item, index) => {
	// console.log("index: ", index);
	// console.log("item: ", item);
	item.addEventListener("click", () => {
		dropdownMenu[index].style.display =
			dropdownMenu[index].style.display === "block" ? "none" : "block";

		isRotated = !isRotated;
		arrow[index].style.transform = isRotated
			? "rotate(180deg)"
			: "rotate(0deg)";
	});
});

document.querySelectorAll(".dropdown-menu li").forEach((item, index) => {
	console.log("index:", index);
	item.addEventListener("click", () => {
		inputField[index].value = item.textContent;
		dropdownMenu[index].style.display = "none";
	});
});
