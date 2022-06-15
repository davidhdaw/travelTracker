//imports
import './css/styles.css'
import './images/turing-logo.png'
import {
  getUser,
  allData,
  postUserCall,
  checkForError
} from './api-calls.js'
import Destinations from './Destinations'
import Trips from './Trips'
const dayjs = require('dayjs')
let RelativeTime = require('dayjs/plugin/RelativeTime')
dayjs.extend(RelativeTime)

//selectors
let blockBackgroundLogin = document.querySelector('.block-background-login')
let loginForm = document.querySelector('.login-form')
let userName = document.querySelector('#userName')
let password = document.querySelector('#password')
let loginError = document.querySelector('.login-error')
let passwordError = document.querySelector('.password-error')
let userNameError = document.querySelector('.userName-error')
let nav = document.querySelector('nav')
let totalSpent = document.querySelector('.total-spent')
let tripsType = document.querySelector('.trips-type')
let vacationCountdown = document.querySelector('.vacation-countdown')
let heroTrip = document.querySelector('.hero-trip')
let filteredTrips = document.querySelector('.filtered-trips')
let tripForm = document.querySelector('.new-trip-form')
let blockBackground = document.querySelector('.block-background')
let destinationSelector = document.querySelector('#destination')
let calendarData = document.querySelector('#calendarData')
let calendarEndData = document.querySelector('#calendarEndData')
let numTravelers = document.querySelector('#numTravelers')
let userInfo = document.querySelector('.user-info')
let errorMessage = document.querySelector('.error-handling')
let dateErrorMessage = document.querySelector('.date-error-handling')

//button selectors
let cancelBtn = document.querySelector('.cancel-button')
let futureTripBtn = document.querySelector('.future-trips')
let pastTripBtn = document.querySelector('.past-trips')
let pendingTripBtn = document.querySelector('.pending-trips')
let planTripBtn = document.querySelector('.trip-planner')
let submitVacationBtn = document.querySelector('#submitVacation')
let submitLoginBtn = document.querySelector('#submitLogin')

//global variables
let travelersData = []
let tripsData = []
let destinationsData = []
let currentUser

//event listeners
window.addEventListener('load', loadData)
futureTripBtn.addEventListener('click', futureTripLayout)
pastTripBtn.addEventListener('click', pastTripLayout)
pendingTripBtn.addEventListener('click', pendingTripLayout)
cancelBtn.addEventListener('click', toggleVacationForm)
cancelBtn.addEventListener('keydown', shiftTabFocus)
planTripBtn.addEventListener('click', toggleVacationForm)
submitLoginBtn.addEventListener('click', loginCheck)
submitVacationBtn.addEventListener('click', submitVacationForm)
submitVacationBtn.addEventListener('keydown', tabFocus)

//fetch/post functions
function loadData() {
  allData.then(data => {
    travelersData = data[0]
    tripsData = data[1]
    destinationsData = data[2]
    populateSelector()
  }).catch(error => console.log(error))
}

function loginCheck() {
    event.preventDefault()
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
      currentUser = data
      totalSpent.innerHTML = `${findYearCost()} dollars spent on trips this year`
      userInfo.innerText = `Welcome, ${currentUser.name}`
      pastTripLayout()
      nav.classList.remove('hidden')
      toggleLoginForm()
    }).catch(error => {
      console.log(error)
      userNameError.classList.remove('hidden')
    })
  }
}

function submitVacationForm() {
  event.preventDefault()
  if(calendarData.value === '' || numTravelers.value === '' || calendarEndData.value === '' || destination.value === '') {
    errorMessage.classList.remove('hidden')
    return console.log('user did not complete all fields')
  }
  let tripDuration = dayjs(calendarEndData.value).diff(dayjs(calendarData.value), 'days')
  console.log(tripDuration)
  console.log(dateErrorMessage)
  if (tripDuration < 0) {
    dateErrorMessage.classList.remove('hidden')
    return console.log('trip duration invalid')
  }
  let tripObj = {id: Date.now(), userID: currentUser.id, destinationID: parseInt(destination.value), travelers: parseInt(numTravelers.value), date: reformatDate(calendarData.value), duration: (tripDuration), status: 'pending', suggestedActivities:[]}
  console.log(tripObj)
  postUserCall(tripObj, 'trips').then(response => reloadToPending())
}

function reloadToPending() {
  allData.then(data => {
    travelersData = data[0]
    tripsData = data[1]
    destinationsData = data[2]
    totalSpent.innerHTML = `${findYearCost()} dollars spent on trips this year`
    toggleVacationForm()
    pendingTripLayout()
  }).catch(error => console.log(error))
}

//DOM functions
function printVacationCountdown(type) {
  let tripsRepo = new Trips(tripsData)
  let destinationsRepo = new Destinations(destinationsData)
  if (type ==='Past') {
    let thisTrip = tripsRepo.findLastTrip(currentUser.id, dayjs().format('YYYY/MM/DD'))
    vacationCountdown.innerHTML = `<h2>Your Last Vacation Was</h2>
    <p class="vacation-timer">${dayjs().diff(thisTrip.date, 'day')}</p>
    <h2>days ago</h2>
    <h2>Wouldn't you like to plan another?</h2>`
  } else if (type ==='Future') {
    let thisTrip = tripsRepo.findNextTrip(currentUser.id, dayjs().format('YYYY/MM/DD'))
    if (thisTrip === undefined) {
      vacationCountdown.innerHTML = `<h2>No upcoming vacations.</h2><h2>Plan a new one to get away for a while.</h2>`
    } else {
      vacationCountdown.innerHTML = `<h2>Your Next Vacation Starts in</h2>
      <p class="vacation-timer">${dayjs(thisTrip.date).diff(dayjs(), 'day')}</p>
      <h2>days</h2>
      <h2>Get Excited!</h2>`
    }
  } else if (type === 'Pending') {
    vacationCountdown.innerHTML = `<h2>We'll approve your new vacation(s) soon!</h2>`
  }
}

