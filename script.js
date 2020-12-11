const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const columns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');
const arrNames = ['backlog', 'progress', 'complete', 'onHold'];

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];

let draggedItem,
    currentColumn;
const listArrays = [backlogListArray,progressListArray,completeListArray,onHoldListArray];
// Drag Functionality


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  
  if (localStorage.getItem('backlogItems')) {
    listArrays.forEach((item,i) => {
      listArrays[i] = JSON.parse(localStorage[`${arrNames[i]}Items`]);
      
    });
  } else {
    listArrays[0] = ['Release the course', 'Sit back and relax'];
    listArrays[1] = ['Work on projects', 'Listen to music'];
    listArrays[2] = ['Being cool', 'Getting stuff done'];
    listArrays[3] = ['Being uncool'];
    // backlogListArray = 
    // progressListArray = 
    // completeListArray = 
    // onHoldListArray = 
  }
  
  
}

// save to local storage
function saveColumns() {
  
  listArrays.forEach((item,i) => {
    localStorage.setItem(`${arrNames[i]}Items`, JSON.stringify(item));
    
  });

}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", 'drag(event)');
  //Append
  columnEl.appendChild(listEl);

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once on first time
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  

  listArrays.forEach((arrItem,arrI) => {
    columns[arrI].textContent = "";
    arrItem.forEach((item,i) => {
      createItemEl(columns[arrI], arrI, item, i);
   
    });
  });
  
  // Backlog Column
  // backlogList.textContent=''; // remove all elements inside!
  // backlogListArray.forEach((item,index)=>{
  
  //   createItemEl(backlogList, 0, item, index);
  // });
  // // Progress Column
  // progressList.textContent=''; // remove all elements inside!
  // progressListArray.forEach((item,index)=>{
  //   createItemEl(progressList, 1, item, index);
  // });
  // // Complete Column
  // completeList.textContent=''; // remove all elements inside!
  // completeListArray.forEach((item,index)=>{
  //   createItemEl(completeList, 2, item, index);
  // });
  // // On Hold Column
  // onHoldList.textContent=''; // remove all elements inside!
  // onHoldListArray.forEach((item,index)=>{
  //   createItemEl(onHoldList, 3, item, index);
  // });
  // Run getSavedColumns only once, Update Local Storage


}

// When item starts dragging
function drag(e) {
  draggedItem = e.target;
 
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

function drop(e){
  e.preventDefault();

  // Add item to column
  const parent = columns[currentColumn];
  parent.appendChild(draggedItem);
  // unhighlight column when item is dropped
  e.target.classList.remove("over");
  
  updateArrays();
  saveColumns();
}


// Allow arrays to reflect changes
function updateArrays() {
  listArrays.forEach((arrItem,index) => {
    
    listArrays[index] = [];
    
    for (let i = 0; i < columns[index].children.length; i++) {
      listArrays[index].push(columns[index].children[i].textContent);
    }
  
  });

  // backlogListArray = [];
  // for (let i = 0; i < backlogList.children.length; i++) {
  //   backlogListArray.push(backlogList.children[i].textContent);
  // }
  // progressListArray = [];
  // for (let i = 0; i < progressList.children.length; i++) {
  //   progressListArray.push(progressList.children[i].textContent);
  // }
  // onHoldListArray = [];
  // for (let i = 0; i < onHoldList.children.length; i++) {
  //   onHoldListArray.push(onHoldList.children[i].textContent);
  // }
  // completeListArray = [];
  // for (let i = 0; i < completeList.children.length; i++) {
  //   completeListArray.push(completeList.children[i].textContent);
  // }

  
  // listArrays.forEach((item,index) => {
  //   item = [];
  //   for (let i=0; i<columns[index].children.length; i++) {
  //     item.push(columns[index].children[i].textContent);
      
  //   }
    
  // });
 
  updatedOnLoad = true;
  updateDOM();

}

function addToColumn(column) {
  const itemText = addItems[column].textContent;
  listArrays[column].push(itemText);
  saveColumns(); //save to local storage
  updateDOM();
}

function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

// Add text to a column

function hideInputBox(column) {
  addBtns[column].style.visibility= "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

updateDOM();

