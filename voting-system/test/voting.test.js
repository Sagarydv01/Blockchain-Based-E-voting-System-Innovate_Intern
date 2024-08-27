const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
  it("initializes with two candidates", async () => {
    const instance = await Voting.deployed();
    const count = await instance.candidatesCount();
    assert.equal(count, 2);
  });

  it("allows a voter to cast a vote", async () => {
    const instance = await Voting.deployed();
    await instance.vote(1, { from: accounts[0] });
    const candidate = await instance.candidates(1);
    assert.equal(candidate.voteCount, 1);
  });
});
