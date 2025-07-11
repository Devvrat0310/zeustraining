import { writeFileSync } from "fs";

/**
 * Generate mock data required to fill in excel
 */
class createMockData {
	/**
	 *
	 * @param {number} count - Number of records to generate
	 */
	constructor(count) {
		let userRecords = [];
		console.log("Before:", userRecords.length);

		for (let i = 0; i < count; i++) {
			let curr = {
				id: i + 1,
				firstName: `user_${i + 1}`,
				lastName: `last_${i + 1}`,
				age: Math.floor(Math.random() * 40) + 20,
				salary: (Math.floor(Math.random() * 100) + 600) * 10000,
			};
			userRecords.push(curr);
		}

		userRecords = JSON.stringify(userRecords, null, 2);
		writeFileSync("./DB/tables/userRecords.json", userRecords);
	}
}

new createMockData(100000);
