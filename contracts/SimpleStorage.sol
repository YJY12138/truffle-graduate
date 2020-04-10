pragma solidity >=0.4.31 <0.7.0;
pragma experimental ABIEncoderV2;
contract SimpleStorage {
  struct Filemsg{
    string filehash;
    string filename;
    string owner;
  }
  Filemsg[] public storedData;
  uint filenumbers = 0;
  address user = msg.sender;
  function setFilemsg(string memory hash,string memory filename,string memory owner) public  returns(uint) {//x是想要存链的文件的hash,y是上传文件的时候上传的账户
    uint flag = 1;
    Filemsg  memory temp = Filemsg(hash,filename,owner);//中间变量
    if(storedData.length>0){//如果当前数组里面已经有数据，就先判断是否已经存在
     for(uint i = 0;i < storedData.length ; i ++ ){
      if(utilCompareInternal(hash,storedData[i].filehash)==1)//hash值未存在,可以上传
        {
            storedData.push(temp);//将新数据加入
            addFilenumber();//文件数目+1
            flag = 1;//flag==1表示加入数据成功
            return flag;
        }
        else{
          flag = 0;//flag==0表示加入数据失败
          return flag;
        }
        }
    }
    else{//如果当前数组里还没有数据，直接插入数据
       storedData.push(temp);
       addFilenumber();
       flag = 1;
       return flag;
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
  function getFile() public view returns (Filemsg[] memory){
    return storedData;
  }
  function getBlocknumber()  public  view returns (uint){
    return block.number;
  }
  function getUserbalance() public view returns (uint){
    return msg.sender.balance;
  }
   function getUser() public view returns (address){
    return msg.sender;
  }
  function addFilenumber() public  {
   filenumbers ++;
  }
   function getFilenumber() public view returns (uint){
   return filenumbers ;
  }

}
