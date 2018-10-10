"use strict";

const beerSection = document.querySelector("section.beers");
const nozzleSection = document.querySelector("section.nozzles");
const labelSection = document.querySelector("section.labels");
const glassSection = document.querySelector("section.glasses");
const customerSection = document.querySelector("section.customers");
const bartenderSection = document.querySelector("section.bartenders");
const imgKegs = document.querySelector(".imgKegs");
const imgKegsOfftap = document.querySelector(".imgKegs-offtap");
const tags = document.querySelector(".tags");
const categories = document.querySelector(".categories");
let beerCategoris = [];
let taps;
let beers;
let beerData = [];
let beersOntap = [];
let totalAmount;
let bartenderS;
let orderList = [];
let allSell = [];
window.addEventListener("DOMContentLoaded", init);
function init() {
  let data = JSON.parse(FooBar.getData());
  console.log(data);
  beers = data.beertypes;
  beers.forEach(getCategory);
  function getCategory(b) {
    if (beerCategoris.indexOf(b.category) < 0) {
      beerCategoris.push(b.category);
    }
  }
  beerCategoris.forEach(addTag);
  function addTag(bC) {
    let cate = document.createElement("li");
    cate.textContent = bC;
    categories.appendChild(cate);
  }
  const cateS = document.querySelectorAll(".categories li");
  cateS.forEach(c => {
    c.addEventListener("click", function(m) {
      let cate = m.target.textContent;
      console.log(cate);
      if (document.querySelector(`[data-cate='${cate}']`)) {
        document.querySelectorAll(`[data-cate='${cate}']`).forEach(a => {
          a.classList.add("found");
          setTimeout(function() {
            a.classList.remove("found");
          }, 300);
        });
        m.target.style.textDecoration = "underline";
      } else {
        m.target.style.color = "lightgrey";
      }
    });
  });

  taps = data.taps;
  fetch("beerinfo.json")
    .then(data => data.json())
    .then(jsonData => {
      beerData = jsonData;
      buildStructure(data);
    });
}
function buildStructure(data) {
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
    let beerHeading = document.createElement("h1");
    beerHeading.textContent = t.beer;
    eachTap.appendChild(beerHeading);
    // build glass section
    let eachGlass = document.createElement("div");
    glassSection.appendChild(eachGlass);
    // build nozzle section
    let eachNozzle = document.createElement("div");
    nozzleSection.appendChild(eachNozzle);
    // build label section
    let eachLabel = document.createElement("div");
    labelSection.appendChild(eachLabel);
    beers.forEach((b, i) => {
      if (b.name === t.beer) {
        document.querySelector(
          `.labels>div:nth-of-type(${index + 1})`
        ).style.backgroundImage = `url('images/${beers[i].label}')`;
      }
    });
    beerData.forEach(findMatch); // the beer color and glass type come from local JSON, not online
    function findMatch(b, bi) {
      if (t.beer === b.name) {
        eachTap.setAttribute("data-cate", b.category);
        // get matching color of each beer
        eachTap.style.backgroundColor = `${b.appearancetwo}`;
        // get matching glass of each beer based on category
        glassSection.querySelector(
          `div:nth-of-type(${index + 1})`
        ).style.backgroundImage = `url('img/${b.glassImage}')`;
      }
    }
    beerSection.appendChild(eachTap);
  }
  // find and build element of beers that are NOT on keg
  taps.forEach(t => beersOntap.push(t.beer));
  for (let i = 0; i < beers.length; i++) {
    let beerName = beers[i].name;
    if (beersOntap.indexOf(beerName) < 0) {
      let eachNotOnTap = document.createElement("div");
      eachNotOnTap.className = "beer not-on-tap";
      eachNotOnTap.setAttribute("data-beername", beerName);
      let beerHeading = document.createElement("h1");
      beerHeading.textContent = beerName;
      eachNotOnTap.appendChild(beerHeading);
      beerSection.appendChild(eachNotOnTap);
    }
  }
  // put the 2 types of beers above together and define dynamic grid
  totalAmount = document.querySelectorAll(".beer").length;
  beerSection.style.gridTemplateColumns = `repeat(${totalAmount}, 1fr)`;
  glassSection.style.gridTemplateColumns = `repeat(${totalAmount}, 1fr)`;
  labelSection.style.gridTemplateColumns = `repeat(${totalAmount}, 1fr)`;
  nozzleSection.style.gridTemplateColumns = `repeat(${totalAmount}, 1fr)`;
  imgKegs.style.width = ((window.innerWidth - 100) * 7) / totalAmount + "px"; // 100(px) is the padding on the sides
  imgKegsOfftap.style.width =
    (((window.innerWidth - 100) * 7) / totalAmount / 7) * 9 + "px"; // offtap image has 9 kegs while imgKegs has 7
  imgKegsOfftap.style.left =
    ((window.innerWidth - 100) * 7) / totalAmount + 50 + "px";
  beerSection.style.height =
    (((window.innerWidth - 100) * 7) / totalAmount / 1440) * 463 + "px";
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
    //  b.innerHTML = "";
    let beerName = b.dataset.beername;
    data.storage.forEach(checkMatch);
    function checkMatch(s) {
      if (s.name === beerName) {
        b.setAttribute("data-storage", s.amount);
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
    // beer heading font size based on available height
    eachTap.querySelector("h1").style.fontSize = targetHeight * 0.11 + "px";
    // keg warning when need changing
    if (
      level / capacity < 0.1 &&
      Number(eachTap.getAttribute("data-storage")) > 0
    ) {
      eachTap.classList.add("change-keg");
      // change keg animation? head of bartender of keg?
    } else if (
      level / capacity < 0.1 &&
      Number(eachTap.getAttribute("data-storage")) === 0
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
      // orders from customer in queue decide which beer is popular
      // prevent duplicated input of the same id's order (at every refresh, queue data will overlap the previous result of queue)
      orderList = orderList.filter(o => o.id !== data.queue[qIndex].id);
      let ordersString = eachCustomerOrderS.join();
      orderList.push({
        id: data.queue[qIndex].id,
        order: ordersString
      });
    });
    //    console.log(orderList);
    allSell = [];
    orderList.forEach(oL => allSell.push(oL.order));
    let totalOrder = allSell.join().split(",");
    let totalCustomerCount = allSell.length;
    popularBeer(totalCustomerCount, totalOrder);
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
      //      console.log(b.name + "on tap nr: " + b.usingTap);
      // put bartender on the row of of the customer he's serving
      let customerPosition = document
        .querySelector("[data-ordernr='" + b.servingCustomer + "']")
        .getBoundingClientRect().top;
      let originalBartenderPosition = document
        .querySelector(`[data-name='${bartenderName}']`)
        .getBoundingClientRect().top;
      document.querySelector(
        `[data-name='${bartenderName}']`
      ).style.top = `${customerPosition - originalBartenderPosition}px`;
      document.querySelector(`[data-name='${bartenderName}']`).style.left =
        "70px";
    } else if (b.statusDetail === "releaseTap") {
      document
        .querySelector(`[data-name='${bartenderName}']`)
        .classList.add("hide");

      let finishedBeer = document.querySelector(
        `[data-ordernr='${b.servingCustomer}'] p:nth-of-type(${
          document.querySelector(`[data-name='${bartenderName}']`).style
            .gridColumnStart
        })`
      );
      let currentOrderCount = finishedBeer.textContent;
      finishedBeer.textContent = currentOrderCount - 1;
      if (currentOrderCount === 1) {
        finishedBeer.classList.add("hide");
      }
      // console.log(
      //   b.name +
      //     "is" +
      //     document.querySelector(`[data-name='${bartenderName}']`).style
      //       .gridColumnStart +
      //     " cN " +
      //     b.servingCustomer
      // );
    } else if (!b.usingTap) {
    }
  }
  setTimeout(update, 1000);
}