function printHeroTrip(trip) {
  let tripsRepo = new Trips(tripsData)
  let destinationsRepo = new Destinations(destinationsData)
  let thisTrip
  if (trip === 'Past') {
  thisTrip = tripsRepo.findLastTrip(currentUser.id, dayjs().format('YYYY/MM/DD'))
} else if (trip === 'Future') {
  thisTrip = tripsRepo.findNextTrip(currentUser.id, dayjs().format('YYYY/MM/DD'))
} else if (trip === 'Pending') {
  thisTrip = tripsRepo.findPendingTrips(currentUser.id).sort((a,b) => b.id - a.id)[0]
}
  if (thisTrip === undefined) {
    heroTrip.innerHTML = `<h1 class='filter-error'>You have no ${trip} trip</h1>`
  } else {
    let thisDestination = destinationsRepo.findDestination(thisTrip.destinationID)

    heroTrip.innerHTML = ``
    heroTrip.innerHTML += destinationsRepo.makeImg(thisTrip.destinationID)
    heroTrip.innerHTML += `<h2>${thisDestination.destination}</h2>`
    heroTrip.innerHTML += `<p>${thisTrip.date}</p>`
    if (thisDestination.travelers === 1) {
      heroTrip.innerHTML += `<p>${thisTrip.travelers} traveler</p>`
    } else {
      heroTrip.innerHTML += `<p>${thisTrip.travelers} travelers</p>`
    }
    if (thisDestination.duration === 1) {
      heroTrip.innerHTML += `<p>for ${thisTrip.duration} day</p>`
    } else {
      heroTrip.innerHTML += `<p>for ${thisTrip.duration} days</p>`
    }
    if (trip === 'Pending') {
      heroTrip.innerHTML += `<p>Trip Status: Pending</p><h2>total cost: ${Math.floor(destinationsRepo.findTripCost(thisTrip.destinationID, thisTrip.travelers, thisTrip.duration)* 1.1)}</h2>`
    }
  }
}

function printMiniTrip(trip) {
  let destinationsRepo = new Destinations(destinationsData)
  let destination = destinationsRepo.findDestination(trip.destinationID)
  let dayOrDays
  let guestOrGuests
  if (trip.duration === 1) {
    dayOrDays = 'day'
  } else {
    dayOrDays = 'days'
  }
  if (trip.travelers === 1) {
    guestOrGuests = 'guest'
  } else {
    guestOrGuests = 'guests'
  }
  filteredTrips.innerHTML += `<div id="trip-${trip.id}"><h3>${destination.destination}<h3><p>${trip.date} | ${trip.duration} ${dayOrDays} | ${trip.travelers} ${guestOrGuests}</p></div>`
}

function printMiniTrips(tripType) {
  let tripsRepo = new Trips(tripsData)
  let destinationsRepo = new Destinations(destinationsData)
  let trips
  if (tripType === 'Past') {
    trips = tripsRepo.findPastTrips(currentUser.id, dayjs().format('YYYY/MM/DD'))
    trips.pop()
    trips.reverse()
  } else if (tripType === 'Future') {
    trips = tripsRepo.findFutureTrips(currentUser.id, dayjs().format('YYYY/MM/DD'))
    trips.shift()
  } else if (tripType === 'Pending') {
    trips = tripsRepo.findPendingTrips(currentUser.id).sort((a,b) => b.id - a.id)
    pendingTrips.shift()
  }
  filteredTrips.innerHTML = ``
  trips.forEach(trip => printMiniTrip(trip))
}

function futureTripLayout() {
  tripsType.innerText = 'Future Trips'
  printVacationCountdown('Future')
  printHeroTrip('Future')
  printMiniTrips('Future')
}

function pastTripLayout() {
  tripsType.innerText = 'Past Trips'
  printVacationCountdown('Past')
  printHeroTrip('Past')
  printMiniTrips('Past')
}

function pendingTripLayout() {
  tripsType.innerText = 'Pending Trips'
  printVacationCountdown('Pending')
  printHeroTrip('Pending')
  printMiniTrips('Pending')
}

//helper functions
function tabFocus(e) {
  if (e.key === 'Tab' || e.keyCode === KEYCODE_TAB) {
    cancelBtn.focus()
    e.preventDefault()
  }
}
function shiftTabFocus(e) {
  if ((e.key === 'Tab' || e.keyCode === KEYCODE_TAB) && e.shiftKey) {
    submitVacationBtn.focus()
    e.preventDefault()
  }
}

function findYearCost() {
  let tripsRepo = new Trips(tripsData)
  let destinationsRepo = new Destinations(destinationsData)
  let yearsTrips = tripsRepo.findFutureTrips(currentUser.id, '2021/12/31')
  let spentThisYear = yearsTrips.reduce((acc, trip) => {
    acc += destinationsRepo.findTripCost(trip.destinationID, trip.travelers, trip.duration)
    return acc
  }, 0)
  return Math.floor(spentThisYear * 1.1)
}

function populateSelector() {
  let destinationsRepo = new Destinations(destinationsData)
  destinationSelector.innerHTML = ''
  destinationsRepo.destinations.forEach(destination => {
    destinationSelector.innerHTML += `<option value='${destination.id}'>${destination.destination}</option>`
  })
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
