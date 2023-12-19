console.log("Hello World");

const canvas = document.querySelector("#canvas");
const resetButton = document.querySelector("#reset")
const colorPicker = document.getElementById('colorPicker');
const undoButton = document.querySelector("#undo");
const saveButton = document.querySelector("#save");
const loadButton = document.querySelector("#load");


const NUM_PIXELS = 900;
const PIXEL_SIZE = 20;

let currentColor = "#000000" 
let isMouseDown = false;
let changesStack = [];


function createGrid() {
    // for loop that creates individual pixels 

    for (let i = 0; i < NUM_PIXELS; i++) {
        const pixel = document.createElement('button'); // create a button and store it in the pixel variable
        pixel.style.width = `${PIXEL_SIZE}px`; // set the width of the pixel
        pixel.style.height = `${PIXEL_SIZE}px`; // set the height of the pixel

        let hasBeenClicked = false;

        pixel.addEventListener('click', function(event) { // add this event listener to each pixel upon creation

            // Push the current state to the stack before changing
            // * Note the reason why this works effectively is because when primitive data types are copied, they are copied by their value
            // non-primitive data types are copied by their reference
            changesStack.push({ pixel: pixel, color: pixel.style.background });

            if (hasBeenClicked === false ){
                pixel.style.background = currentColor;
                hasBeenClicked = true;
            } else {
                pixel.style.background = ""
                hasBeenClicked = false;
            }   
        })

        resetButton.addEventListener("click", function() {
            pixel.style.background = "";
        })

        pixel.addEventListener('mousedown', function(event){
            isMouseDown = true;
        });
        pixel.addEventListener('mouseup', function(event) {
            isMouseDown = false;
        });
        pixel.addEventListener('mouseenter', function(event) {
            if (isMouseDown) { //if the mouse is down
                if (pixel.style.background !== currentColor) { //verify whether the current background of the pixel is not the current color chosen/ 
                    changesStack.push({ pixel: pixel, color: pixel.style.background }); //if not, store that info into an object and push it into the changesStack array 
                }
                pixel.style.background = currentColor; // change the background color of the pixel to the current color chosen
            }
        });
        canvas.appendChild(pixel); //append each pixel into the canvas
    }
};

// event listener that saves the pixel drawing
saveButton.addEventListener("click", function() {
    const drawing = []; // create an empty array
    const pixels = canvas.querySelectorAll('button'); // select all the elements in the canvas
    pixels.forEach(pixel => { 
        drawing.push(pixel.style.background); // push each pixel into the drawing array
    });
    localStorage.setItem('drawing', JSON.stringify(drawing)); // set the item in local storage to be the array
});

// event listener that loads the saved pixel drawing
loadButton.addEventListener("click", function() {
    const savedDrawing = localStorage.getItem('drawing'); // get the drawing array from the local storage
    if (savedDrawing) { // if there are items in the array
        const drawing = JSON.parse(savedDrawing); // parse them 
        const pixels = canvas.querySelectorAll('button'); // select all elements in the canvas 
        // for each pixel in canvas
        pixels.forEach((pixel, index) => { 
            pixel.style.background = drawing[index] || '';  // each pixel's background color is set to correspond to the color saved in drawing at the same position.
        });
    }
});

// event listener that undos most recent change
undoButton.addEventListener("click", function() {
    if (changesStack.length > 0) { // if the changesStack array is not empty
        const lastChange = changesStack.pop(); // pop the most recent pixel that was changed and store it in a variable
        lastChange.pixel.style.background = lastChange.color; // sets it background color to what it was before the change
    }
});

colorPicker.addEventListener('input', function() {
    currentColor = this.value;
});



createGrid();

