pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;

library DataTypes{
    struct Voter {
        bool voted;  
        uint votedFor; 
        bool validVoter;
    }
    struct Candidate {
        string name;
        uint voteCount;
        uint id;
    }    
}