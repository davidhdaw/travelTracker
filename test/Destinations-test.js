import { expect } from 'chai';
import { destinationsData } from './test-data.js';

describe('Destinations', () => {
  let destinationsRepo = [];
  beforeEach( () => {
    destinationsRepo = new Destinations(destinationsData);
  });

  it('should be a function', function () {
    expect(Destinations).to.be.a('function');
  });

  it('should be an instance of Destinations', function () {
    expect(destinationsRepo).to.be.an.instanceof(Destinations);
  });

  it('Should be able to find the cost of a vacation with the destination ID, number of travelers and length of stay', function () {
    expect(destinationsRepo.findTripCost(3,3,3)).to.equal(4020);
    expect(destinationsRepo.findTripCost(4,4,4)).to.equal(2180);
  });
