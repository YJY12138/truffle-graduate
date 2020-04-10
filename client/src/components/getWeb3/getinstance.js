import getWeb3 from '../getWeb3/getWeb3'
import SimpleStorageContract from "../../contracts/SimpleStorage.json";
import truffleContract from "truffle-contract";

const getinstance =  async () =>{
    try {
        const web3 = await getWeb3()
        const accounts = await web3.eth.getAccounts()
        const Contract = await truffleContract(SimpleStorageContract)
        await  Contract.setProvider(web3.currentProvider)
        // 返回已经部署的合约
        const instance = await Contract.deployed()      
        const filehashs =await instance.getFile()
        var results=[instance,web3,accounts,filehashs]

        return results
      } catch (error) {
          return error
      }
    };
export default getinstance;