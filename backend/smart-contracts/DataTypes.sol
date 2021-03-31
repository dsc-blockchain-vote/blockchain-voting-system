pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;

/**
@dev library to have common datatypes across all contracts
 */
library DataTypes {
    /// Voter datatype. Stores whether they have voted, whom they have voted for and
    /// whether they are allowed to vote in the election
    struct Voter {
        bool voted;
        uint256 votedFor;
        bool validVoter;
    }

    /// election candidate datatype. Stores the name, votes received and id
    struct Candidate {
        string name;
        uint256 voteCount;
        uint256 id;
    }
}
