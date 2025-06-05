// [5]
// [2, 2]

// [0, 1, 1]
// 1, 1, 0

// [5]
// [2, 0]

// [0, 1]

// [1, 2]
// [1, 5]

// [0, 0, 0, 0]
// [0, 0, 1, 0]
// [0, 0, 3, 0]
// [0, 0, 8, 0]
// [0, 1, 8, 0]
var curr = 123;
while (curr > 0) {
	var num = curr / 10;
	num = Math.floor(num);
	var mod = curr % 10;
	// res[target] += mod;
	// target--;

	curr = num;
	console.log(mod);
}

N = 10000;

function multi(a, b) {
	var maxLen = Math.max(a.length, b.length) * 2 + 1;

	var resArr = new Array(maxLen).fill(0);

	var al = a.length;
	var bl = b.length;

	for (var i = a.length - 1; i >= 0; i--) {
		for (var j = b.length - 1; j >= 0; j--) {
			var a1 = al - i - 1;
			var a2 = bl - j - 1;
			var target = a1 + a2;

			var ind = maxLen - target - 1;

			var curr = a[i] * b[j];

			while (curr > 0) {
				var num = curr / N;
				num = Math.floor(num);
				var mod = curr % N;
				resArr[ind] += mod;
				ind--;

				curr = num;
			}
		}
	}

	var carry = 0;

	for (var i = resArr.length - 1; i >= 0; i--) {
		resArr[i] += carry;

		if (resArr[i] >= N) {
			carry = Math.floor(resArr[i] / N);
			resArr[i] = resArr[i] % N;
		} else carry = 0;
	}

	var finalRes = [];
	var found = false;

	for (var i = 0; i < resArr.length; i++) {
		if (resArr[i] != 0) found = true;
		if (found) finalRes.push(resArr[i]);
	}

	return finalRes;
}

console.log("multiplication: ", multi([1], [1]));

function factorial(num) {
	var res = [1];
	console.log("num: ", num);
	for (var i = 1; i <= num; i++) {
		console.log("i: ", i);

		var currArr = [];

		var curr = i;

		while (curr > 0) {
			var currNum = curr / N;
			currNum = Math.floor(currNum);
			var mod = curr % N;

			currArr.push(mod);
			curr = currNum;
		}

		currArr.reverse();

		res = multi(res, currArr);
	}

	return res;
}

var temp = factorial(1000);
console.log("temp: ", temp);

var res = "";
for (var i = 0; i < temp.length; i++) {
	res += String(temp[i]).padStart(4, "0");
}

console.log("res: ", res);
console.log("res.length: ", res.length);
