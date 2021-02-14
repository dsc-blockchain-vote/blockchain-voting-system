pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "./DataTypes.sol";

/**
@title Voting System
@dev Abstract class to define voting system types
 */
abstract contract VotingSystem {
    DataTypes.Candidate[] candidates;

    function calculate() external view virtual returns (uint256[] memory);

    /**
    @dev Returns the name of the winning candidate
     */
    function getWinner() external view returns (string memory _winnerName) {
        uint256[] memory winners = this.calculate();
        if (winners.length > 1) {
            _winnerName = "tie: ";
            for (uint256 i = 0; i < winners.length; i++) {
                // abi.encodePacked(arg) is an ABI encoding function that concatinates 2 strings together;
                _winnerName = string(
                    abi.encodePacked(
                        _winnerName,
                        candidates[winners[i]].name,
                        " "
                    )
                );
            }
        } else {
            _winnerName = candidates[winners[0]].name;
        }
    }
}
