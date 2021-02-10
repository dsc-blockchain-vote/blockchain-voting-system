pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;
import "./VotingSystem.sol";
import {DataTypes} from "./DataTypes.sol";

contract FirstPastThePost is VotingSystem {
    
    DataTypes.Candidate candidate;
    
    candidate[] public candidates;
    
    constructor(candidate[] memory candidateCopy) {
        candidates = candidateCopy;
        
    }
    
    function calculate() public view override
            returns (uint winningCandidate_)
    {
        uint winningVoteCount = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidate_ = i;
            }
        }
    }
    
        function getWinner() public view override
            returns (bytes32 winnerName_)
    {
        winnerName_ = candidates[calculate()].name;
    }
}