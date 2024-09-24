let modeBtn = document.querySelector(".dark-mode .box button");
let cardSubHead = document.querySelectorAll(".card-shadow");
let modeFlag = localStorage.getItem("modeFlag") || "light";
let boxElement = document.querySelector(".dark-mode .box");
let form = document.querySelector(".country-input");
let countryInput = document.querySelector(".country-input input");
let listElem = document.querySelector(".country-list");
const backToTopButton = document.getElementById("back-to-top");

let countryList = [];
// filter variable
let filterItems = document.querySelectorAll(
  ".filter-line .list .item-filter i"
);

// load Event in browser
window.addEventListener("load", () => {
  setModeSetting();
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

// disable preventDefalut
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

// event for keyup in keyboard
countryInput.addEventListener("keyup", searchCountry);

// search input Value
function searchCountry(e) {
  if (e.keyCode == 13) {
    countryFindRun(e.key);
  }
  countryFindRun(e.key);
}

// functions ...

// find country of user want to see
function countryFindRun() {
  const foundCountry = countryList.filter((country) => {
    let inputValue = countryInput.value.toLowerCase().trim();
    return country.name.toLowerCase().includes(inputValue);
  });

  listElem.innerHTML = "";
  foundCountry.forEach((countryFounded) => {
    countriesGen(countryFounded);
  });
}
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

const noticeElems = document.querySelectorAll(".notice");
const infoSIde = document.querySelectorAll(".side-information");

function countriesGen(country) {
  listElem.insertAdjacentHTML(
    "beforeend",
    ` <div class="col-12 my-2">
                <div
                  class="country-box p-3 rounded-3 d-flex flex-column flex-md-row align-items-center"
                >
                  <div
                    class="col-12 col-md-1 d-flex justify-content-center align-items-center"
                  >
                    <img
                      class="country-img d-flex mb-3 mb-md-0"
                      src="${country.flag}"
                      alt=""
                    />
                  </div>
                  <div class="col-12 col-md-11">
                    <ul class="list mb-0 list-unstyled d-flex">
                      <li class="item">
                        نام : <span class="name-item">${country.name}</span>
                      </li>
                      <li class="item">
                        قاره : <span class="continent-item">${country.continent}</span>
                      </li>
                      <li class="item">
                        مساحت : <span class="size-item">(km2) ${country.area} </span>
                      </li>
                      <li class="item">
                        جهت رانندگی : <span class="driving-item">${country.drivingSide}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>`
  );
  let countNumExecuted = false;

  const countryBoxes = document.querySelectorAll(".country-box");
  window.addEventListener("scroll", () => {
    countryBoxes.forEach((box) => {
      const rect = box.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        box.classList.add("in-view");
      } else {
        box.classList.remove("in-view");
      }
    });

    noticeElems.forEach((note) => {
      const rect = note.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        note.classList.add("in-view");
        document.querySelector(".section-borders").classList.add("in-view");
        if (!countNumExecuted) {
          countNum(); // Call countNum() only if it hasn't been executed before
          countNumExecuted = true; // Set the flag to true
        }
      }
    });

    infoSIde.forEach((info) => {
      const rect = info.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        info.classList.add("in-view");
      }
    });

    const scrollPosition = window.scrollY;
    if (scrollPosition > 200) {
      backToTopButton.classList.remove('d-none')
    } else {
      backToTopButton.classList.add('d-none')

    }


  });
}


backToTopButton.addEventListener("click", () => {
  window.scrollTo(0, 0);
});

// api countries
const url = `https://restcountries.com/v3.1/all`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    let countries = data;
    console.log(typeof data);
    for (const country of countries) {
      let infoCountry = {
        name: `${country.name.common}`,
        area: `${country.area}`,
        continent: `${country.region}`,
        drivingSide: `${country.car.side}`,
        flag: `${country.flags.png}`,
      };
      countryList.push(infoCountry);
      countriesGen(infoCountry);
    }
  })
  .catch((error) => console.error("Error:", error));
