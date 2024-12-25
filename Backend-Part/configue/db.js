const mongoose = require('mongoose');
exports.Dbconnect= async()=> {
    try{
       const connect = await mongoose.connect(process.env.MONGODB_URI)
       console.log(`database connected ${connect.connection.host} `)
    }
    catch(error){
        console.log(`database connection field ${error} `)

    }
}
