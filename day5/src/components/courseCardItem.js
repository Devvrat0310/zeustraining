import { details } from "./courseDetails.js";

const markup = `
  ${details
		.map(
			(data) => `
    <div class="course-card-item">
    ${data.expired ? `<div class = "expired-card" > EXPIRED </div>` : ``}
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
                <li>${data.class} 1</li>
                <li>${data.class} 2</li>
                <li>${data.class} 3</li>
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

export const courseCardsTemp =
	document.getElementsByClassName("course-cards")[0];

courseCardsTemp.innerHTML = markup;
