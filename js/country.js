// Variables and Selectors
const modeBtn = document.querySelector(".dark-mode .box button");
const cardSubHead = document.querySelectorAll(".card-shadow");
let modeFlag = localStorage.getItem("modeFlag") || "light";
const boxElement = document.querySelector(".dark-mode .box");
const backToTopButton = document.getElementById("back-to-top");
let btnBack = document.querySelector(".btn-return");
// Event Listeners
modeBtn.addEventListener("click", changeMode);

window.addEventListener("load", () => {
  setModeSetting(); // تنظیم حالت رنگ
});

btnBack.addEventListener("click", () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "index.html";
  }
});

// Functions
let countryCode = localStorage.getItem("countries");
getData(countryCode);

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

// Add click event to the back to top button
backToTopButton.addEventListener("click", () => {
  // Scroll to the top of the page
  window.scrollTo(0, 0);
});

const url = "https://restcountries.com/v3.1/name/iran";

function processCountryData(country) {
  const countryInfo = {
    name: country.name.common,
    area: country.area,
    continent: country.region,
    drivingSide: country.car.side,
    flag: country.flags.png,
    population: country.population,
    capital: country.capital,
    languages: Object.values(country.languages),
    borders: country.borders,
  };

  // دریافت نام کامل کشور های هم مرز
  const bordersNames = countryInfo.borders
    ? countryInfo.borders.map((border) =>
        fetch(`https://restcountries.com/v3.1/alpha/${border}`)
          .then((response) => response.json())
          .then((data) => data[0].name.common)
          .catch((error) => {
            console.error("Error fetching border data:", error);
            return null; // در صورت خطا، null برگردانید
          })
      )
    : [];

  // استفاده از Promise.all برای انتظار برای تمام درخواست‌ها
  return Promise.all(bordersNames).then((borders) => {
    countryInfo.borders = borders.filter(Boolean); // فیلتر کردن null ها

    const countryInfoLeft = [
      { label: "قاره", value: countryInfo.continent },
      { label: "مساحت", value: Number(countryInfo.area).toLocaleString() },
      { label: "پایتخت", value: countryInfo.capital },
      countryInfo.borders.length > 0
        ? { label: "کشور های هم مرز", value: countryInfo.borders.join(" - ") }
        : { label: "کشور های هم مرز", value: "Nothing" },
      { label: "پرچم", value: countryInfo.flag },
    ];

    const countryInfoRight = [
      { label: "اسم", value: countryInfo.name },
      {
        label: "زبان",
        value: Object.values(countryInfo.languages)
          .slice(0, 10)
          .reduce((acc, language) => {
            acc.push(language);
            return acc;
          }, []),
      },
      {
        label: "جمعیت",
        value: Number(countryInfo.population).toLocaleString(),
      },
      { label: "واحد پول", value: Object.values(country.currencies)[0].name },
      { label: "جهت رانندگی", value: countryInfo.drivingSide },
      {
        label: "کد تلفن",
        value: country.idd.suffixes.slice(0, 10).reduce((acc, suffix) => {
          acc.push(`${country.idd.root}${suffix}`);
          return acc;
        }, []),
      },
    ];

    return { left: countryInfoLeft, right: countryInfoRight };
  });
}

function getData(countryCode) {
  console.log("Fetching data from API...");
  fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data received:", data);
      const country = data[0];
      return processCountryData(country); // Return the promise
    })
    .then((data) => {
      console.log(data.left);
      console.log(data.right);
      const sideRightDiv = document.querySelector(".side-right");
      const countryInfoRightList = data.right.map((item) => {
        const listItem = document.createElement("li");
        listItem.style.wordBreak = "break-all";
        const icon = document.createElement("i");
        const iconMap = {
          اسم: "bi bi-person",
          زبان: "bi bi-translate",
          زمان: "bi bi-clock",
          جمعیت: "bi bi-people",
          "واحد پول": "bi bi-currency-dollar",
          "جهت رانندگی": "bi bi-car-front",
          "کد تلفن": "bi bi-phone",
          "نوع حکومت": "bi bi-building",
          "نیروی نظامی": "bi bi-shield",
        };
        const iconName = iconMap[item.label];
        if (iconName) {
          icon.className = iconName;
        } else {
          icon.className = "bi bi-question"; // Default icon if no match
        }
      
        const containerDiv = document.createElement("div");
        containerDiv.innerHTML = `${item.label} : `;
        containerDiv.className = `items`;
      
        if (Array.isArray(item.value)) {
          item.value.forEach((name) => {
            const span = document.createElement("span");
            span.innerText = name;
            span.className = "badge badge-secondary m-1"; // استفاده از کلاس‌های بوت‌استرپ
            containerDiv.appendChild(span);
          });
        } else {
          const span = document.createElement("span");
          span.innerText = item.value;
          span.className = "badge badge-secondary m-1"; // استفاده از کلاس‌های بوت‌استرپ
          containerDiv.appendChild(span);
        }
      
        listItem.appendChild(containerDiv);
        listItem.appendChild(icon);
        listItem.className = "list-item d-flex align-items-center justify-content-between"; // Add a class to each list item
        return listItem;
      });
      

      const sideLeftDiv = document.querySelector(".side-left .list");
      const imgS = document.querySelector(".img-side img");
      const countryInfoLeftList = data.left.map((item) => {
        const listItem = document.createElement("li");
        const icon = document.createElement("i");
        const iconMap = {
          قاره: "bi bi-globe ms-2",
          مساحت: "bi bi-rulers ms-2",
          پایتخت: "bi bi-building ms-2",
          "کشور های هم مرز": "bi bi-border ms-2",
          "آب و هوا": "bi bi-clouds ms-2",
        };

        const iconName = iconMap[item.label];
        if (item.label == "پرچم") {
          imgS.src = item.value;
        } else if (iconName) {
          icon.className = iconName;
        } else {
          icon.className = "bi bi-question ms-2"; // Default icon if no match
        }
        if (item.label != "پرچم") {
          listItem.innerHTML = `${item.label + ` : ` + item.value}`;
          listItem.appendChild(icon);
          listItem.className = "item btn mx-auto btn-outline-success"; // Add a class to each list item
        }
        return listItem;
      });
      sideLeftDiv.innerHTML = "";
      countryInfoLeftList.forEach((listItem) => {
        sideLeftDiv.appendChild(listItem);
      });

      sideRightDiv.innerHTML = "";
      countryInfoRightList.forEach((listItem) => {
        sideRightDiv.appendChild(listItem);
      });
      document.querySelector(".loader-container").classList.add("hide");
      document.body.classList.remove("no-scroll");
    })
    .catch((error) => console.error("Error fetching country data:", error));
}
