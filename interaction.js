"use strict";
/*
const popular = document.querySelector(".popular");
popular.addEventListener("click", getPopular);
function getPopular() {
  console.log("tagClicked");
}
*/

// open and close statistic panel
const closeX = document.querySelector("p.close");
const statisticPanel = document.querySelector("#statistic");

closeX.addEventListener("click", toggleStatistic);
function toggleStatistic() {
  statisticPanel.classList.toggle("close");
  if (statisticPanel.className.indexOf("close") > -1) {
    closeX.textContent = "+";
  } else {
    closeX.textContent = "x";
  }
}
