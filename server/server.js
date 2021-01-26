const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');



const app = express();
const authRoutes = require('./routes/auth');
//app middleware

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true

}).then(() => console.log('DB connected')).catch(err => console.log('DB connection error ', err));


if(process.env.NODE_ENV = 'development'){ 
    app.use(cors({origin: `http://localhost:3000`}));
}

//middleware
app.use('/api', authRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`API is running on port ${port} at ${process.env.CLIENT_URL}`);
});