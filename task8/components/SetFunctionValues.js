export class SetFunctionValues {
	/**
	 *
	 * @param {string} mathFunc - count, min, max, sum and average
	 * @param {{count: number, min: number, max: number, sum: number, average: number}} res
	 */
	setValuesInDom(spreadsheet, res) {
		const func = ["average", "count", "min", "max", "sum"];

		for (const currFunc of func) {
			const currFuncDiv = spreadsheet.container.querySelector(
				`#${currFunc}`
			);

			const currFuncRes = currFuncDiv.querySelector(".result");

			if (res[currFunc] !== null) {
				currFuncDiv.style.visibility = "visible";
				// currFuncDiv.classList.add("show-curr-func");
				currFuncRes.innerHTML = res[currFunc];
			} else {
				currFuncDiv.style.visibility = "hidden";
				// currFuncDiv.classList.remove("show-curr-func");
			}
		}
	}

	/**
	 *
	 * @param {string} mathFunc - count, min, max, sum and average
	 * @returns {{count: number, min: number, max: number, sum: number, average: number}}
	 */
	getSelectionResult(spreadsheet, selectionType) {
		console.log("selectionType", selectionType);
		if (!spreadsheet.model.selection) return null;

		const { start, end } = spreadsheet.model.selection;

		let startRow = Math.min(start.row, end.row);
		let endRow = Math.max(start.row, end.row);
		let startCol = Math.min(start.col, end.col);
		let endCol = Math.max(start.col, end.col);

		if (selectionType === "row") {
			endCol = startCol;
			for (let r = startRow; r <= endRow; r++) {
				if (spreadsheet.model.maxColOfRowSet[r] !== undefined) {
					endCol = Math.max(
						spreadsheet.model.maxColOfRowSet[r],
						endCol
					);
					console.log(
						"spreadsheet.model.maxColOfRowSet[r]",
						spreadsheet.model.maxColOfRowSet[r]
					);
				}
			}
		} else if (selectionType === "col") {
			endRow = startRow;
			for (let c = startRow; c <= endRow; c++) {
				if (spreadsheet.model.maxRowOfColSet[c] !== undefined) {
					endRow = Math.max(
						spreadsheet.model.maxRowOfColSet[c],
						endRow
					);
				}
			}
		}

		console.log(
			"startRow, endRow, startCol, endCol",
			startRow,
			endRow,
			startCol,
			endCol
		);

		let res = {
			count: null,
			min: null,
			max: null,
			sum: null,
			average: null,
		};

		// if (mathFunc.toLocaleLowerCase() === "sum") {
		for (let r = startRow; r <= endRow; r++) {
			for (let c = startCol; c <= endCol; c++) {
				const curr = parseFloat(spreadsheet.model.getCellValue(r, c));

				if (curr === undefined) continue;
				if (res.count === null) res.count = 0;
				res.count += 1;

				// check if curr is not a number
				if (isNaN(curr)) continue;

				if (res.min === null) res.min = curr;
				if (res.max === null) res.max = curr;
				if (res.sum === null) res.sum = 0;

				res.sum += curr;
				res.max = Math.max(res.max, curr);
				res.min = Math.min(res.min, curr);
			}
		}

		if (res.sum !== null && res.count !== null) {
			res.average = res.sum / res.count;
		}

		this.setValuesInDom(spreadsheet, res);
		return res;
	}
}
