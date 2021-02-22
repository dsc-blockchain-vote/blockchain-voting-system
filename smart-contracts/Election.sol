pragma solidity >=0.7.0 <0.8.0;
pragma experimental ABIEncoderV2;
import "./VotingSystem.sol";
import "./FirstPastThePost.sol";
import "./DataTypes.sol";

/**
@title Election
@dev Main contract used to set up and participate in the election on the blockchain
 */
contract Election {
    DataTypes.Candidate[] public candidates;

    enum votingTypes {firstPastThePost}
    votingTypes votingType;

    uint256 public endTime;
    uint256 public startTime;

    address public organizer;

    mapping(address => DataTypes.Voter) public voters;

    /**
    @dev checks whether the sender of the request is the organizer or not
     */
    modifier onlyHost() {
        require(msg.sender == organizer);
        _;
    }

    /**
    @dev checks whether the sender made the request within the given endtime
     */
    modifier onlyWhileOpen() {
        require(block.timestamp < endTime);
        require(block.timestamp >= startTime);
        _;
    }
    
    modifier onlyBeforeElection() {
        require(block.timestamp < startTime);
        _;
    }

    /**
    @dev initilazes the Election by storing the candidates and start, end time
    @param candidateNames array of strings containing the candidate names
    @param _endTime uint storing the end time in epoch seconds
    @param _startTime uint storing the start time in epoch seconds
     */
    constructor(string[] memory candidateNames, uint256 _endTime, uint256 _startTime) {
        votingType = votingTypes.firstPastThePost;
        organizer = msg.sender;
        endTime = _endTime;
        startTime = _startTime;
        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(
                DataTypes.Candidate({
                    name: candidateNames[i],
                    voteCount: 0,
                    id: i
                })
            );
        }
    }

    /**
    @dev allows the organizer to give voting privilege to a voter
    @param voterAddress address of the voter account
     */
    function giveRightToVote(address voterAddress) public onlyHost {
        voters[voterAddress].validVoter = true;
    }

    /**
    @dev allow valid voter to caste their votes
    @param candidateID unint representing the candidate who got the vote
     */
    function vote(uint256 candidateID) public onlyWhileOpen {
        DataTypes.Voter memory sender = voters[msg.sender];
        require(sender.validVoter, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.votedFor = candidateID;
        candidates[candidateID].voteCount += 1;
    }

    /**
    @dev calculate the winning candidate according to the choosen voting system
    @return winningCandidate unit id of the winner candidate
     */
    function calculateWinner() public returns (uint256[10] memory winningCandidate) {
        FirstPastThePost countMethod = new FirstPastThePost(candidates);
        winningCandidate = countMethod.calculate();
    }

    /**
    @dev returns the winning candidate(s) name
    @return winnerName string name of the winning candidate
     */
    function winnerCandidateName() public returns (string memory winnerName) {
        FirstPastThePost countMethod = new FirstPastThePost(candidates);
        uint256[10] memory winners = countMethod.calculate();
        if (winners.length > 1) {
            winnerName = string(abi.encodePacked("tie: ", candidates[winners[0]].name));
            for (uint256 i = 1; i < winners.length; i++) {
                // abi.encodePacked(arg) is an ABI encoding function that concatinates 2 strings together;
                if(winners[i] == 0 && i != 0){
                    break;
                }
                winnerName = string(
                    abi.encodePacked(winnerName,", ", candidates[winners[i]].name)
                );
            }
            
        } else {
            winnerName = candidates[winners[0]].name;
        }
    }
    /**
     @dev adds the candidate with the given name to the election. 
     This function is only callable before the election begins
     @param newCandidate the name of the new candidate
    */
    function addCandidate(string memory newCandidate) public onlyBeforeElection {
        candidates.push(DataTypes.Candidate({
                    name: newCandidate,
                    voteCount: 0,
                    id: candidates.length
                }));
    }
    /**
    @dev removes the specified candidate from the election 
    @param candidateID the ID of the candidate to be removed
    
    NOTE: this version replaces the specified candidate by replacing it with a Deleted candidate object. 
    It is significantly more gas inefficient however may introduce problems if the organizer
    removes a large enough number of candidates and wastes memory on the blockchain.
     */
    function removeCandidateA(uint candidateID) public {
        candidates[candidateID] = DataTypes.Candidate({
                    name: "Deleted",
                    voteCount: 0,
                    id: 9999
                });
    }
    /**
    @dev removes the specified candidate from the election 
    @param candidateID the ID of the candidate to be removed
    
    NOTE: this version deletes the specified candidate in the array 
    and then adjusts the index of all other candidates within the array
    such that at index i holds the candidate with id i.
    
    This is very gas inefficient
     */
    
    function removeCandidateB(uint candidateID) public {
        for (uint i = candidateID; i < candidates.length - 1; i++) {
            candidates[i] = candidates[i + 1];
            candidates[i].id--;
        }
        delete candidates[candidates.length - 1];
    }
}