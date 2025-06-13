interface link {
	value: string;
	list: string[];
}

const linkList: link[] = [
	{
		value: "Course Name",
		list: ["course catalog"],
	},
	{
		value: "users",
		list: [],
	},
	{
		value: "report",
		list: [],
	},
	{
		value: "admin",
		list: [],
	},
	{
		value: "Course Name",
		list: [],
	},
];

export const navbarHamburgerDropdown = `
    <div class="select-dashboard">DASHBOARD</div>
	${linkList
		.map(
			(data) => `
						<div class="select-wrapper">
							<div class="select-container">
								<p>${data.value}</p>
								<img
									src="assets/icons/arrow-down-line.svg"
									alt="Dropdown Arrow"
									class="dropdown-arrow-select"
									height="15px"
								/>
							</div>
							<ul class="select-dropdown-list">
								${data.list
									.map(
										(listItem) => `
										<li>${listItem}</li>
									`
									)
									.join("")}	
							</ul>
						</div>
	`
		)
		.join("")}
`;

const navbarDropdownMenuAll: NodeListOf<HTMLDivElement> =
	document.querySelectorAll(".navbar-dropdown-menu");

export const navbarDropdownMenu: HTMLDivElement = navbarDropdownMenuAll[0];
navbarDropdownMenu.innerHTML = navbarHamburgerDropdown;

const selectContainer = document.querySelectorAll(".select-container");
const selectDropdownList: NodeListOf<HTMLDivElement> =
	document.querySelectorAll(".select-dropdown-list");

const arrowSelect: NodeListOf<HTMLImageElement> = document.querySelectorAll(
	".dropdown-arrow-select"
);

function defaultDropdown(index: number) {
	selectDropdownList[index].style.opacity = "0";
	selectDropdownList[index].style.maxHeight = "0";
	selectDropdownList[index].style.transform = "translateY(-10px)";
	arrowSelect[index].style.transform = "rotate(0deg)";
}

function selectContainerOnClick() {
	selectContainer.forEach((item, index) => {
		item.addEventListener("click", (e) => {
			e.preventDefault();
			console.log("arrowSelect", arrowSelect);
			if (selectDropdownList[index].style.opacity === "1") {
				defaultDropdown(index);
			} else {
				selectDropdownList[index].style.opacity = "1";
				selectDropdownList[index].style.maxHeight = "200px";
				selectDropdownList[index].style.transform = "translateY(0)";
				arrowSelect[index].style.transform = "rotate(180deg)";
			}
		});
	});
}

document.querySelectorAll(".select-dropdown-list li").forEach((item, index) => {
	item.addEventListener("click", (e) => {
		const targetDiv: HTMLParagraphElement = item?.parentElement?.parentElement
			?.children[0]?.children[0] as HTMLParagraphElement;

		const itemText: string = targetDiv.innerHTML;
		targetDiv.innerHTML = item.innerHTML;
		item.innerHTML = itemText;

		defaultDropdown(index);
	});
});

selectContainerOnClick();

navbarDropdownMenu.addEventListener("mouseleave", (e) => {
	e.preventDefault();
	selectContainer.forEach((item, index) => {
		defaultDropdown(index);
	});
});
