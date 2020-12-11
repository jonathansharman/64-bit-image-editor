"use strict";

let url = document.getElementById("url");
let input = document.getElementById("input");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let gridButton = document.getElementById("gridButton");
let clearButton = document.getElementById("clearButton");
let copyLinkButton = document.getElementById("copyLinkButton");

const nrows = 8;
const ncols = 8;
const cellWidth = canvas.width / ncols;
const cellHeight = canvas.height / nrows;

let picture = 0n;
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

// Draws the current picture and updates the URL.
function updateImage() {
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	let pictureCopy = picture;
	for (let row = 0; row < nrows; ++row) {
		for (let col = 0; col < ncols; ++col) {
			if (pictureCopy & 1n) {
				ctx.fillStyle = "#000000";
			} else {
				ctx.fillStyle = "#FFFFFF";
			}
			ctx.fillRect(col * cellWidth, row * cellWidth, (col + 1) * cellWidth, (row + 1) * cellWidth);
			pictureCopy /= 2n;
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
	// Add current picture to URL.
	let split = window.location.href.split("?");
	window.history.pushState(null, null, split[0] + "?picture=" + picture);
	// Update the URL text.
	url.innerHTML = window.location.href;
}

// Update the current picture when the input text changes.
input.addEventListener("input", function() {
	try {
		picture = BigInt(input.value);
	} catch (e) {
		picture = 0n;
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
		picture = picture ^ bit;
		updateImage();
		input.value = picture;
	}
});

// Toggle grid.
gridButton.addEventListener("click", function() {
	showGrid = !showGrid;
	updateImage();
});

// Clear the current image.
clearButton.addEventListener("click", function() {
	picture = 0n;
	input.value = "0";
	updateImage();
});

// Copy the link to the image.
copyLinkButton.addEventListener("click", function() {
	window.getSelection().selectAllChildren(url);
	document.execCommand("copy");
	window.getSelection().removeAllRanges();
});

// Check for a picture URL parameter.
try {
	picture = BigInt(new URLSearchParams(window.location.search).get("picture"));
	input.value = picture;
} catch (e) {
	// No parameter found. Ignore.
}

// Update image at the start to draw grid.
updateImage();
