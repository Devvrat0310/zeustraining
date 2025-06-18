const notifications = [
    {
        id: 1,
        type: "license_assignment",
        message: "License for Introduction to Algebra has been assigned to your school",
        description: {
            key: "",
            value: "",
        },
        timestamp: "15-Sep-2018 at 07:21 pm",
        status: "unread",
        icon: "info",
    },
    {
        id: 2,
        type: "assignment_overdue",
        message: "Lesson 5 Practice Worksheet overdue for Amy Santiago",
        description: {
            key: "course",
            value: "Advanced Mathematics",
        },
        timestamp: "15-Sep-2018 at 05:21 pm",
        status: "read",
        icon: "checkmark",
    },
    {
        id: 3,
        type: "students_created",
        message: "25 new students created",
        description: {
            key: "",
            value: "",
        },
        timestamp: "14-Sep-2018 at 01:21 pm",
        status: "unread",
        icon: "info",
    },
    {
        id: 4,
        type: "submissions_ready",
        message: "15 submissions ready for evaluation",
        description: {
            key: "class",
            value: "Basics of Algebra",
        },
        timestamp: "13-Sep-2018 at 01:15 pm",
        status: "unread",
        icon: "info",
    },
    {
        id: 5,
        type: "license_assignment",
        message: "License for Basic Concepts in Geometry has been assigned to your...",
        description: {
            key: "",
            value: "",
        },
        timestamp: "15-Sep-2018 at 07:21 pm",
        status: "unread",
        icon: "info",
    },
    {
        id: 6,
        type: "assignment_overdue",
        message: "Lesson 3 Practice Worksheet overdue for Sam Diego",
        description: {
            key: "course",
            value: "Advanced Mathematics",
        },
        timestamp: "",
        status: "read",
        icon: "checkmark",
    },
];
const markup = `
${notifications
    .map((item) => ` 
        <div class="notification-item ${item.status === "read" ? `read` : `unread`}" tabindex="0">
               <div class="notification-item-content">
                    <p> 
                        ${item.message}
                    </p>
                    <img
                        src=${item.status === "unread"
    ? `assets/icons/stop.svg`
    : `assets/icons/checkbox-circle.svg`}
                        alt=${item.status === "unread"
    ? `message not read icon`
    : `message read icon`}
                        height="20px"
                    />
            </div>
            ${item.description.key.length > 0
    ? `<p class="show-courses"> ${item.description.key}:
                    <span style="color: black">
                        ${item.description.value}
                    </span>
                </p>`
    : ``}
            <p class="notification-item-datetime show-courses">
                ${item.timestamp}
            </p>
        </div>
        `)
    .join("")}
`;
const notificationsWrapperList = document.querySelectorAll(".notifications");
export const notificationsWrapper = notificationsWrapperList[0];
notificationsWrapper.innerHTML = markup;
// const notificationsDiv: NodeListOf<HTMLDivElement> =
// 	document.querySelectorAll(".notifications");
// let focusedIndex = 0;
// notificationsDiv.forEach((item: HTMLDivElement, index) => {
// 	item.addEventListener("keydown", (e: KeyboardEvent) => {
// 		e.preventDefault();
// 		const firstElement: HTMLDivElement = item.children[0] as HTMLDivElement;
// 		focusedIndex = 1;
// 		console.log("focus before: ", firstElement);
// 		if (e.key === "ArrowDown") {
// 			firstElement.focus();
// 			console.log("focus on first element");
// 		}
// 	});
// });
// const notificationItem: NodeListOf<HTMLLIElement> =
// 	document.querySelectorAll(".notification-item");
// notificationItem.forEach((item, index) => {
// 	const menuItems: HTMLDivElement = item?.parentElement as HTMLDivElement;
// 	console.log("menuItems", menuItems, focusedIndex);
// 	item.addEventListener("keydown", (e: KeyboardEvent) => {
// 		const menuItemsLen: number = menuItems.children.length;
// 		const currNotification: HTMLLIElement = menuItems.children[
// 			focusedIndex
// 		] as HTMLLIElement;
// 		console.log("currNotification: ", currNotification);
// 		if (e.key === "ArrowDown") {
// 			focusedIndex = (focusedIndex + 1) % menuItemsLen;
// 			currNotification.focus();
// 			console.log(currNotification, "currNotification[focusedIndex]");
// 		} else if (e.key === "ArrowUp") {
// 			focusedIndex = (focusedIndex - 1 + menuItemsLen) % menuItemsLen;
// 			currNotification.focus();
// 		}
// 		// else if (e.key === "Escape") {
// 		// 	// e.preventDefault();
// 		// 	openDropdownMenu(parentDropdown);
// 		// } else if (e.key === "Tab") {
// 		// 	openDropdownMenu(parentDropdown);
// 		// } else if (e.key === "Enter") {
// 		// 	const tempContent = targetDiv.value;
// 		// 	targetDiv.value = item.textContent ?? "";
// 		// 	item.textContent = tempContent;
// 		// 	// e.preventDefault();
// 		// 	// alert(`You selected: ${currNotification.textContent}`);
// 		// 	openDropdownMenu(parentDropdown);
// 		// }
// 	});
// });
