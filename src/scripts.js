import './css/styles.css';
import './images/turing-logo.png'
import { allData } from './api-calls.js';
import Destinations from './Destinations';
import Trips from './Trips';

let travelersData = []
let tripsData = []
let destinationsData = []
window.addEventListener('load', loadData);

function loadData() {
  allData.then(data => {
    travelersData = data[0];

    tripsData = data[1];
    destinationsData = data[2];
    console.log(printTripInfoToPage())
  }).catch(error => console.log(error))
};

function selectRandomUser(travelers) {
  const randomIndex = Math.floor(Math.random() * travelers.travelers.length)
  return travelers.travelers[randomIndex]
}

function printTripInfoToPage() {

  let randomUser = selectRandomUser(travelersData);
  console.log(randomUser);
  let tripsRepo = new Trips(tripsData);
  return tripsRepo.findUserTrips(randomUser.id)
}
