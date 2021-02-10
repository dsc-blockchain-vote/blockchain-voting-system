pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;

interface VotingSystem {
    function calculate() external returns(uint);
    
    function getWinner() external returns(bytes32);
}
    
