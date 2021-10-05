const express = require('express');
const bcrypt = require('bcrypt');
const users = require('../models/user')
const workers = require('../models/worker')
const app = express.Router();
const multer = require('multer')
const upload = multer({});
const cors = require('cors')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const { sequelize } = require('../models/user');

app.use(cors())
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended:false }));

//Function that converts an image byte array into a base64 string
//Reference: https://robert-keller22.medium.com/upload-and-download-images-to-a-postgres-db-node-js-92e43f232ae4
function ConvertImage(worker){
    const workerImage = worker.Photo.toString('base64')
    worker['Photo'] = workerImage
}

async function userIsExist(username){
    const exist = await users.count({
        where: {
          Username: username
        }
    })
    .then(count => {
        return (count > 0) ? true : false
    });
    return exist;
}

async function getUserPassword(username) {
    return await users.findOne({
      where: {
        Username: username
      }
    });
}

async function passwordIsTrue(loginPassword, databasePassword){
    return await bcrypt.compare(loginPassword, databasePassword)
}

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

function setCookie(res, accessToken, expiryTime){

    res.cookie('ACCESS_TOKEN', accessToken, {
        maxAge : expiryTime,
        httpOnly : true
    })
}

app.post("/register", upload.single('Photo'), async (req, res) => {
    try{
        let { FirstName, LastName, 
            Location, Username, Password, Role } = req.body
        
        if (await userIsExist(Username)){
            const REGISTERED = '3'
            return res.send(REGISTERED);
            
        }else{
            const hashedPassword = await bcrypt.hash(Password, 10);
            Password = hashedPassword

            if(Role === 'Admin'){
                let transaction;
                try{
                    transaction = await sequelize.transaction();
                    await users.create({
                        Username,
                        Password,
                        Role: "Admin"
                    }, {transaction})

                    await transaction.commit();
                    res.status(201).json("Admin account created successfully!")
                }
                catch(error){
                    if (transaction) {
                        await transaction.rollback();
                    }
                    res.status(400).json(error);
                }

            } else{
                const new_worker = await workers.create({
                    FirstName,
                    LastName,
                    Photo: req.file ? req.file.buffer : null,
                    Location
                })
                .then(function(worker){
                    return worker
                })
                .catch(err => res.status(400).json(err))
    
                await users.create({
                    Username, 
                    Password,
                    Role: "Worker",
                    WorkerId: new_worker.WorkerId
                })
                .then(result => res.status(200))
                .catch(err => res.status(400).json(err))
    
                res.status(201).send('Register Successful');
                return;
            }
        }

    } catch {
        res.status(500).send();
    }
});

app.post('/login', async (req, res) => {
    let {Username, Password} = req.body

    const WRONGPASSWORD = '0'
    const SUCCESS = '1'
    const UNREGISTERED = '2'
    const loginUsername = Username
    const loginPassword = Password
    if(await userIsExist(loginUsername) == true){
        try{
            await getUserPassword(loginUsername).then(async function(result){
                if(await passwordIsTrue(loginPassword, result.Password)){
                    const user = { username: loginUsername }
                    const accessToken = generateAccessToken(user)
                    expiryTime = 1000 * 60 * 60; //(ms * s * mins) 60 mins
                    setCookie(res, accessToken, expiryTime);
                    return res.send(SUCCESS);
                } else {
                    return res.send(WRONGPASSWORD);     
                }
            });
        }catch{
            res.status(500).send();
        }
    } else {
        res.send(UNREGISTERED);
    }
});

app.post('/logout', async (req, res) => {
    try {
        res.clearCookie("ACCESS_TOKEN");
        res.clearCookie("Role");
        res.clearCookie("WorkerId");
        res.status(200).send("Cookie Deleted");
        return;
    } catch {
        res.status(500).send("Deleting Cookie Fails");
    }
})

app.get('/worker/:id', async (req, res) => {

    let transaction;
    const workerId = req.params.id;

    try {
        transaction = await sequelize.transaction();
        let worker = await users.findAll({
            where: {
                WorkerId: workerId
            },
            attributes: ["Username"], 
            include: [{
                model: workers,
                required: true,
                attributes: [
                    'FirstName', 'LastName', 'Location', 'Photo'
                ]
            }]
        }, { transaction })
        
        await transaction.commit();
        if (worker.length === 1) {
            if(worker[0].Worker.Photo){
                ConvertImage(worker[0].Worker)
            }
            res.json(worker);
        }
        else {
            res.status(404).json(worker);
        }
    }
    catch (error) {
        await transaction.rollback();
        res.status(400).json(error);
    }
})

app.delete('/delete', async (req, res) => {
    let transaction;
    let workerId = req.body.WorkerId;
    try{
        transaction = await sequelize.transaction();
        const accountToDelete = await workers.findByPk(workerId, {transaction});
        if (accountToDelete === null){
            throw new Error("Account not found")
        }
        await accountToDelete.destroy({transaction})
        await transaction.commit();
        return res.status(200).send('Account deleted');
    } catch (err) {
        return res.status(404).send('Account not found');
    }  
})

app.get('/session', async (req, res) => {
    await users.findAll({
        attributes: ['Role', 'WorkerId'],
        where: {
            Username: req.query.username,
        }
        })
        .then(userData => res.status(200).json(userData))
        .catch(err => res.status(500).json(err))
});

app.put('/changepw', async (req, res) => {
    let { Username, Current_Password, New_Password, Role } = req.body;

    let transaction;

    try {

        transaction = await sequelize.transaction();
        const user = await users.findByPk(Username, { transaction });

        if (user === null) {
            throw new Error("User not found");
        }

        if (await passwordIsTrue(New_Password, user.Password)) {
            throw new Error("New password must be different");
        }

        // Admins can bypass entering current password
        if (Role === 'Admin' || await passwordIsTrue(Current_Password, user.Password)) {
            New_Password = await bcrypt.hash(New_Password, 10);
            await user.update({
                Password: New_Password
            }, { transaction })

            await transaction.commit();
            res.json("Password has been updated");
        }
        else {
            throw new Error("Current password is incorrect");
        }        
    }
    catch (error) {
        if (transaction)
            await transaction.rollback();

        if (error.message === "New password must be different")
            res.status(409).json(error.message);
        else if (error.message === "User not found")
            res.status(404).json(error.message);
        else if (error.message === "Current password is incorrect")
            res.status(401).json(error.message);
        else
            res.status(400).json(error);
    }
})

module.exports = app;
