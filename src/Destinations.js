class Destinations {
  constructor(data) {
    this.destinations = data.destinations
  }

  findDestination(destinationID) {
    return this.destinations.find(destination => destination.id === destinationID)
  }

  findTripCost(destinationID, travelersNum, tripLength) {
    const destinationInfo = this.findDestination(destinationID)
    const flightCost = travelersNum * destinationInfo.estimatedFlightCostPerPerson
    const lodgingCost = travelersNum * tripLength * destinationInfo.estimatedLodgingCostPerDay
    return flightCost + lodgingCost
  }

  makeImg(destinationID) {
    let desiredDestination = this.findDestination(destinationID)
    return `<img src="${desiredDestination.image}" alt="${desiredDestination.alt}">`
  }
}

export default Destinations
