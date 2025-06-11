const notifications = [
	{
		id: 1,
		type: "license_assignment",
		message:
			"License for Introduction to Algebra has been assigned to your school",
		description: {},
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
		description: {},
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
		message:
			"License for Basic Concepts in Geometry has been assigned to your...",
		description: {},
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
	.map(
		(item) =>
			` 
        <div class="notification-item ${
					item.status == "read" ? `read` : `unread`
				}">
               <div class="notification-item-content">

                
                    <p> 
                        ${item.message}
                    </p>
                    <img
                        src=${
													item.status == "unread"
														? `assets/icons/stop.svg`
														: `assets/icons/checkbox-circle.svg`
												}
                        alt=""
                        height="20px"
                    />
            </div>
            ${
							item.description.key
								? `<p class="show-courses"> ${item.description.key}:
                    <span style="color: black">
                        ${item.description.value}
                    </span>
                </p>`
								: ``
						}
            <p class="notification-item-datetime show-courses">
                ${item.timestamp}
            </p>
        </div>
        `
	)
	.join("")}
`;

export const notificationWrapper =
	document.getElementsByClassName("notifications")[0];

notificationWrapper.innerHTML = markup;
