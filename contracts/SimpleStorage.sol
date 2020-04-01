pragma solidity >=0.4.31 <0.7.0;
pragma experimental ABIEncoderV2;
contract SimpleStorage {
  string[] storedData;
  uint filenumbers = 0;
  string owner;
  address user = msg.sender;
  function setFile(string memory x,string memory y) public  returns(uint) {//x是想要存链的文件的hash,y是上传文件的时候上传的账户
    uint flag = 1;
    if(storedData.length>0){
     for(uint i = 0;i < storedData.length ; i ++ ){
      if(utilCompareInternal(x,storedData[i])==1&&utilCompareInternal(y,owner)==0)//hash值未存在,可以上传
        {
            storedData.push(x);
            addFilenumber();
            flag = 1;
        }
        else{
          flag = 0;
        }
        }
    }
    else{
       setOwner(y);
       storedData.push(x);
       addFilenumber();
      flag = 1;
    }
    return flag;
}
  function utilCompareInternal(string memory a, string memory b) public  pure  returns (uint) {
    if (bytes(a).length != bytes(b).length) {
        return 1;//说明两个字符串不等
    }
    for (uint i = 0; i < bytes(a).length; i ++) {
        if(bytes(a)[i] != bytes(b)[i]) {
            return 1;
        }
    }
    return 0;//说明两个字符串相等
}
  function getFile() public view returns (string[] memory){
    return storedData;
  }
  function setOwner(string memory y)public{
    owner = y;
  }
  function getOwner() public view returns (string memory){
    return owner;
  }
  function getBalance()  public  view returns (uint){
    return address(this).balance;
  }
  function getBlocknumber()  public  view returns (uint){
    return block.number;
  }
  function setUser() public  {
    user = msg.sender;
  }
   function getUser()public view returns (address){
    return msg.sender;
  }
  function getUserbalance() public view returns (uint){
    return user.balance;
  }
  function addFilenumber() public  {
   filenumbers ++;
  }
   function getFilenumber() public view returns (uint){
   return filenumbers ;
  }

}
