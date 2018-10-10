"use strict";

const average = document.querySelector(".average-order p:nth-of-type(2)");

function popularBeer(totalCustomerCount, totalOrder) {
  console.log(totalCustomerCount, totalOrder);
  let totalBeerCount = totalOrder.length;
  let averageOrdersize = totalBeerCount / totalCustomerCount;
  let averageOrdersizeCLeared = Math.floor(averageOrdersize * 1000) / 1000;
  console.log(averageOrdersize);
  average.innerHTML = `<span class="bold">${averageOrdersizeCLeared}</span> glass/customer`;
}
