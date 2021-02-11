pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;

import {DataTypes} from "./DataTypes.sol";

/**
@title Voting System
@dev Abstract class to define voting system types
 */
abstract contract VotingSystem {
    DataTypes.Candidate[] candidates;
    
    function calculate() external view virtual returns(uint);
    
    /**
    @dev Returns the name of the winning candidate
     */
    function getWinner() external view returns (string memory winnerName_)
    {
        winnerName_ = candidates[this.calculate()].name;
    }
}
    
