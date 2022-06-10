import { expect } from 'chai';
import { tripsData } from './test-data.js';
import Trips from '../src/Trips.js';

describe('Trips', () => {
  let tripsRepo = [];
  beforeEach( () => {
    tripsRepo = new Trips(tripsData);
  });

  it('should be a function', function () {
    expect(Trips).to.be.a('function');
  });

  it('should be an instance of Trips', function () {
    expect(tripsRepo).to.be.an.instanceof(Trips);
  });

  it('Should be able to find all vacations for a given user.', function () {
    expect(tripsRepo.findUserTrips(44)).to.deep.equal([{"id":181,"userID":44,"destinationID":23,"travelers":4,"date":"2019/11/29","duration":7,"status":"approved","suggestedActivities":[]},{"id":183,"userID":44,"destinationID":10,"travelers":4,"date":"2020/07/22","duration":5,"status":"approved","suggestedActivities":[]},{"id":187,"userID":44,"destinationID":11,"travelers":3,"date":"2022/11/12","duration":18,"status":"approved","suggestedActivities":[]}]);
  });

  it('Should be able to find the next trip for a given user from a date', function () {
    expect(tripsRepo.findNextTrip(44, "2022/06/10")).to.deep.equal({"id":187,"userID":44,"destinationID":11,"travelers":3,"date":"2022/11/12","duration":18,"status":"approved","suggestedActivities":[]});
    expect(tripsRepo.findNextTrip(44, "2020/01/21")).to.deep.equal({"id":183,"userID":44,"destinationID":10,"travelers":4,"date":"2020/07/22","duration":5,"status":"approved","suggestedActivities":[]});
  });

  it('Should be able to find the most recent trip for a given user from a date', function () {
    expect(tripsRepo.findLastTrip(44, "2022/06/10")).to.deep.equal({"id":183,"userID":44,"destinationID":10,"travelers":4,"date":"2020/07/22","duration":5,"status":"approved","suggestedActivities":[]});
    expect(tripsRepo.findLastTrip(44, "2020/01/21")).to.deep.equal({"id":181,"userID":44,"destinationID":23,"travelers":4,"date":"2019/11/29","duration":7,"status":"approved","suggestedActivities":[]});
  });

});
