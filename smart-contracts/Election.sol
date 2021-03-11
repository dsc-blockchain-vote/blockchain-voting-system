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
        require(block.timestamp < endTime, "Election has ended");
        require(block.timestamp >= startTime, "Election has started");
        _;
    }
    
    modifier onlyBeforeElection() {
        require(block.timestamp < startTime, "Election start time has passed");
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
    @dev changes the elections start time if the start time is valid and the request
    was made before the election started
    @param _newStartTime uint storing the start time in epoch seconds
     */
    function setStartTime(uint256 _newStartTime) public onlyBeforeElection {
        if(_newStartTime < endTime) {
        startTime = _newStartTime;
        }
    }
    
    /**
    @dev changes the elections end time if the end time is valid and the request
    was made before the election started
    @param _newEndTime uint storing the start time in epoch seconds
     */
    function setEndTime(uint256 _newEndTime) public onlyBeforeElection {
        if(_newEndTime > startTime){
            endTime = _newEndTime;     
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
        require(voters[msg.sender].validVoter, "Has no right to vote");
        require(!voters[msg.sender].voted, "Already voted.");
        voters[msg.sender].voted = true;
        voters[msg.sender].votedFor = candidateID;
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
    function winnerCandidateName() public returns (string[10] memory winnerName) {
        FirstPastThePost countMethod = new FirstPastThePost(candidates);
        uint256[10] memory winners = countMethod.calculate();
        for (uint256 i = 0; i < winners.length; i++) {
            // abi.encodePacked(arg) is an ABI encoding function that concatinates 2 strings together;
            if(winners[i] == 0 && i != 0){
                break;
            }
            winnerName[i] = candidates[i].name;
        }

    }
    
    function electionResults() public view onlyHost returns (string memory results){
    for(uint256 i = 0; i < candidates.length; i++){
        string memory count = uintToStr(candidates[i].voteCount);
        results = string(abi.encodePacked(results,",", candidates[i].name, ",", count));
        }
        
    }
    
     function uintToStr(uint _i) internal pure returns (string memory _uintAsString) {
        uint number = _i;
        if (number == 0) {
            return "0";
        }
        uint j = number;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (number != 0) {
            bstr[k--] = byte(uint8(48 + number % 10));
            number /= 10;
        }
        return string(bstr);
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
    
     */
    
    function removeCandidate(uint candidateID) public onlyBeforeElection {
        for (uint i = candidateID; i < candidates.length - 1; i++) {
            candidates[i] = candidates[i + 1];
            candidates[i].id--;
        }
        delete candidates[candidates.length - 1];
    }
}
