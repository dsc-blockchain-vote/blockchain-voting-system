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

    /**
    @dev Returns the name of the winning candidate. In case of a tie(s) for first, return a string containing
    the names of all candidates who tied up to a maxiomum of 10 ties. In case of more than 10 ties, the 10 candidates with the
    lowest candidateid's will be returned.
     */
    function getWinner() external view returns (string memory _winnerName) {
        uint256[10] memory winners = this.calculate();
        for (uint256 i = 0; i < winners.length; i++) {
            // abi.encodePacked(arg) is an ABI encoding function that concatinates 2 strings together;
            _winnerName = string(
                abi.encodePacked(
                    _winnerName,
                    candidates[winners[i]].name,
                    ","
                )
            );
        }
    }
}
