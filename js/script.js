// Variables and Selectors
const modeBtn = document.querySelector(".dark-mode .box button");
const cardSubHead = document.querySelectorAll(".card-shadow");
let modeFlag = localStorage.getItem("modeFlag") || "light";
const boxElement = document.querySelector(".dark-mode .box");
const form = document.querySelector(".country-input");
const formBtn = document.querySelector(".country-input button");
const headerBtn = document.querySelector('.box-title-info button')
const countryInput = form.querySelector("input");
const listElem = document.querySelector(".country-list");
let newCountryList = [];
let foundCountry = [];
let filterValue;
const backToTopButton = document.getElementById("back-to-top");
let inputBox = "";
let countryList = [];

// Event Listeners
window.addEventListener("load", () => {
  setModeSetting();
  scrollViewOn();
});

modeBtn.addEventListener("click", changeMode);
headerBtn.addEventListener('click', tpList);
function tpList() {
  dropdownButton.scrollIntoView({ behavior: "smooth" });
}
formBtn.addEventListener("click", (e) => {
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchCountry(form)

});

countryInput.addEventListener("keyup", searchCountry);


// Functions

// set filter on countries
function countryFindRun() {
  foundCountry = countryList.filter((country) => {
    let inputValue = countryInput.value.toLowerCase().trim();
    return country.name.toLowerCase().includes(inputValue);
  });
  listElem.innerHTML = "";
  if (!countryInput.value.toLowerCase().trim()) {
    countryList.forEach((countryFounded) => {
      countriesGen(countryFounded);
    });
  } else {
    foundCountry.forEach((countryFounded) => {
      countriesGen(countryFounded);
    });
  }
  setModeCountry(filterValue);
}

// set mode on countries
function setModeCountry(value) {
  newCountryList = [...foundCountry]; // ایجاد یک کپی از countryList

  // Define filter functions
  const filterFunctions = {
    "a-z": (list) => list.sort((a, b) => a.name.localeCompare(b.name)),
    populate: (list) => list.sort((a, b) => b.population - a.population),
    "Breadth-down": (list) => list.sort((a, b) => a.area - b.area),
    "Breadth-up": (list) => list.sort((a, b) => b.area - a.area),
    "driving-left": (list) =>
      list.filter((country) => country.drivingSide === "left"),
    "driving-right": (list) =>
      list.filter((country) => country.drivingSide === "right"),
  };

  // Check if filterValue is a valid key in filterFunctions
  if (filterFunctions[value]) {
    // Apply filter function
    newCountryList = filterFunctions[value](foundCountry);
  }
  listElem.innerHTML = "";

  if (newCountryList) {
    // Display filtered list
    newCountryList.forEach((country) => {
      countriesGen(country);
    });
  } else {
    // Display filtered list
    foundCountry.forEach((country) => {
      countriesGen(country);
    });
  }
  scrollViewOn();
}

// keyboard Event

let isFirstRun = true;

function searchCountry(e) {
  console.log(e);
  
  if (e.keyCode === 13 || e.tagName == 'FORM') {
    
    if (countryInput.value.trim() !== "") {
      countryFindRun();
      isFirstRun = true
    } else if (isFirstRun) {
      countryFindRun();
      isFirstRun = false;
    }
  }
}

// change color mode
function changeMode() {
  if (modeFlag === "dark") {
    modeFlag = "light";
  } else {
    modeFlag = "dark";
  }
  setModeSetting();
  localStorage.setItem("modeFlag", modeFlag);
}

// color mode design
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

// create country
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
                      alt="پرچم"
                      title="پرچم کشور"
                    />
                  </div>
                  <div class="col-12 col-md-11">
                    <ul class="list mb-0 list-unstyled d-flex">
                      <li class="item" title="اسم کشور">
                        نام : <span class="name-item">${country.name}</span>
                      </li>
                      <li class="item" title="اسم قاره کشور مورد نظر">
                        قاره : <span class="continent-item">${
                          country.continent
                        }</span>
                      </li>
                      <li class="item" title="مساحت کشور">
                        مساحت : <span class="size-item">(km2) ${Number(
                          country.area
                        ).toLocaleString()} </span>
                      </li>
                      <li class="item" title="جمعیت کشور">
                         جمعیت : <span class="population">${Number(
                           country.population
                         ).toLocaleString()}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>`
  );
}

const noticeElems = document.querySelectorAll(".notice");
const infoSIde = document.querySelectorAll(".side-information");
let countNumExecuted = false;
// when view infront user
function scrollViewOn() {
  const countryBoxes = document.querySelectorAll(".country-box");

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
    backToTopButton.classList.remove("d-none");
  } else {
    backToTopButton.classList.add("d-none");
  }
}

window.addEventListener("scroll", () => {
  scrollViewOn();
});

// Add click event to the back to top button
backToTopButton.addEventListener("click", () => {
  // Scroll to the top of the page
  window.scrollTo(0, 0);
});

// API endpoint for countries
const url = `https://restcountries.com/v3.1/all`;

