pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;
import "./VotingSystem.sol";
import "./DataTypes.sol";

/**
@title First Past the Post
@dev Implimentation of the VotingSystem interface
 */
contract FirstPastThePost is VotingSystem {
    
    /**
    @dev initializes FirstPastThePost contract by passing in an array of DataTypes.Candidate
    @param _candidate array of DataTypes.Candidate struct
     */
    constructor(DataTypes.Candidate[] memory _candidate) {
        for(uint i = 0; i < _candidate.length; i++){
            candidates.push(_candidate[i]);
        }        
    }
    
    /**
    @dev Calculates the winner under First Past the Post system
    @return winningCandidate It is the id of the winning candidate
     */
    function calculate() external view override returns (uint winningCandidate)
    {
        uint winningVoteCount = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidate = i;
            }
        }
    }
    
    
}