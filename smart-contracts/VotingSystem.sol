pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "./DataTypes.sol";

/**
@title Voting System
@dev Abstract class to define voting system types
 */
abstract contract VotingSystem {
    DataTypes.Candidate[] candidates;

    function calculate() external view virtual returns (uint256[10] memory);
}
