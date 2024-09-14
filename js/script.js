let modeBtn = document.querySelector(".dark-mode .box button");
let cardSubHead = document.querySelectorAll(".card-shadow");
let modeFlag = localStorage.getItem("modeFlag") || "light";
let boxElement = document.querySelector(".dark-mode .box");

// filter variable
let filterItems = document.querySelectorAll(
  ".filter-line .list .item-filter i"
);
window.addEventListener("load", () => {
  setModeSetting();
  countNum();
});
// events
modeBtn.addEventListener("click", changeMode);
filterItems.forEach((elem) => {
  console.log(elem);
  elem.addEventListener(
    "mouseenter",
    (e) => (elem.className = "bi bi-x-circle-fill d-flex ms-2")
  );
  elem.addEventListener(
    "mouseleave",
    (e) => (elem.className = "bi bi-x-circle d-flex ms-2")
  );
});

// functions ...

// change mode
function changeMode() {
  if (modeFlag === "dark") {
    modeFlag = "light";
  } else {
    modeFlag = "dark";
  }
  setModeSetting();
  localStorage.setItem("modeFlag", modeFlag);
}
// mode design
function setModeSetting() {
  if (modeFlag === "light") {
    document.documentElement.setAttribute("data-bs-theme", "light");
    document.body.className = "light-mode";
    boxElement.classList.remove("box-dark-mode");
    boxElement.querySelector(".btn").className = "btn btn-light";
    boxElement.style.justifyContent = "right";
    document.body.style.backgroundColor = "var(--blue-20)";
    [...cardSubHead].forEach((item) => {
      item.style.boxShadow = " 0 0 15px rgba(4, 52, 124, 0.141)";
    });
  } else {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    document.body.className = "dark-mode";
    boxElement.classList.add("box-dark-mode");
    boxElement.querySelector(".btn").className = "btn btn-dark";
    boxElement.style.justifyContent = "left";
    document.body.style.backgroundColor = "var(--blue-80)";
    [...cardSubHead].forEach((item) => {
      item.style.boxShadow = "0 0 15px rgba(255, 255, 255, 0.123)";
    });
  }
}
// counter number
function countNum() {
  let allNum = document.querySelectorAll(".card-shadow .card-text");

  allNum.forEach((item) => {
    let secondValue = item.dataset.setValue;
    if (secondValue) {
      // assuming you want to count elements with a non-empty datasetValue
      let perSec = secondValue / 1000;

      let condition = 0; // initialize condition to 0
      let timer = setInterval(() => {
        if (condition < secondValue) {
          item.innerHTML = ` ${Math.floor(condition).toLocaleString()}+`;
          condition += perSec;
        } else {
          item.innerHTML = ` ${Number(secondValue).toLocaleString()}+`;
          clearInterval(timer);
        }
      }, 5); // increment every 1 second
    }
  });
}

