import getinstance from "./getinstance";

const getCurrentData = () =>
  new Promise((resolve, reject) => 
        {
            const temp=await getinstance();
            if(temp==null){

            }else{
                resolve(temp)
            }



      
        }
  );

export default getCurrentData;
