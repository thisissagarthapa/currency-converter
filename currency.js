const dropList = document.querySelectorAll(".drop-list select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_code) {
    let selected = "";
    if (i === 0 && currency_code === "USD") {
      selected = "selected";
    } else if (i === 1 && currency_code === "NPR") {
      selected = "selected";
    }

    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target); // calling loadFlag with passing target element as an argument
  });
}

function loadFlag(element) {
  for (let code in country_code) {
    if (code === element.value) {
      let imgTag = element.parentElement.querySelector("img");
      if (imgTag) {
        imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`;
      } else {
        console.error("Image tag not found.");
      }
      break; // Once the match is found, exit the loop
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault(); // preventing form submitting.
  getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () => {
  console.log("Exchange icon clicked");
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  console.log("From Currency:", fromCurrency.value);
  console.log("To Currency:", toCurrency.value);
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const apiKey = "08202f26c0c2adfd753b6740";

  const amount = document.querySelector(".amount input"),
    exchangeRateTxt = document.querySelector(".exchange-rate");
  let amountVal = amount.value;

  // if the user doesn't enter any value or enters 0, then we'll put 1 value by default in the input field.
  if (amountVal === "" || amountVal == 0) {
    amount.value = 1;
    amountVal = 1;
  }

  exchangeRateTxt.innerText = "Getting Exchange Rate...";
  let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
      console.log(totalExchangeRate);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value}=${totalExchangeRate} ${toCurrency.value}`;
    })
    .catch(() => {
      exchangeRateTxt.innerText = "Something went wrong, please try again later";
    });
}
