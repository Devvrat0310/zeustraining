import { details } from "./courseDetails.js";

const markup = `
  ${details
		.map(
			(data) => `
    <div class="course-card-item">
      <div class="course-card">
        <img src="${data.img}" alt="" />
        <div class="course-card-information">
          <div class="course-card-container">
            <div class="course-card-title-wrapper">
              <p class="course-card-title">${data.title}</p>
              <img src="assets/icons/favourite.svg" alt="" class = ${
								data.favourite ? `` : `disabled-star`
							} />
            </div>
            <div class="course-card-subject-standard">
              <p>${data.subject}</p>
              <div class="link-separator"></div>
              <p>Grade ${data.grade} <span class="add">+${data.add}</span></p>
            </div>
            <div class="subject-metadata">
			${
				data.subjectMeta.units > 0
					? `<p>${data.subjectMeta.units} <span class="show-courses">Units</span></p>
				<p>${data.subjectMeta.lessons} <span class="show-courses">Lessons</span></p>
				<p>${data.subjectMeta.topics} <span class="show-courses">Topics</span></p>`
					: `<p><span class="show-courses"></span></p>
				<p><span class="show-courses"></span></p>
				<p><span class="show-courses"></span></p>`
			}
            </div>
          </div>
          <div class="course-card-container">
            <div class="sort-by-dropdown">
              <div class="dropdown-header">
                <input
                  type="text"
                  value="${data.class}"
                  id="sort-by"
                  readonly
				  ${data.noClass ? `disabled` : null}
                  class="dropdown-input"
                />
                <img
                  src="assets/icons/arrow-down.svg"
                  alt="Dropdown Arrow"
                  class="dropdown-arrow"
                />
              </div>
              <ul class="dropdown-menu">
                <li>${data.class}</li>
              </ul>
            </div>
            <div class="class-metadata">
              <p>${
								data.classMeta.students > 0
									? `${data.classMeta.students} Students`
									: ``
							}</p>
							
              <div class=${
								data.classMeta.fromDate != "" ? `"link-separator"` : ``
							}></div>
              <div class="course-dates">
                <p>${data.classMeta.fromDate}</p>
                <p>${data.classMeta.fromDate != "" ? `-` : ``} </p>
                <p>${data.classMeta.toDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="course-card-hr"></div>
      <div class="course-card-options">
        <img src="assets/icons/preview.svg" alt="" class = ${
					data.options.preview ? `` : `disabled-option`
				} />
        <img src="assets/icons/manage course.svg" alt="" class = ${
					data.options.manageCourse ? `` : `disabled-option`
				} />
        <img src="assets/icons/grade submissions.svg" alt="" class = ${
					data.options.gradeSubmission ? `` : `disabled-option`
				} />
        <img src="assets/icons/reports.svg" alt="" class = ${
					data.options.reports ? `` : `disabled-option`
				} />
      </div>
    </div>`
		)
		.join("")}
`;

const courseCardsTemp = document.getElementsByClassName("course-cards")[0];

courseCardsTemp.innerHTML = markup;
// document.body.innerHTML = test;

const dropdownHeader: NodeListOf<HTMLDivElement> =
	document.querySelectorAll(".dropdown-header");
const dropdownMenu: NodeListOf<HTMLUListElement> =
	document.querySelectorAll(".dropdown-menu");
// const dropdownMenu = document.querySelector(".dropdown-menu");
const arrow: NodeListOf<HTMLImageElement> =
	document.querySelectorAll(".dropdown-arrow");

// const sortByDropdown = document.getElementsByClassName("sort-by-dropdown");

// const temp = document.querySelectorAll(".dropdown-menu li");

let isRotated = false;

// console.log("dropdownHeader: ", dropdownHeader);
// console.log("temp: ", temp);

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

const inputField: NodeListOf<HTMLInputElement> = document.querySelectorAll(
	".dropdown-header input"
);

document.querySelectorAll(".dropdown-menu li").forEach((item, index) => {
	// console.log("index:", index);
	item.addEventListener("click", () => {
		inputField[index].value = item.textContent ? item.textContent : "";
		dropdownMenu[index].style.display = "none";
	});
});

document.addEventListener("click", (event: Event) => {
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

const navbarDropdownMenu: NodeListOf<HTMLDivElement> =
	document.querySelectorAll(".navbar-dropdown-menu");

const navbarDropdownMenuEach: HTMLDivElement = navbarDropdownMenu[0];

navbarMenuImage.addEventListener("click", (e) => {
	e.preventDefault();

	if (showHambugerMenu) {
		navbarDropdownMenuEach.style.display = "none";
	} else navbarDropdownMenuEach.style.display = "flex";
	showHambugerMenu = !showHambugerMenu;
});

const hamburgerItem = document.getElementsByClassName("hamburger-item");

for (let i = 0; i < hamburgerItem.length; i++) {
	hamburgerItem[i].addEventListener("click", (e) => {
		e.preventDefault();
		showHambugerMenu = !showHambugerMenu;

		navbarDropdownMenuEach.style.display = "none";
	});
}
