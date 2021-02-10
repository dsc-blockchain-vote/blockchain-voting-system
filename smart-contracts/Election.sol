pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;
import "./FirstPastThePost.sol";
import {DataTypes} from "./DataTypes.sol";

contract Election {
    modifier onlyHost() {
        require(msg.sender == organizer);
        _;
    }
    
    modifier onlyWhileOpen() {
        require(block.timestamp < endTime );
        _;
    }
    DataTypes.Voter voter; 
    DataTypes.Candidate candidate;
    
    enum votingTypes {firstPastThePost}
    votingTypes votingType;

    uint public endTime;

    address public organizer;

    mapping(address => voter) public voters;
    
    candidate[] public candidates;
    
    constructor(string[] memory candidateNames, uint time) {
        votingType = votingTypes.firstPastThePost;
        organizer = msg.sender;
        endTime = time;
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(candidate({
                name: candidateNames[i],
                voteCount: 0,
                id: i
            }));
        }
    }
    
    function giveRightToVote(address voterAddress) public onlyHost {
        require(
            !voters[voterAddress].voted,
            "The voter already voted."
        );
        require(!voters[voterAddress].validVoter);
        voters[voterAddress].validVoter = true;
    }



    function vote(uint candidateID) public onlyWhileOpen {
        voter storage sender = voters[msg.sender];
        require(sender.validVoter, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.votedFor = candidateID;
        candidates[candidateID].voteCount += 1;
    }

   
    function winningCandidate() public view
            returns (uint winningCandidate_)
    {
        FirstPastThePost countMethod = new FirstPastThePost(candidates);
        winningCandidate_ = countMethod.calculate();
    }

    function winnerName() public view
            returns (bytes32 winnerName_)
    {
        winnerName_ = candidates[winningCandidate()].name;
    }
}