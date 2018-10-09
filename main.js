"use strict";

const beerSection = document.querySelector("section.beers");
const customerSection = document.querySelector("section.customers");
const bartenderSection = document.querySelector("section.bartenders");

let taps;
let beers;
let totalAmount;
let bartenderS;
window.addEventListener("DOMContentLoaded", init);
function init() {
  let data = JSON.parse(FooBar.getData());
  //  console.log(data);
  //  console.table(data.bartenders);
  //  console.table(data.serving);
  beers = data.beertypes;
  taps = data.taps;

  // build bar overview based on which beers are on tap, plus the ones that are left
  // it's possible that the same beer is on more than 1 tap, so total amount of kegs is not always 10, rather the 7 taps plus the number of beers that are left
  // build element of the 7 taps, regardless if there is any duplication

  // reset beer section before append new child
  beerSection.innerHTML = "";
  taps.forEach(buildTap);
  function buildTap(t, index) {
    let eachTap = document.createElement("div");
    eachTap.className = "beer";
    eachTap.setAttribute("data-beername", t.beer);
    eachTap.setAttribute("data-tapindex", index);
    beerSection.appendChild(eachTap);
    // get matching color of each beer
    // get matching glass of each beer
  }
  // find and build element of beers that are NOT on keg
  let beersOnKeg = [];
  taps.forEach(t => beersOnKeg.push(t.beer));
  for (let i = 0; i < beers.length; i++) {
    let beerName = beers[i].name;
    if (beersOnKeg.indexOf(beerName) < 0) {
      let eachNotOnTap = document.createElement("div");
      eachNotOnTap.className = "beer not-on-tap";
      eachNotOnTap.setAttribute("data-beername", beerName);
      beerSection.appendChild(eachNotOnTap);
    }
  }
  // put the 2 types of beers above together and define dynamic grid
  totalAmount = document.querySelectorAll(".beer").length;
  beerSection.style.gridTemplateColumns = `repeat(${totalAmount}, 1fr)`;
  // bartender section, same grid as above so they all line up
  bartenderSection.style.gridTemplateColumns = `repeat(${totalAmount}, 1fr)`;
  // generate bartenders
  bartenderS = data.bartenders;
  bartenderS.forEach(generateBartender);
  function generateBartender(b, bIndex) {
    let bartender = document.createElement("div");
    bartender.className = "bartender hide";
    bartender.setAttribute("data-name", b.name);
    bartender.setAttribute("data-onTap", b.usingTap + 1);
    bartender.setAttribute("data-servingCustomer", b.servingCustomer);
    if (b.statusDetail) {
      bartender.setAttribute("data-work", b.statusDetail);
    }
    bartender.textContent = b.name[0];
    bartenderSection.appendChild(bartender);
  }
  update();
}

