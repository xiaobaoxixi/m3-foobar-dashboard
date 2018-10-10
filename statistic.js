"use strict";

const average = document.querySelector(".average-order p:nth-of-type(2)");

function popularBeer(totalCustomerCount, totalOrder) {
  let totalBeerCount = totalOrder.length;
  // calculate average order size
  let averageOrdersize = totalBeerCount / totalCustomerCount;
  let averageOrdersizeCLeared = Math.floor(averageOrdersize * 1000) / 1000;
  average.innerHTML = `<span class="bold">${averageOrdersizeCLeared}</span> glass/customer`;
  // sort popularity of beers
  let eachBeerCountArray = [];
  beersOntap.forEach(groupByBeerTap);
  function groupByBeerTap(bT, bTi) {
    eachBeerCountArray = eachBeerCountArray.filter(a => a.name !== bT); // don't log duplicate tap
    eachBeerCountArray.push({
      name: bT,
      count: 0
    });
  }
  totalOrder.forEach(fillIn);
  function fillIn(eachOrder) {
    for (let i = 0; i < eachBeerCountArray.length; i++) {
      let beerN = eachBeerCountArray[i].name;
      let currentCount = eachBeerCountArray[i].count;
      if (eachOrder === beerN) {
        eachBeerCountArray[i].count = currentCount + 1;
      }
    }
  }
  console.log(eachBeerCountArray);
}
