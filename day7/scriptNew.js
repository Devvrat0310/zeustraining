const l = ["1", "23", "2", "100", "1000", "1", "343", "1", "1"];
const r = ["100", "28", "7", "200", "2000", "343", "686", "2401", "16807"];

const b = [8, 2, 7, 7, 7, 7, 7, 7];

console.log("hehe");

function convertToBase(num, base) {
	let res = "";

	while (num > 0) {
		let mod = num % base;
		res += mod;
		num /= base;
		num = Math.floor(num);
		if (num < base) res += num;
		break;
	}

	let temp = res.split("").reverse().join("");
	return temp;
}

function solve(l, b, r) {
	mp = {};

	const l1 = convertToBase(l, b);
	const r1 = convertToBase(r, b);

	let dp = [];

	let num = 1;
	while (num < parseInt(r)) {}

	// console.log(l, l1);
	// console.log(r, r1);
}

for (let i = 0; i < 1; i++) {
	solve(l[i], b[i], r[i]);
}
