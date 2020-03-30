pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  string storedData;
  string owner;
  function setFile(string memory x) public {
    storedData = x;
  }

  function getFile() public view returns (string memory){
    return storedData;
  }
  function setOwner(string memory y)public{
    owner = y;
  }
  function getOwner() public view returns (string memory){
    return owner;
  }
}