// Fetch the API data
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    // Extract the country data
    let countries = data;
    for (const country of countries) {
      // Create an object with country information
      let infoCountry = {
        name: `${country.name.common}`,
        area: `${country.area}`,
        continent: `${country.region}`,
        drivingSide: `${country.car.side}`,
        flag: `${country.flags.png}`,
        population: `${country.population}`,
      };

      // Add the country to the country list
      countryList.push(infoCountry);

      // Generate country information
      countriesGen(infoCountry);
    }
  })
  .catch((error) => console.error("Error:", error));

// Select the dropdown button and menu
const dropdownButton = document.querySelector(".dropdown-buttoned");
const dropdownMenu = document.querySelector(".dropdown-menued");
const listFilterItem = document.querySelector(".filter-line .list");

// Add change event to each input in the dropdown menu
dropdownMenu.querySelectorAll("input").forEach((input) => {
  input.addEventListener("change", (e) => {
    // Clear the filter list
    listFilterItem.innerHTML = "";

    // Get the filter name from the label's dataset
    let filterName =
      e.target.parentElement.querySelector("label").dataset.setValue;

    // Run the country find function
    countryFindRun();

    // Set the filter value
    filterValue = filterName;

    // Set the mode to country
    setModeCountry(filterValue);

    // Add a new filter item to the list
    listFilterItem.insertAdjacentHTML(
      "beforeend",
      `<li class="item-filter m-1">
            <button class="btn btn-warning d-flex align-items-center">
              ${filterName}<i class="bi bi-x-circle d-flex ms-2"></i>
            </button>
          </li>`
    );

    // Select all filter items
    let filterItems = document.querySelectorAll(
      ".filter-line .list .item-filter i"
    );

    // Add events to each filter item
    filterItems.forEach((elem) => {
      // Add click event to remove the filter item
      elem.addEventListener("click", (e) => {
        e.target.parentElement.parentElement.remove();
        listFilterItem.innerHTML = "";

        // Uncheck all inputs in the dropdown menu
        dropdownMenu.querySelectorAll("input").forEach((input) => {
          input.checked = false;
        });

        // Reset the filter value
        filterValue = "";

        // Run the country find function
        countryFindRun();
      });

      // Add mouseenter event to change the icon
      elem.addEventListener(
        "mouseenter",
        (e) => (elem.className = "bi bi-x-circle-fill d-flex ms-2")
      );

      // Add mouseleave event to change the icon back
      elem.addEventListener(
        "mouseleave",
        (e) => (elem.className = "bi bi-x-circle d-flex ms-2")
      );
    });
  });
});

// Add click event to the dropdown button
dropdownButton.addEventListener("click", () => {
  // Toggle the show class on the dropdown menu
  dropdownMenu.classList.toggle("show");
  if (dropdownMenu.classList.contains('show')) {
    dropdownButton.querySelector('i').className = 'bi d-flex ms-1 bi-caret-down-fill'
  } else {
    dropdownButton.querySelector('i').className = 'bi d-flex ms-1 bi-caret-up-fill'

  }
});

// Select all close buttons
const closeButtonInput = document.querySelector(".close-all-input");

// Add click event to each close button
closeButtonInput.addEventListener("click", () => {
  // If no filter value, exit

  if (!filterValue) {
    return;
  }

  // Select all radios in the dropdown menu
  const radios = dropdownMenu.querySelectorAll('input[type="radio"]');

  // Clear the filter list
  listFilterItem.innerHTML = "";

  // Loop through each radio
  radios.forEach((radio) => {
    // Uncheck the radio
    radio.checked = false;
  });

  // Reset the filter value
  filterValue = "";

  // Run the country find function
  countryFindRun();
});
