"use strict";

const beerSection = document.querySelector("section.beers");
const customerSection = document.querySelector("section.customers");
const bartenderSection = document.querySelector("section.bartenders");
const bartender1 = document.querySelector(".bartender:nth-of-type(1)");
const bartender2 = document.querySelector(".bartender:nth-of-type(2)");
const bartender3 = document.querySelector(".bartender:nth-of-type(3)");

window.addEventListener("DOMContentLoaded", update);
function update() {
  let data = JSON.parse(FooBar.getData());
  setInterval(update, 3000);
  console.log(data);
  //  console.table(data.bartenders);
  //  console.table(data.serving);
  let beers = data.beertypes;
  let taps = data.taps;

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
    // each beer color
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
  let totalAmount = document.querySelectorAll(".beer").length;
  beerSection.style.gridTemplateColumns = `repeat(${totalAmount}, 1fr)`;

  // check storage of each beer, show on all if there are dulplicates
  beerSection.querySelectorAll(".beer").forEach(checkStorage);
  function checkStorage(b) {
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
  // each tap level
  taps.forEach(updateLevel);
  function updateLevel(t, index) {
    let level = t.level;
    let capacity = t.capacity;
    let containerHeight = beerSection.getBoundingClientRect().height;
    let eachTap = document.querySelector(`.beer:nth-of-type(${index + 1})`);
    let currentLevel = eachTap.getBoundingClientRect().height;

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
  // console.log(
  //   "QUEUE length: " +
  //     customerInQueueCount +
  //     " SERVERING length: " +
  //     customerInServingCount
  // );
  customerSection.style.gridTemplateRows = `repeat(${customerInQueueCount +
    customerInServingCount}, 30px)`;
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
  // grid bartender section
  bartenderSection.style.gridTemplateColumns = `repeat(${totalAmount}, 1fr)`;
  bartenderSection.innerHTML = "";
  // generate bartenders
  let bartenderS = data.bartenders;
  bartenderS.forEach(generateBartender);
  function generateBartender(b, bIndex) {
    let bartender = document.createElement("div");
    bartender.className = "bartender hide";
    bartender.textContent = b.name[0];
    bartenderSection.appendChild(bartender);
    // get each bartenders tap position
    if (b.usingTap) {
      let onTapNr = b.usingTap + 1;
      let servingCustomerNr = b.servingCustomer;
      document
        .querySelector(`.bartender:nth-of-type(${bIndex + 1})`)
        .classList.remove("hide");
      document.querySelector(
        `.bartender:nth-of-type(${bIndex + 1})`
      ).style.gridColumnStart = onTapNr;
      document.querySelector(
        `.bartender:nth-of-type(${bIndex + 1})`
      ).style.gridRowStart = "1";
      console.log(
        b.name +
          " is using tap " +
          onTapNr +
          " serving customer " +
          servingCustomerNr
      );
      let customerPosition = document
        .querySelector("[data-ordernr='" + servingCustomerNr + "']")
        .getBoundingClientRect().top;
      let originalBartenderPosition = document
        .querySelector(`.bartender:nth-of-type(${bIndex + 1})`)
        .getBoundingClientRect().top;
      document.querySelector(
        `.bartender:nth-of-type(${bIndex + 1})`
      ).style.top = `${customerPosition - originalBartenderPosition}px`;
      document.querySelector(
        `.bartender:nth-of-type(${bIndex + 1})`
      ).style.left = "20px"; // temp solution, so that PMJ won't cover up order nr
    }
  }
}
