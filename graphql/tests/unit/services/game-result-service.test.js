const gameResultService = require('../../../services/game-result-service');
var expect = require('chai').expect;

describe("game-result-service", function () {
  describe("#getWinnersAndLosers()", function(){
    it("should return correct winners and losers 2 players game", function() {
      let players = [
        {
          playerID: "player1",
          name: "Player 1"
        },
        {
          playerID: "player2",
          name: "Player 2"
        }
      ];
      let {winners, losers} = gameResultService.getWinnersAndLosers(players, ["player1"]);
      expect(winners.length).to.equal(1);
      expect(losers.length).to.equal(1);
      expect(winners[0].playerID).to.equal("player1");
      expect(losers[0].playerID).to.equal("player2");
    })
    it("should return correct winners and losers for 4 players game", function() {
      let players = [
        {
          playerID: "player1",
          name: "Player 1"
        },
        {
          playerID: "player2",
          name: "Player 2"
        },
        {
          playerID: "player3",
          name: "Player 3"
        },
        {
          playerID: "player4",
          name: "Player 4"
        }
      ];
      let {winners, losers} = gameResultService.getWinnersAndLosers(players, ["player1","player4"]);
      expect(winners.length).to.equal(2);
      expect(losers.length).to.equal(2);
      expect(winners[0].playerID).to.equal("player1");
      expect(winners[1].playerID).to.equal("player4");
      expect(losers[0].playerID).to.equal("player2");
      expect(losers[1].playerID).to.equal("player3");
    })
  })
  describe("#processWin()", function(){
    it("should return correct win loss ratio", function() {
      let winner = {
        wins: 20,
        losses: 2
      }
      let expectedRatio = (winner.wins + 1) / winner.losses;

      gameResultService.processWinLoss(winner, true);
      expect(winner.winLossRatio).to.equal(expectedRatio);
    })
    it("should handle division by zero sczenario", function() {
      let winner = {
        wins: 20,
        losses: 0
      }
      let expectedRatio = winner.wins + 1;

      gameResultService.processWinLoss(winner, true);
      expect(winner.winLossRatio).to.equal(expectedRatio);
    })
    it("should handle case when wins and losses are null", function() {
      let winner = {
      }
      let expectedRatio = 1;

      gameResultService.processWinLoss(winner, true);
      expect(winner.winLossRatio).to.equal(expectedRatio);
    })
  })

})