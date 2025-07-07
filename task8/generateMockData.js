import { writeFileSync } from "fs";
// import { userRecords } from "./DB/tables/userRecords.js";

let userRecords = [];
console.log("Before:", userRecords.length);

for (let i = 0; i < 50000; i++) {
	let curr = {
		id: i + 1,
		firstName: `user_${i + 1}`,
		lastName: `last_${i + 1}`,
		age: Math.floor(Math.random() * (60 - 20 + 1)) + 20,
		salary: (Math.floor(Math.random() * (500 - 60 + 1)) + 60) * 10000,
	};
	userRecords.push(curr);
}

userRecords = JSON.stringify(userRecords, null, 2);
writeFileSync(
	"./DB/tables/userRecords.js",
	`export const userRecords = ${userRecords};`
);

// console.log("After:", userRecords.length);
// console.log("userRecords", userRecords);
