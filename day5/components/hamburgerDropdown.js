const linkList = [
	{
		value: "Course Name",
		list: [
			"course catalog",
			"course catalog",
			"course catalog",
			"course catalog",
		],
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

export const navbarDropdownMenu = document.getElementsByClassName(
	"navbar-dropdown-menu"
)[0];

navbarDropdownMenu.innerHTML = navbarHamburgerDropdown;
