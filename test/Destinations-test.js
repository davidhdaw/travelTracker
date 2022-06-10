import { expect } from 'chai';
import Destinations from '../src/Destinations.js';
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

  it('Should be able to find a destination by ID', function () {
    expect(destinationsRepo.findDestination(3)).to.equal({"id":3,"destination":"Sydney, Austrailia","estimatedLodgingCostPerDay":130,"estimatedFlightCostPerPerson":950,"image":"https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80","alt":"opera house and city buildings on the water with boats"});
    expect(destinationsRepo.findDestination(4)).to.equal({"id":4,"destination":"Cartagena, Colombia","estimatedLodgingCostPerDay":65,"estimatedFlightCostPerPerson":350,"image":"https://images.unsplash.com/photo-1558029697-a7ed1a4b94c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80","alt":"boats at a dock during the day time"});
  });

  it('Should be able to find the cost of a vacation with the destination ID, number of travelers and length of stay', function () {
    expect(destinationsRepo.findTripCost(3,3,3)).to.equal(4020);
    expect(destinationsRepo.findTripCost(4,4,4)).to.equal(2180);
  });

});
