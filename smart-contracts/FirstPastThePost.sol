pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;
import "./VotingSystem.sol";
import {DataTypes} from "./DataTypes.sol";

/**
@title First Past the Post
@dev Implimentation of the VotingSystem interface
 */
contract FirstPastThePost is VotingSystem {
    
    /**
    @dev initializes FirstPastThePost contract by passing in an array of DataTypes.Candidate
    @param candidate_ array of DataTypes.Candidate struct
     */
    constructor(DataTypes.Candidate[] memory candidate_) {
        candidates = candidate_;
        
    }
    
    /**
    @dev Calculates the winner under First Past the Post system
    @return winningCandidate_ It is the id of the winning candidate
     */
    function calculate() external view override returns (uint winningCandidate_)
    {
        uint winningVoteCount = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidate_ = i;
            }
        }
    }
    
    
}