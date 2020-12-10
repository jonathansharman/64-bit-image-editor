"use strict";

let input = document.getElementById("input");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let gridButton = document.getElementById("gridButton");
let clearButton = document.getElementById("clearButton");

const nrows = 8;
const ncols = 8;
const cellWidth = canvas.width / ncols;
const cellHeight = canvas.height / nrows;

let value = 0n;
let showGrid = true;

function drawLine(x0, y0, x1, y1) {
	// Properly align drawing to pixels.
	ctx.translate(0.5, 0.5);
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.stroke();
	// Realign drawing to default.
	ctx.translate(-0.5, -0.5);
}

// Draw the current value.
function updateImage() {
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	let currentValue = value;
	for (let row = 0; row < nrows; ++row) {
		for (let col = 0; col < ncols; ++col) {
			if (currentValue & 1n) {
				ctx.fillStyle = "#000000";
			} else {
				ctx.fillStyle = "#FFFFFF";
			}
			ctx.fillRect(col * cellWidth, row * cellWidth, (col + 1) * cellWidth, (row + 1) * cellWidth);
			currentValue /= 2n;
		}
	}
	if (showGrid) {
		for (let col = 1; col < ncols; ++col) {
			const x = col * cellWidth;
			drawLine(x, 0, x, canvas.height);
		}
		for (let row = 1; row < nrows; ++row) {
			const y = row * cellHeight;
			drawLine(0, y, canvas.width, y);
		}
	}
}

// Update the current value when the input text changes.
input.addEventListener("input", function() {
	try {
		value = BigInt(input.value);
	} catch(e) {
		value = 0n;
	}
	updateImage();
});
// Select text when the input box is clicked.
input.addEventListener("click", function() {
	this.select();
});

// Update pixels by clicking the image.
canvas.addEventListener("mousedown", function(event) {
	if (event.button === 0) {
		const col = Math.trunc(ncols * event.offsetX / canvas.width);
		const row = Math.trunc(nrows * event.offsetY / canvas.height);
		let bit = 1n << BigInt(row * ncols + col);
		value = value ^ bit;
		updateImage();
		input.value = value;
	}
});

// Toggle grid.
gridButton.addEventListener("click", function() {
	showGrid = !showGrid;
	updateImage();
});

// Clear the current image.
clearButton.addEventListener("click", function() {
	value = 0n;
	input.value = "0";
	updateImage();
});

// Update image at the start to draw grid.
updateImage();
