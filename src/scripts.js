import './css/styles.css';
import './images/turing-logo.png'
import { allData } from './api-calls.js';
import Destinations from './Destinations';
import Trips from './Trips';

let recentTrip = document.querySelector('.most-recent-trip')

let travelersData = []
let tripsData = []
let destinationsData = []
window.addEventListener('load', loadData);

function loadData() {
  allData.then(data => {
    travelersData = data[0];
    tripsData = data[1];
    destinationsData = data[2];
    console.log(printRecentTrip())
  }).catch(error => console.log(error))
};

function selectRandomUser(travelers) {
  const randomIndex = Math.floor(Math.random() * travelers.travelers.length)
  return travelers.travelers[randomIndex]
}

function printRecentTrip() {

  let randomUser = selectRandomUser(travelersData);
  console.log(randomUser);
  let tripsRepo = new Trips(tripsData);
  let destinationsRepo = new Destinations(destinationsData);
  let lastTrip = tripsRepo.findLastTrip(randomUser.id, '2022/6/11')
  let lastDestination = destinationsRepo.findDestination(lastTrip.destinationID)

  recentTrip.innerHTML = ``;
  recentTrip.innerHTML += destinationsRepo.makeImg(lastTrip.destinationID);
  recentTrip.innerHTML += `<h2>${lastDestination.destination}</h2>`;
  recentTrip.innerHTML += `<p>${lastTrip.date}</p>`;
  if (lastDestination.travelers === 1) {
    recentTrip.innerHTML += `<p>${lastTrip.travelers} traveler</p>`
  } else {
    recentTrip.innerHTML += `<p>${lastTrip.travelers} travelers</p>`
  };
  if (lastDestination.duration === 1) {
    recentTrip.innerHTML += `<p>for ${lastTrip.duration} day</p>`
  } else {
    recentTrip.innerHTML += `<p>for ${lastTrip.duration} days</p>`
  };

  // <img>
  // <h3>Most Recent Trip Location</h3>
  // <p>date</p>
  // <p>travelers</p>
  // <p>trip length</p>

}
