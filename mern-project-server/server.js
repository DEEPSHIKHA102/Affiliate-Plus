const express =  require('express'); //include the express module
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoutes');

const app = express();//Instantiate express app.

app.use(express.json());//Middleware to convert json to js objects
app.use(cookieParser());
app.use('/auth', authRoutes);


const PORT = 5001;
app.listen(5001, (error) => {
    if(error){
        console.log('Error starting the server : ', error);
    }else{
        console.log(`Server is running at http://localhost:${PORT}`);
    }
});