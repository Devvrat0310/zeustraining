const l = ["23", "2", "100", "1000", "1", "343", "1", "1"];
const r = ["28", "7", "200", "2000", "343", "686", "2401", "16807"];

const b = [8, 2, 7, 7, 7, 7, 7, 7];

function convertToBase(num, base) {
	const res = "";

	while (num > 0) {
		let mod = num % base;
		res += mod;
		num /= base;
		if (num < base) res += num;
		break;
	}

	res.split("").reverse().join("");
	return res;
}

function solve(l, b, r) {
	mp = {};

	const l1 = convertToBase(l, b);
	const r1 = convertToBase(r, b);

	console.log(l, l1);
	console.log(r, r1);
}

for (let i = 0; i > l.length; i++) {
	solve(l[i], b[i], r[i]);
}
