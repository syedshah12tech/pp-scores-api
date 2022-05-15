const expect = require('chai').expect;
const sinon = require('sinon');
const storage = require('../../../storage/storage');
const playerService = require('../../../services/player-service');

describe("player-service", function () {
  describe("#addPlayer()", function(){
    it("should call correct storage module method with the passed name argument", function(){
      let fake = sinon.fake();
      storage.addOrUpdatePlayer = fake;
  
      playerService.addPlayer("player1");
      expect(fake.callCount).to.equal(1); 
      expect(fake.firstArg.name).to.equal("player1");
    })
  })
  describe("#getTopPlayers()", function(){
    it("should call correct storage module method with correct count argument", function() {
      let fake = sinon.fake();
      storage.topPlayersByWinLossRatio = fake;

      playerService.getTopPlayers(20);
      expect(fake.callCount).to.equal(1);
      expect(fake.firstArg).to.equal(20);
    })
    
  });
  afterEach(function () {
    sinon.restore();
  });
})