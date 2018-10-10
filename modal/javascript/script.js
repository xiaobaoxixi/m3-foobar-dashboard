"use strict";

let data = JSON.parse(FooBar.getData());

let beerData;
fetch("javascript/beerInfo.json")
  .then(e => e.json())
  .then(function(json) {
    beerData = json;
  });

let hops = document.querySelector(".hops");
let malt = document.querySelector(".malts");
let ester = document.querySelector(".ester");
let timeline = document.querySelector(".timeline");
let mouthfeel = document.querySelector(".mouthfeel");
let mainBeerDiv = document.querySelector(".mainBeerDiv");
let beerTypesdiv = document.querySelector(".allBeers");
let beerImg = document.querySelector(".img");
let beerDescription = document.querySelector(".beerText");
let similarDiv = document.querySelector(".similar");
let currentBeer;
let similarTitle = document.querySelector(".similarTitle");
let beerTitle = document.querySelector(".beerTitle");

function showBeers(singleBeer) {
  console.log("singlebeer is", singleBeer);
  for (let i = 0; i < beerData.length; i++) {
    if (currentBeer.name == beerTypes[i].name) {
      buildBeer(beerData[i]);
      buildBars(hops, beerData[i].hoplevel);
      buildBars(malt, beerData[i].maltlevel);
      buildBars(ester, beerData[i].esterlevel);
      buildBars(mouthfeel, beerData[i].mouthfeel);
      buildTimeline(i);
    }
  }
}

//createing div with all beers
let beerTypes = Array.from(data.beertypes);
console.log(Array.isArray(beerTypes));
for (let i = 0; i < beerTypes.length; i++) {
  beerTypes[i].id = Math.floor(Math.random() * (9999999 - 1000000) + 1000000);
  console.log("id:", beerTypes[i].id);
  let eachBeer = document.createElement("div");
  eachBeer.id = "" + beerTypes[i].id;
  let img = document.createElement("img");
  img.setAttribute("src", "imgs/beerLogos/" + beerTypes[i].label);
  img.classList.add("imgB");
  eachBeer.appendChild(img);
  beerTypesdiv.appendChild(eachBeer);

  eachBeer.addEventListener("click", () => {
    showDetails(beerTypes[i].id);
  });
}

//function to eventlistener, shows details about beer
function showDetails(id) {
  console.log("showDetailes called:", id);

  similarDiv.innerHTML = " ";
  id = Number(id);

  for (let i = 0; i < beerTypes.length; i++) {
    if (beerTypes[i].id === id) {
      currentBeer = beerTypes[i];
    }
  }
  beerTitle.textContent = currentBeer.name;
  beerDescription.textContent = currentBeer.description.overallImpression;
  beerImg.setAttribute("src", "imgs/beerLogos/" + currentBeer.label);

  console.log("currentBeer:", currentBeer);
  for (let i = 0; i < beerTypes.length; i++) {
    //shows similar beers
    if (
      currentBeer.category === beerTypes[i].category &&
      currentBeer.id !== beerTypes[i].id
    ) {
      console.log("beer has a similar one", beerTypes[i].category);
      similarTitle.innerHTML = "Similar beers";
      let similarBeer = document.createElement("div");
      let similarImg = document.createElement("img");
      similarBeer.id = " " + beerTypes[i].id;
      console.log("similar beer id:", similarBeer.id);
      similarImg.classList.add("imgB");
      similarImg.setAttribute("src", "imgs/beerLogos/" + beerTypes[i].label);
      similarBeer.appendChild(similarImg);
      similarDiv.appendChild(similarBeer);
      similarImg.addEventListener("click", () => {
        showDetails(similarBeer.id);
        // console.log(similarBeer.id, currentBeer);
        showBeers(currentBeer);
      });
    } else {
      similarTitle.innerHTML = " ";
    }
  }
  showBeers(currentBeer);
}
function buildBeer(b) {
  //   console.log(beerData[i].name);
  document.querySelector(".glass").setAttribute("src", "img/" + b.glassImage);
  document.querySelector(".foam").setAttribute("src", "img/" + b.headImage);
  if (b.specialTreatment) {
    document.querySelector(".foam").style.top = "5vh";
    document.querySelector(".foam").style.left = "21vw";
    document.querySelector(".foam").style.width = "4vw";
  } else {
    document.querySelector(".foam").style.top = "5vh";
    document.querySelector(".foam").style.left = "20vw";
    document.querySelector(".foam").style.width = "6vw";
  }
  if (b.carbonation[0] >= 1) {
    for (let i = 0; i < b.carbonation[0]; i++) {
      makeCarbonation(i);
    }
  }
}
function makeCarbonation(i) {
  let carbonationImg = document.createElement("img");
  carbonationImg.setAttribute("src", "img/carbonation.png");
  carbonationImg.classList.add("carbonation");
  carbonationImg.style.top = 1 + i + 3 + "vh";
  //   carbonationImg.style.left = 19 + i + "vw";
  mainBeerDiv.appendChild(carbonationImg);
}

function buildBars(bar, level) {
  bar.classList.remove("hidden");
  bar.previousElementSibling.classList.remove("hidden");
  for (let i = 0; i < bar.children.length; i++) {
    bar.children[i].style.backgroundColor = "inherit";
  }
  if (level) {
    if (level.length > 1) {
      bar.children[level[0] - 1].style.backgroundColor = "black";
      bar.children[level[1] - 1].style.backgroundColor = "black";
      for (let i = level[0]; i < level[1]; i++) {
        bar.children[[i] - 1].style.backgroundColor = "black";
      }
    } else {
      bar.children[level].style.backgroundColor = "black";
    }
  } else {
    bar.previousElementSibling.classList.add("hidden");
    bar.classList.add("hidden");
  }
}

function buildTimeline(b) {
  timeline.classList.remove("hidden");
  timeline.previousElementSibling.classList.remove("hidden");
  if (b.timeline) {
    timeline.children[0].textContent = b.timeline[0];
    timeline.children[4].textContent = b.timeline[1];
  } else {
    timeline.classList.add("hidden");
    timeline.previousElementSibling.classList.add("hidden");
  }
}
