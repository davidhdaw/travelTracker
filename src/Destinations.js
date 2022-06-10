class Destinations {
  constructor(data) {
    this.destinations = data
  };
  findDestination(destinationID) {
    return this.destinations.find(destination => destination.id === destinationID)
  };
  findTripCost(destinationID, travelersNum, tripLength) {
    const destinationInfo = this.findDestination(destinationID);
    const flightCost = travelersNum * destinationInfo.estimatedFlightCostPerPerson
    const lodgingCost = travelersNum * tripLength * destinationInfo.estimatedLodgingCostPerDay
    return flightCost + lodgingCost 
  }
};

export default Destinations;
