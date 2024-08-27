import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import VotingContract from './contracts/Voting.json';

const App = () => {
  const [account, setAccount] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [contract, setContract] = useState(null); // Reintroduced state
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setContract(instance); // Set contract instance

      const candidatesCount = await instance.methods.candidatesCount().call();
      const candidatesList = [];
      for (let i = 1; i <= candidatesCount; i++) {
        const candidate = await instance.methods.candidates(i).call();
        candidatesList.push(candidate);
      }
      setCandidates(candidatesList);
    };

    loadBlockchainData();
  }, []);

  return (
    <div>
      <h1>Blockchain Voting System</h1>
      <p>Your account: {account}</p>
      <ul>
        {candidates.map((candidate, index) => (
          <li key={index}>{candidate.name} - {candidate.voteCount} votes</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