function update() {
  let data = JSON.parse(FooBar.getData());
  // check storage of each beer, show on all if there are dulplicates
  beerSection.querySelectorAll(".beer").forEach(checkStorage);
  function checkStorage(b) {
    b.innerHTML = "";
    let beerName = b.dataset.beername;
    data.storage.forEach(checkMatch);
    function checkMatch(s) {
      if (s.name === beerName) {
        let storageCount = document.createElement("p");
        storageCount.textContent = s.amount;
        b.appendChild(storageCount);
      }
    }
  }
  // check each tap level
  taps = data.taps;
  taps.forEach(updateLevel);
  function updateLevel(t, index) {
    let level = t.level;
    let capacity = t.capacity;
    let containerHeight = beerSection.getBoundingClientRect().height;
    let eachTap = document.querySelector(`.beer:nth-of-type(${index + 1})`);
    let targetHeight = Math.floor((level / capacity) * containerHeight);
    eachTap.style.height = `${targetHeight}px`;
    eachTap.style.top = `${containerHeight - targetHeight}px`;
    // keg warning when need changing
    if (
      level / capacity < 0.1 &&
      Number(eachTap.querySelector("p").textContent) > 0
    ) {
      eachTap.classList.add("change-keg");
      // change keg animation? head of bartender of keg?
    } else if (
      level / capacity < 0.1 &&
      Number(eachTap.querySelector("p").textContent) === 0
    ) {
      eachTap.classList.add("soon-sold-out");
    }
  }

  // build customer section grid
  // all customer = serving + queue
  customerSection.innerHTML = "";
  let customerInServingCount = data.serving.length;
  let customerInQueueCount = data.queue.length;
  customerSection.style.gridTemplateRows = `repeat(${customerInQueueCount +
    customerInServingCount}, 30px)`;
  // generate each customer under service
  for (
    let customerIndex = 0;
    customerIndex < customerInServingCount;
    customerIndex++
  ) {
    let eachCustomer = document.createElement("div");
    eachCustomer.classList.add("serving");
    eachCustomer.setAttribute("data-ordernr", data.serving[customerIndex].id);
    eachCustomer.style.gridTemplateColumns = `repeat(${totalAmount}, 1fr)`;
    for (let j = 0; j < totalAmount; j++) {
      let beerCount = document.createElement("p");
      beerCount.setAttribute("data-count", "0");
      eachCustomer.appendChild(beerCount);
    }
    customerSection.appendChild(eachCustomer);
  }
  // generate each customer in queue
  for (
    let customerIndex = 0;
    customerIndex < customerInQueueCount;
    customerIndex++
  ) {
    let eachCustomer = document.createElement("div");
    eachCustomer.setAttribute("data-ordernr", data.queue[customerIndex].id);
    eachCustomer.style.gridTemplateColumns = `repeat(${totalAmount}, 1fr)`;
    for (let j = 0; j < totalAmount; j++) {
      let beerCount = document.createElement("p");
      beerCount.setAttribute("data-count", "0");
      eachCustomer.appendChild(beerCount);
    }
    customerSection.appendChild(eachCustomer);
  }
  // count up how many beer of each kind did each customer order, both in serving and in queue
  if (customerInServingCount > 0) {
    data.serving.forEach((q, qIndex) => {
      let eachCustomerOrderS = data.serving[qIndex].order;
      //      console.log(eachCustomerOrderS);
      eachCustomerOrderS.forEach(o => {
        // find out the ordered beer is in which column
        let tapIndex = Number(
          document
            .querySelector(`[data-beername='${o}']`)
            .getAttribute("data-tapindex")
        );
        //        console.log("tapIndex: " + tapIndex);
        let currentCount = document
          .querySelector(
            `.customers div:nth-of-type(${qIndex +
              1}) p:nth-of-type(${tapIndex + 1})`
          )
          .getAttribute("data-count");
        currentCount++;
        document
          .querySelector(
            `.customers div:nth-of-type(${qIndex +
              1}) p:nth-of-type(${tapIndex + 1})`
          )
          .setAttribute("data-count", currentCount);
        document.querySelector(
          `.customers div:nth-of-type(${qIndex + 1}) p:nth-of-type(${tapIndex +
            1})`
        ).textContent = currentCount;
      });
    });
  }
  if (customerInQueueCount > 0) {
    data.queue.forEach((q, qIndex) => {
      let eachCustomerOrderS = data.queue[qIndex].order;
      //      console.log(eachCustomerOrderS);
      eachCustomerOrderS.forEach(o => {
        // find out the ordered beer is in which column
        let tapIndex = Number(
          document
            .querySelector(`[data-beername='${o}']`)
            .getAttribute("data-tapindex")
        );
        //        console.log("tapIndex: " + tapIndex);
        let currentCount = document
          .querySelector(
            `.customers div:nth-of-type(${qIndex +
              customerInServingCount +
              1}) p:nth-of-type(${tapIndex + 1})`
          )
          .getAttribute("data-count");
        currentCount++;
        document
          .querySelector(
            `.customers div:nth-of-type(${qIndex +
              customerInServingCount +
              1}) p:nth-of-type(${tapIndex + 1})`
          )
          .setAttribute("data-count", currentCount);
        document.querySelector(
          `.customers div:nth-of-type(${qIndex +
            customerInServingCount +
            1}) p:nth-of-type(${tapIndex + 1})`
        ).textContent = currentCount;
      });
    });
  }

  // position bartender
  bartenderS = data.bartenders;
  bartenderS.forEach(updateBartender);
  function updateBartender(b) {
    let bartenderName = b.name;
    document
      .querySelector(`[data-name='${bartenderName}']`)
      .setAttribute("data-onTap", b.usingTap);
    document
      .querySelector(`[data-name='${bartenderName}']`)
      .setAttribute("data-servingCustomer", b.servingCustomer);
    if (b.statusDetail === "pourBeer") {
      document
        .querySelector(`[data-name='${bartenderName}']`)
        .classList.remove("hide");
      document.querySelector(`[data-name='${bartenderName}']`).style.top = "0";
      // put bartender in the column where the tap is used
      document.querySelector(
        `[data-name='${bartenderName}']`
      ).style.gridColumnStart = b.usingTap + 1;
      console.log(b.name + "serving nr: " + b.servingCustomer);
      // put bartender on the row of of the customer he's serving
      let customerPosition = document
        .querySelector("[data-ordernr='" + b.servingCustomer + "']")
        .getBoundingClientRect().top;
      let originalBartenderPosition = document
        .querySelector(`[data-name='${bartenderName}']`)
        .getBoundingClientRect().top;
      console.log(originalBartenderPosition);
      document.querySelector(
        `[data-name='${bartenderName}']`
      ).style.top = `${customerPosition - originalBartenderPosition}px`;
      document.querySelector(`[data-name='${bartenderName}']`).style.left =
        "20px";
    } else {
      document
        .querySelector(`[data-name='${bartenderName}']`)
        .classList.add("hide");
    }
  }
  setTimeout(update, 1000);
}
