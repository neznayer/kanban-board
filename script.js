const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const columns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");
const arrNames = ["backlog", "progress", "complete", "onHold"];

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];

let draggedItem, currentColumn;
const listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
];
// Drag Functionality

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
    if (localStorage.getItem("backlogItems")) {
        listArrays.forEach((item, i) => {
            listArrays[i] = JSON.parse(localStorage[`${arrNames[i]}Items`]);
        });
    } else {
        listArrays[0] = ["Release the course", "Sit back and relax"];
        listArrays[1] = ["Work on projects", "Listen to music"];
        listArrays[2] = ["Being cool", "Getting stuff done"];
        listArrays[3] = ["Being uncool"];
    }
}

// save to local storage
function saveColumns() {
    listArrays.forEach((item, i) => {
        localStorage.setItem(`${arrNames[i]}Items`, JSON.stringify(item));
    });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
    const listEl = document.createElement("li");
    listEl.classList.add("drag-item");
    listEl.textContent = item;
    listEl.draggable = true;
    listEl.setAttribute("ondragstart", "drag(event)");
    listEl.contentEditable = "true";
    listEl.id = `item_${column}_${index}`;
    listEl.addEventListener("focusout", (e) => {
        const editedItem = e.target;

        if (editedItem.textContent === "") {
            editedItem.parentNode.removeChild(editedItem);
            listArrays[column].splice(index, 1); // when item is dragged from and dropped to, its losing focus
        }

        updateArrays();
        saveColumns();
    });
    //Append
    columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
    // Check localStorage once on first time
    if (!updatedOnLoad) {
        getSavedColumns();
    }
    // remove all childs li fronm DOM columns, and re-create all of them based on data in arrays
    listArrays.forEach((arrItem, arrI) => {
        columns[arrI].textContent = "";
        arrItem.forEach((item, i) => {
            createItemEl(columns[arrI], arrI, item, i);
        });
    });
}

// When item starts dragging
function drag(e) {
    //draggedItem = e.target;
    e.dataTransfer.setData("text", e.target.id);
}

// Col allows for item to drop
function allowDrop(e) {
    e.preventDefault();
}

//Drag enter. In HTML we specify which index is going to pass in columnIndex, so we will know in which element draggable was hovered to highlihgt it
function dragEnter(columnIndex) {
    // remove background color/ padding
    columns.forEach((column) => {
        column.classList.remove("over");
    });
    columns[columnIndex].classList.add("over");
    currentColumn = columnIndex;
}

//On drop

function drop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");
    //const parentUlNode = e.target;
    //console.log(typeof(parentUlNode));
    //console.log("Parent node:", parentUlNode);
    //console.log(typeof(draggedItem));
    // Add item to column
    //const parent = columns[currentColumn];
    console.log("Element: ", document.getElementById(data));
    console.log("target: ", e.target);
    e.target.appendChild(document.getElementById(data));

    //columns[currentColumn].appendChild(draggedItem);
    // unhighlight column when item is dropped
    e.target.classList.remove("over");

    updateArrays();
    saveColumns();
}

// Allow arrays to reflect changes
function updateArrays() {
    // Update arrays from DOM element's textContent
    listArrays.forEach((arrItem, index) => {
        listArrays[index] = [];

        for (let i = 0; i < columns[index].children.length; i++) {
            listArrays[index].push(columns[index].children[i].textContent);
        }
    });

    updatedOnLoad = true;
    //updateDOM();
}

function addToColumn(column) {
    const itemText = addItems[column].textContent;
    addItems[column].textContent = "";
    listArrays[column].push(itemText); // Add added element to array

    saveColumns(); //save arrays to local storage
    updateDOM(); // read from local storage and re-create all elements
}

function showInputBox(column) {
    addBtns[column].style.visibility = "hidden";
    saveItemBtns[column].style.display = "flex";
    addItemContainers[column].style.display = "flex";
}

// Add text to a column

function hideInputBox(column) {
    addBtns[column].style.visibility = "visible";
    saveItemBtns[column].style.display = "none";
    addItemContainers[column].style.display = "none";
    addToColumn(column);
}

updateDOM();
