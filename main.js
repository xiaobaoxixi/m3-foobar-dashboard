"use strict";

const beerSection = document.querySelector("section.beers");

window.addEventListener("DOMContentLoaded", update);
setInterval(update, 1000);
function update() {
  let data = JSON.parse(FooBar.getData());
  console.log(data);
  let beers = data.beertypes;
  let taps = data.taps;

  // build bar overview based on which beers are on tap, plus the ones that are left
  // it's possible that the same beer is on more than 1 tap, so total amount of kegs is not always 10, rather the 7 taps plus the number of beers that are left
  // build element of the 7 taps, regardless if there is any duplication

  // reset beer section before append new child
  beerSection.innerHTML = "";
  taps.forEach(buildTap);
  function buildTap(t) {
    let eachTap = document.createElement("div");
    eachTap.className = "beer";
    eachTap.setAttribute("data-beername", t.beer);
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
  let levelS = [];
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

  // each beer
}
