const crypto = require("crypto");

let jwt = require("jsonwebtoken");
const config = require("../helpers/config");


function hashPassword(password) {
    let hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

function generateJWT(userId) {
    return jwt.sign({
        userId: userId
    }, config.secret, { expiresIn: '2h' });
}

function verifyJWT(token) {
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            return false;
        } else {
            return decoded.userId;
        }
    })
}

// << db setup >>
const db = require("../db");
const collectionName = "users";

const express = require("express");
const router = express.Router();


db.initialize(collectionName, function(dbCollection) { // successCallback
    router.post("/register", (request, response) => { //_id = email
        let item = request.body;
        //hash the password
        item.password = hashPassword(item.password);

        dbCollection.insertOne(item, (error, result) => { // callback of insertOne
            if (error) {
                response.status(400).json({
                    success: false,
                    message: 'Register failed! Please check the request'
                });
            } else {
                let token = generateJWT(item._id);
                response.status(200).json({
                    success: true,
                    message: 'Register successful',
                    token: token
                });
            }

        });
    });

    router.post("/login", (request, response) => {
        const item = request.body;
        //hash the password
        item.password = hashPassword(item.password);

        dbCollection.findOne({ _id: item.email }, (error, result) => {
            if (error) throw error;

            if (result == null) {
                response.status(404).json({
                    success: false,
                    message: 'Email not found!'
                });
            } else {
                if (item.password === result.password) {
                    //all ok
                    //set jwt
                    let token = generateJWT(item.email);
                    //add jwt to result
                    response.status(200).json({
                        success: true,
                        message: 'Authentification successful',
                        token: token
                    });
                } else {
                    response.status(403).json({
                        status: false,
                        message: 'Wrong password'
                    });
                }
            }
        });
    });

    router.get("/users", (request, response) => {
        //verify jwt
        dbCollection.find().project({ _id: 1 }).toArray((error, result) => {
            if (error) throw error;
            if (result == null) {
                response.status(404).json({
                    success: false,
                    message: 'Users not found!'
                });
            } else {
                response.status(200).json({
                    success: true,
                    data: result
                });
            }
        });
    });

}, function(err) {
    throw err;
});



module.exports = {
    router,
    verifyJWT
};