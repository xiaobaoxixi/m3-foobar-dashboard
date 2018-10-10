"use strict";

function popularBeer(totalCustomerCount, totalOrder) {
  console.log(totalCustomerCount, totalOrder);
  let totalBeerCount = totalOrder.length;
  let averageOrdersize = totalBeerCount / totalCustomerCount;
  console.log(averageOrdersize);
}
