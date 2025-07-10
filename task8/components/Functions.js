import { SheetModel } from "./SheetModel.js";

export class MathFunctions {
	/**
	 *
	 * @param {string} mathFunc - count, min, max, sum and average
	 * @returns {{count: number, min: number, max: number, sum: number, average: number}}
	 */
	getSelectedResult(start, end, mathFunc, model) {
		if (!model.selection) return null;

		// const { start, end } = model.selection;

		const startRow = Math.min(start.row, end.row);
		const endRow = Math.max(start.row, end.row);
		const startCol = Math.min(start.col, end.col);
		const endCol = Math.max(start.col, end.col);

		let res = {
			count: 0,
			min: Number.MAX_VALUE,
			max: -Number.MAX_VALUE,
			sum: 0,
			avg: 0,
		};

		// if (mathFunc.toLocaleLowerCase() === "sum") {
		for (let r = startRow; r <= endRow; r++) {
			for (let c = startCol; c <= endCol; c++) {
				const curr = parseFloat(model.getCellValue(r, c));

				// console.log("r, c, curr", r, c, curr);

				if (curr === undefined || isNaN(curr)) continue;

				// console.log("after continue");
				res.sum += curr;
				res.max = Math.max(res.max, curr);
				res.min = Math.min(res.min, curr);
				res.count += 1;
				res.avg = res.sum / res.count;
			}
		}

		return res[mathFunc];
	}

	isLetter(char) {
		const code = char.charCodeAt(0);
		return (code >= 65 && code <= 90) || (code >= 97 && code <= 122); // A-Z or a-z
	}

	expressionParser = () => {
		console.log("formula", formula);

		// Find the first opening parenthesis
		const openParenIndex = formula.indexOf("(");
		const closeParenIndex = formula.lastIndexOf(")");

		const separators = [":", ","];

		if (
			openParenIndex === -1 ||
			closeParenIndex === -1 ||
			closeParenIndex <= openParenIndex
		) {
			// return functionString;
			return Error("Invalid string");
		}

		// Extract function name and range
		const funcNameRaw = formula.slice(0, openParenIndex).trim();
		const rangeStr = formula
			.slice(openParenIndex + 1, closeParenIndex)
			.trim();

		const funcName = funcNameRaw.toLowerCase();

		console.log("funcName", funcName);

		const supportedFuncs = ["sum", "min", "max", "count", "average"];

		if (!supportedFuncs.includes(funcName)) return Error("Invalid string");

		// Support ranges like A1:B10
		const colonIndex = rangeStr.indexOf(":");
		if (colonIndex === -1) return functionString;

		const startRef = rangeStr.slice(0, colonIndex).trim();
		const endRef = rangeStr.slice(colonIndex + 1).trim();

		if (!supportedFuncs.includes(funcName)) return functionString;

		// Convert cell references to row/col indexes
		const toIndex = (ref) => {
			let col = 0,
				row = 0;
			let i = 0;

			// Parse letters (column)
			while (i < ref.length && this.isLetter(ref[i])) {
				col = col * 26 + (ref.charCodeAt(i) - 65 + 1);
				i++;
			}
			col -= 1; // Convert to 0-based index

			// Parse digits (row)
			row = parseInt(ref.slice(i), 10) - 1;

			return { row, col };
		};

		const start = toIndex(startRef);
		const end = toIndex(endRef);

		return this.getSelectedResult(start, end, funcName, model);
	};

	/**
	 *
	 * @param {string} functionString - The function string written for the particular cell.
	 * @returns {any} - Returns the computed result of the function or the original string.
	 */
	functionParser(functionString, model) {
		if (typeof functionString !== "string") return functionString;

		const trimmed = functionString.trim();

		if (!trimmed.startsWith("=")) return functionString;

		// Remove leading '='
		const formula = trimmed.slice(1).trim();

		const operStack = [];

		try {
			return expressionParser(formula);
		} catch (e) {
			console.log("Not a valid functino string");
			return functionString;
		}
	}
}

const model = new SheetModel(100, 100);

model.setCellValue(0, 0, 10);
model.setCellValue(0, 1, 10);

const mathFunc = new MathFunctions();

console.log(
	mathFunc.functionParser("=SUM(average(A1:a10) + average(b1:b10))", model)
);
