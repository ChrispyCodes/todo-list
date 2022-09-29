// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ***************** EVENT LISTENERS *************************
//submit form
form.addEventListener("submit", addItem);

//clear items
clearBtn.addEventListener("click", clearItems);
//get local storage
window.addEventListener("DOMContentLoaded", setupItems);

// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  console.log(id);
  if (value && !editFlag) {
    //call create function to render
    createListItem(id, value);
    //display alert
    displayAlert("added to list", "success");
    //show container
    container.classList.add("show-container");
    //add to local storage
    addToLocalStorage(id, value);
    //set to default
    setToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    //edit local storage
    editLocalStorage(editID, value);
    setToDefault();
  } else {
    displayAlert("please enter a value", "danger");
  }
}

//display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
}

//delete function
function deleteItem(e) {
  const item = e.currentTarget.parentElement.parentElement;
  const id = item.dataset.id;
  list.removeChild(item);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setToDefault();
  //remove from local storage
  removeFromLocalStorage(id);
}
//edit function
function editItem(e) {
  const item = e.currentTarget.parentElement.parentElement;
  //set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  //set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = item.dataset.id;
  submitBtn.textContent = "edit";
}

//set to default
function setToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "add";
}

//clear items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("list cleared", "success");
  setToDefault();
  localStorage.removeItem("list");
}

// ******************* LOCAL STORAGE **************************

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function addToLocalStorage(id, value) {
  const item = { id, value };
  let items = getLocalStorage();
  items.push(item);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

//render from local storage
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const item = document.createElement("article");
  //add id
  const attr = document.createAttribute("data-id");
  attr.value = id;
  item.setAttributeNode(attr);
  //add class
  item.classList.add("grocery-item");
  item.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
            <button type="type" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="type" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>`;
  //crud elements
  const deleteBtn = item.querySelector(".delete-btn");
  const editBtn = item.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);

  list.appendChild(item);
}
//local storage api
//setItem
//getItem
//removeItem
//save as strings
// ****** SETUP ITEMS **********
