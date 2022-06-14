import './css/styles.css';
import './images/turing-logo.png';
import {
  getUser,
  allData,
  postUserCall,
  checkForError
} from './api-calls.js';
import Destinations from './Destinations';
import Trips from './Trips';

let totalSpent = document.querySelector('.total-spent')
let recentTrip = document.querySelector('.most-recent-trip')
let filteredTrips = document.querySelector('.filtered-trips')
let heroTrip = document.querySelector('.hero-trip')
let tripForm = document.querySelector('.new-trip-form')
let blockBackground = document.querySelector('.block-background')
let destinationSelector = document.querySelector('#destination')
let calendarData = document.querySelector('#calendarData')
let numTravelers = document.querySelector('#numTravelers')
let tripLength = document.querySelector('#tripLength')
let destinationSelection = document.querySelector('#destination')
let userName = document.querySelector('#userName')
let password = document.querySelector('#password')
let loginError = document.querySelector('.login-error')
let passwordError = document.querySelector('.password-error')
let userNameError = document.querySelector('.userName-error')
let blockBackgroundLogin = document.querySelector('.block-background-login')
let loginForm = document.querySelector('.login-form')

let cancelBtn = document.querySelector('.cancel-button')
let futureTripBtn = document.querySelector('.future-trips')
let pastTripBtn = document.querySelector('.past-trips')
let pendingTripBtn = document.querySelector('.pending-trips')
let planTripBtn = document.querySelector('.trip-planner')
let errorMessage = document.querySelector('.error-handling')
let submitVacationBtn = document.querySelector('#submitVacation')
let submitLoginBtn = document.querySelector('#submitLogin')

let travelersData = []
let tripsData = []
let destinationsData = []
let currentUser;

window.addEventListener('load', loadData);
futureTripBtn.addEventListener('click', futureTripLayout);
pastTripBtn.addEventListener('click', pastTripLayout);
pendingTripBtn.addEventListener('click', pendingTripLayout);
cancelBtn.addEventListener('click', toggleVacationForm);
cancelBtn.addEventListener('keydown', shiftTabFocus);
planTripBtn.addEventListener('click', toggleVacationForm);
submitLoginBtn.addEventListener('click', loginCheck);
submitVacationBtn.addEventListener('click', submitVacationForm);
submitVacationBtn.addEventListener('keydown', tabFocus);

function tabFocus(e) {
  if (e.key === 'Tab' || e.keyCode === KEYCODE_TAB) {
    cancelBtn.focus()
    e.preventDefault();
  }
};

function shiftTabFocus(e) {
  if ((e.key === 'Tab' || e.keyCode === KEYCODE_TAB) && e.shiftKey) {
    submitVacationBtn.focus()
    e.preventDefault();
  }
};


function loadData() {
  allData.then(data => {
    travelersData = data[0];
    tripsData = data[1];
    destinationsData = data[2];
    populateSelector();
  }).catch(error => console.log(error))
};

function reloadToPending() {
  allData.then(data => {
    travelersData = data[0];
    tripsData = data[1];
    destinationsData = data[2];
    totalSpent.innerHTML = `${findYearCost()} dollars spent on trips this year`;
    toggleVacationForm();
    pendingTripLayout();
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
    console.log('huh?')
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
    filteredTrips.innerHTML += `<div id="${trip.id}"><h3>${destination.destination}<h3><p>${trip.date}</p></div>`;
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
    filteredTrips.innerHTML += `<div id="${trip.id}"><h3>${destination.destination}<h3><p>${trip.date}</p></div>`;
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

function populateSelector() {
  let destinationsRepo = new Destinations(destinationsData);
  destinationSelector.innerHTML = ''
  destinationsRepo.destinations.forEach(destination => {
    destinationSelector.innerHTML += `<option value='${destination.id}'>${destination.destination}</option>`
  })
};

function loginCheck() {
    event.preventDefault();
    loginError.classList.add('hidden')
    passwordError.classList.add('hidden')
    userNameError.classList.add('hidden')
    let userNameValue = userName.value
    let userID = userNameValue.split('traveler')
  if (userName.value === '' || password.value === '') {
    loginError.classList.remove('hidden')
  } else if (password.value !== 'travel') {
    passwordError.classList.remove('hidden')
  } else {
    getUser(userID[1]).then(data => {
      currentUser = data;
      totalSpent.innerHTML = `${findYearCost()} dollars spent on trips this year`
      printHeroTrip('last');
      printPastTrips();
      toggleLoginForm();
    }).catch(error => {
      console.log(error)
      userNameError.classList.remove('hidden')
    })
  }
}

function submitVacationForm() {
  event.preventDefault()
  if(calendarData.value === '' || numTravelers.value === '' || tripLength.value === '' || destination.value === '') {
    errorMessage.classList.remove('hidden')
  }
  let tripObj = {id: Date.now(), userID: currentUser.id, destinationID: parseInt(destination.value), travelers: parseInt(numTravelers.value), date: reformatDate(calendarData.value), duration: parseInt(tripLength.value), status: 'pending', suggestedActivities:[]}
  console.log(tripObj)
  postUserCall(tripObj, 'trips').then(response => reloadToPending())
}

function futureTripLayout() {
  printHeroTrip('next')
  printFutureTrips()
}

function pastTripLayout() {
  printHeroTrip('last')
  printPastTrips()
}

function pendingTripLayout() {
  printHeroTrip('pending')
  printPendingTrips()
}

function toggleVacationForm() {
  tripForm.classList.toggle('hidden')
  blockBackground.classList.toggle('hidden')
}

function toggleLoginForm() {
  loginForm.classList.toggle('hidden')
  blockBackgroundLogin.classList.toggle('hidden')
}

function reformatDate(date) {
  return date.split('-').join('/')
}
