class Trips {
  constructor(tripsData) {
    this.trips = tripsData;
  };

  findUserTrips(userID) {
    return this.trips.filter(trip => trip.userID === userID);
  };

  findNextTrip(userID, date) {
    let tripsWithToday = this.findUserTrips(userID)
    tripsWithToday.push({"id":0,"userID":0,"destinationID":0,"travelers":0,"date":date,"duration":0})
    let orderedTrips = tripsWithToday.sort((a,b) => a.date > b.date ? 1 : -1);
    const dateIndex = orderedTrips.findIndex(trip => trip.date === date)
    return orderedTrips[dateIndex+1];
  };

    findLastTrip(userID, date) {
      let tripsWithToday = this.findUserTrips(userID)
      tripsWithToday.push({"id":0,"userID":0,"destinationID":0,"travelers":0,"date":date,"duration":0})
      let orderedTrips = tripsWithToday.sort((a,b) => a.date > b.date ? 1 : -1);
      const dateIndex = orderedTrips.findIndex(trip => trip.date === date)
      return orderedTrips[dateIndex-1];
    };
};

export default Trips;
