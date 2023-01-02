const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = 'A!12309icjklam()qwjelasjd[]???'
var bodyParser = require("body-parser");

var mysql = require('mysql');

var MysqlConnection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

MysqlConnection.connect(function (err) {
    if (err)
        console.log(err)
    console.log("Connected! MySQL");
});


 

app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);

mongoose
    .connect("mongodb://localhost:27017/UserInfo", {
        useNewUrlParser: true
    }).then(() => console.log('Connected to database'));

require('./db/UserInfo');


const User = mongoose.model('UserInfo');



const io = new Server(server, {
    cors: {
        methods: ['GET', 'POST']
    }
});


// socket functionality
io.on('connection', (socket) => {

    /* socket.on('join_room', (data) => {
         console.log(data);
         socket.join(data);
         io.sockets.emit('new_room', data);
     });*/

});
io.on('disconnection', (socket) => {

});

// A sample route
app.post('/register', async (req, res) => {
    const { userName, password, email, confirmPassword } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {

        let oldUserCheck;
        MysqlConnection.query('SELECT login, email FROM USERS WHERE LOGIN = "' + userName + '" or EMAIL = "' + email + '";', function (err, result) {
            err ? res.send({ error: "Error in the database" }) : oldUserCheck = result;

            console.log(oldUserCheck);
        });

        if (oldUserCheck) {
            res.send({ error: "User or Email Exists" })
        }
        if (password === confirmPassword) {
            MysqlConnection.query('INSERT INTO USERS (LOGIN, EMAIL, USER_PASSWORD) values ("' + userName + '", "' + email + '","' + encryptedPassword + '")', function (err, result) {
                if (err) throw err;
                console.log('Record inserted');
            });

            res.send({ status: 'OK' })
        }
    }
    catch (e) {
        res.send({ status: 'KO', error: e })
    }
});



app.post('/saveLand', async (req, res) => {
    //TO DO  TOKEN CHECK 

    // CONTORL NUMBER
    const { nameLand, typeLand, hectaresLand, priceLand, numberLand, emailtLand, newMarkerlat, newMarkerLng, token, allMarkers } = req.body;
    const decodedToken = jwt.verify(token, JWT_SECRET);



    try {
        MysqlConnection.query('INSERT INTO LANDS (NAME, TYPE, NUMBER, EMAIL, HECTARES, PRICE) values ("'
            + nameLand + '", "'
            + typeLand + '","'
            + numberLand + '","'
            + emailtLand + '","'
            + hectaresLand + '","'
            + priceLand + '")', function (err, result) {

                MysqlConnection.query('INSERT INTO USER_LAND ( USER_ID, LAND_ID) values ("'
                    + decodedToken.user_id + '","'
                    + result.insertId + '")', function (err, result) {
                        if (err) throw err;
                    })


                if (err) throw err;
                allMarkers.map((position, index) => {
                    MysqlConnection.query('INSERT INTO LAND_POSITION ( LAND_ID, LAT, LNG) values ("'
                        + result.insertId + '", "'
                        + position.lat + '","'
                        + position.lng + '")', function (err, result) {
                            if (err) throw err;
                        })
                })
            })
        res.send({ status: 'OK' })
    }
    catch (e) {
        res.send({ status: 'KO', error: e })
    }
});

app.post('/updateLand', async (req, res) => {
    //TO DO  TOKEN CHECK 

    // CONTORL NUMBER

    const { markerId, nameLand, typeLand, hectaresLand, priceLand, numberLand, emailtLand } = req.body;

    const data = [nameLand, typeLand, numberLand, emailtLand, hectaresLand, priceLand, markerId]
    console.log(data);
    //  const decodedToken = jwt.verify(token, JWT_SECRET);

    try {
        MysqlConnection.query('UPDATE LANDS set NAME=?, TYPE=?, NUMBER=?, EMAIL=?, HECTARES=?, PRICE =? WHERE ID=?', data, (err, result) => {
            if (err) throw err;
        })
        res.send({ status: 'OK' })
    }
    catch (e) {
        res.send({ status: 'KO', error: e })
    }
});
 


app.post('/login', async (req, res) => {
    let userLogin = req.body.userName;

    try {

        MysqlConnection.query('SELECT ID, USER_PASSWORD FROM USERS where LOGIN="' + userLogin + '"', async (err, result) => {
            if (err)
                console.log(err);
            const userInformation = { userPasswordLogin: result[0].USER_PASSWORD, userId: result[0].ID };

            if (!userInformation.userPasswordLogin) {
                return res.json({ status: 'KO', error: 'User not found' });
            }

            if (await bcrypt.compare(req.body.password, userInformation.userPasswordLogin)) {
                const token = jwt.sign({ userName: req.body.userName, user_id: userInformation.userId }, JWT_SECRET);

                if (res.status(201)) {
                    res.json({ status: 'OK', token: token, userId: userInformation.userId });
                }
                else {
                    res.json({ status: 'KO' });
                }
            }
            else {
                res.json({ status: 'KO', error: 'Invalid password' });
            }

        })
    }
    catch (e) {
        console.log(e)
    };

})

app.get('/allMarkers', async (req, res) => {
    //TO DO - TOKEN - let token = req.body.token;

    try {
        MysqlConnection.query('select L.ID, L.NAME, L.TYPE, L.NUMBER, L.EMAIL, L.HECTARES, L.PRICE, LP.ID, LP.LAND_ID, LP.LAT, LP.LNG, UL.USER_ID  from LANDS L INNER JOIN LAND_POSITION LP ON L.ID=LP.LAND_ID INNER JOIN USER_LAND UL ON L.ID=UL.LAND_ID;',
            async (err, result) => {
                if (err)
                    console.log(err);
                res.json({ data: result, status: 'OK' })
            })
    }
    catch (e) {
        console.log(e)
    };
})

app.post('/userLoged', async (req, res) => {
    const token = req.body.token;
    const decodedToken = jwt.verify(token, JWT_SECRET);

    //const user = await User.findOne({ userName: decodedToken.userName });
    try {
        MysqlConnection.query('SELECT ID FROM USERS where LOGIN="' + decodedToken.userName + '"', async (err, result) => {
            result[0].ID === decodedToken.user_id ? res.json({ userName: decodedToken.userName, status: 'OK', userId: decodedToken.user_id }) : res.json({ status: 'KO' })
        })
    } catch (e) {
        console.log(e)
    }
})

// Start the Express server
server.listen(3001, () => {
    console.log('Server Running')
});


