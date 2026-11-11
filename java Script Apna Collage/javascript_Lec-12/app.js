
const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Dropdown mein currencies add karna
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");

    newOption.innerText = currCode;
    newOption.value = currCode;

    // Default currency select karna
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  // Currency change hone par flag update karna
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Flag update function
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Exchange rate update function
const updateExchangeRate = async () => {
  try {
    let amount = document.querySelector(".amount input");
    let amtVal = Number(amount.value);

    // Amount validation
    if (!amount.value || amtVal < 1 || !Number.isFinite(amtVal)) {
      amtVal = 1;
      amount.value = "1";
    }

    // API URL
    const URL = `${BASE_URL}/${fromCurr.value}`;

    // API se data fetch karna
    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error("API response failed");
    }

    let data = await response.json();

    if (data.result !== "success") {
      throw new Error("Exchange rate data not available");
    }

    // Exchange rate nikalna
    let rate = data.rates[toCurr.value];

    if (rate === undefined) {
      throw new Error("Selected currency rate not available");
    }

    // Final amount calculate karna
    let finalAmount = amtVal * rate;

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

  } catch (error) {
    console.error("Error:", error);
    msg.innerText = "Something went wrong! Please try again.";
  }
};

// Button click event
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Page load hone par default conversion
window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});
