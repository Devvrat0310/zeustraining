const announcements = [
	{
		sender: "Wilson Kumar",
		status: "read",
		message: "No classes will be held on 21st Nov",
		attachments: "2 files are attached",
		course: "",
		timestamp: "15-Sep-2018 at 07:21 pm",
	},
	{
		sender: "Samson White",
		status: "unread",
		message: "Guest lecture on Geometry on 20th September",
		attachments: "2 files are attached",
		course: "",
		timestamp: "15-Sep-2018 at 07:21 pm",
	},
	{
		sender: "Wilson Kumar",
		status: "read",
		message: "Additional course materials available on request",
		attachments: "",
		course: "Mathematics 101",
		timestamp: "15-Sep-2018 at 07:21 pm",
	},
	{
		sender: "Wilson Kumar",
		status: "unread",
		message: "No classes will be held on 25th Dec",
		attachments: "",
		course: "",
		timestamp: "15-Sep-2018 at 07:21 pm",
	},
	{
		sender: "Wilson Kumar",
		status: "unread",
		message: "Additional course materials available on request",
		attachments: "",
		course: "Mathematics 101",
		timestamp: "15-Sep-2018 at 07:21 pm",
	},
];

const markup = `
${announcements
	.map(
		(item) =>
			` 
            <div class="notification-item ${
							item.status === "read" ? `read` : `unread`
						}">
                <div class="notification-item-content">
                    <p class="show-courses">
                        PA:
                        <span style="color: black">${item.sender}</span>
                    </p>
                    <img
                        src=${
													item.status === "unread"
														? `assets/icons/stop.svg`
														: `assets/icons/checkbox-circle.svg`
												}
                        alt=""
                        height="18px"
                    />
                </div>
                <p style="font-size: 14px">
                    ${item.message}
                </p>
				${
					item.course.length > 0
						? `<p class="show-courses"> Course:
                    <span style="color: black">
                        ${item.course}
                    </span>
                </p>`
						: ``
				}
                <div class="flex justify-between">
				
                    <div class="flex">
                    
					${
						item.attachments?.length > 0
							? `
													<img
												src="assets/icons/attachment.svg"
												alt=""
												height="15px"
												/>
												<p class="show-courses">${item.attachments}</p>
											`
							: ``
					}    
					            
                   </div>
                    <p class="notification-item-datetime show-courses">
                        ${item.timestamp}
                    </p>
                </div>
            </div>
        `
	)
	.join("")}
`;

export const announcementsWrapper =
	document.getElementsByClassName("notifications")[1];

announcementsWrapper.innerHTML = markup;

// ${	item.attachments.length > 0 ?
// 							`
// 								<img
//                             src="assets/icons/attachment.svg"
//                             alt=""
//                             height="15px"
// 							/>
// 							<p class="show-courses">${item.attachments}</p>
// 						` : ``}
