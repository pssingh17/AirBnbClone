const User = require('../../models/users');

const saveUser = async (data)=>{
    if(data){
        var newData = new User(data)
        // console.log("save user me data", data)
        await newData.save();
        return newData;
    }
}
 module.exports = saveUser;