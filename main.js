"use strict";

const beerSection = document.querySelector("section.beers");
window.addEventListener("DOMContentLoaded", update);
setInterval(update, 100000);
function update() {
  let data = JSON.parse(FooBar.getData());
  console.log(data);
  let beers = data.beertypes;
  let taps = data.taps;
  console.log(beers, taps);

  // build bar overview based on which beers are on tap, plus the ones that are left
  // it's possible that the same beer is on more than 1 tap, so total amount of kegs is not always 10, rather the 7 taps plus the number of beers that are left
  // build element of the 7 taps, regardless if there is any duplication
  taps.forEach(buildTap);
  function buildTap(t) {
    let eachTap = document.createElement("div");
    eachTap.className = "beer";
    eachTap.setAttribute("data-beername", t.beer);
    beerSection.appendChild(eachTap);
  }
  // find and build element of beers that are NOT on keg
  let beersOnKeg = [];
  taps.forEach(t => beersOnKeg.push(t.beer));
  console.log(beersOnKeg);
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

  // each tap level

  // keg warning when need changing

  // change keg animation? head of bartender of keg?

  // each beer pouring animation

  // each beer color

  // each beer
}
