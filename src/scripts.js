import './css/styles.css';
import './images/turing-logo.png'
import { allData } from './api-calls.js';
import Destinations from './Destinations';
import Trips from './Trips';

let totalSpent = document.querySelector('.total-spent')
let recentTrip = document.querySelector('.most-recent-trip')
let filteredTrips = document.querySelector('.filtered-trips')
let heroTrip = document.querySelector('.hero-trip')
let futureTripBtn = document.querySelector('.future-trips')
let pastTripBtn = document.querySelector('.past-trips')
let pendingTripBtn = document.querySelector('.pending-trips')

let travelersData = []
let tripsData = []
let destinationsData = []
let currentUser;

window.addEventListener('load', loadData);
futureTripBtn.addEventListener('click', futureTripLayout);
pastTripBtn.addEventListener('click', pastTripLayout);
pendingTripBtn.addEventListener('click', pendingTripLayout);

function loadData() {
  allData.then(data => {
    travelersData = data[0];
    tripsData = data[1];
    destinationsData = data[2];
    currentUser = selectRandomUser(travelersData);
    totalSpent.innerHTML = `${findYearCost()} dollars spent on trips this year`
    printHeroTrip('last');
    printPastTrips();
  }).catch(error => console.log(error))
};

function selectRandomUser(travelers) {
  const randomIndex = Math.floor(Math.random() * travelers.travelers.length)
  return travelers.travelers[randomIndex]
}

function printHeroTrip(trip) {
  let tripsRepo = new Trips(tripsData);
  let destinationsRepo = new Destinations(destinationsData);
  let thisTrip;
  if (trip === 'last') {
  thisTrip = tripsRepo.findLastTrip(currentUser.id, '2022/06/11')
} else if (trip === 'next') {
  thisTrip = tripsRepo.findNextTrip(currentUser.id, '2022/06/11')
} else if (trip === 'pending') {
  thisTrip = tripsRepo.findPendingTrips(currentUser.id)[0]
}
  if (thisTrip === undefined) {
    heroTrip.innerHTML = `<h1 class='filter-error'>You have no ${trip} trip</h1>`
  } else {
    let thisDestination = destinationsRepo.findDestination(thisTrip.destinationID)

    heroTrip.innerHTML = ``;
    heroTrip.innerHTML += destinationsRepo.makeImg(thisTrip.destinationID);
    heroTrip.innerHTML += `<h2>${thisDestination.destination}</h2>`;
    heroTrip.innerHTML += `<p>${thisTrip.date}</p>`;
    if (thisDestination.travelers === 1) {
      heroTrip.innerHTML += `<p>${thisTrip.travelers} traveler</p>`
    } else {
      heroTrip.innerHTML += `<p>${thisTrip.travelers} travelers</p>`
    };
    if (thisDestination.duration === 1) {
      heroTrip.innerHTML += `<p>for ${thisTrip.duration} day</p>`
    } else {
      heroTrip.innerHTML += `<p>for ${thisTrip.duration} days</p>`
    };
  }
};

function printPastTrips() {
  let tripsRepo = new Trips(tripsData);
  let destinationsRepo = new Destinations(destinationsData);
  let pastTrips = tripsRepo.findPastTrips(currentUser.id, '2022/06/11')
  pastTrips.pop()
  pastTrips.reverse()
  filteredTrips.innerHTML = ``
  pastTrips.forEach(trip => {
    let destination = destinationsRepo.findDestination(trip.destinationID);
    filteredTrips.innerHTML += `<div id="${trip.id}"><h4>${destination.destination}<h4><p>${trip.date}</p></div>`;
  });
};

function printFutureTrips() {
  let tripsRepo = new Trips(tripsData);
  let destinationsRepo = new Destinations(destinationsData);
  let futureTrips = tripsRepo.findFutureTrips(currentUser.id, '2022/06/11');
  futureTrips.shift();
  filteredTrips.innerHTML = ``
  futureTrips.forEach(trip => {
    let destination = destinationsRepo.findDestination(trip.destinationID);
    filteredTrips.innerHTML += `<div id="${trip.id}"><h4>${destination.destination}<h4><p>${trip.date}</p></div>`;
  });
};

function printPendingTrips() {
  let tripsRepo = new Trips(tripsData);
  let destinationsRepo = new Destinations(destinationsData);
  let pendingTrips = tripsRepo.findPendingTrips(currentUser.id);
  pendingTrips.shift();
  filteredTrips.innerHTML = ``
  pendingTrips.forEach(trip => {
    let destination = destinationsRepo.findDestination(trip.destinationID);
    filteredTrips.innerHTML += `<div id="${trip.id}"><h4>${destination.destination}<h4><p>${trip.date}</p></div>`;
  });
};

function findYearCost() {
  let tripsRepo = new Trips(tripsData);
  let destinationsRepo = new Destinations(destinationsData);
  let yearsTrips = tripsRepo.findFutureTrips(currentUser.id, '2021/12/31');
  let spentThisYear = yearsTrips.reduce((acc, trip) => {
    acc += destinationsRepo.findTripCost(trip.destinationID, trip.travelers, trip.duration);
    return acc;
  }, 0)
  return Math.floor(spentThisYear * 1.1)
}

function futureTripLayout() {
  printHeroTrip('next');
  printFutureTrips();
}

function pastTripLayout() {
  printHeroTrip('last');
  printPastTrips();
}

function pendingTripLayout() {
  printHeroTrip('pending');
  printPendingTrips();
}
