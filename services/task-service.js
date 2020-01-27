// << db setup >>
const db = require("../db");
const collectionName = "tasks";

const express = require("express");
const router = express.Router();

const helperFunctions = require("../helpers/helper-functions");

db.initialize(collectionName, function(dbCollection) {
    router.post("/", (request, response) => {
        let item = request.body;
        item._id = helperFunctions.generateRandomId();

        dbCollection.insertOne(item, (error, result) => {
            if (error) {
                response.status(400).json({
                    success: false,
                    message: 'Creating task failed! Please check the request'
                });
            } else {
                response.status(200).json({
                    success: true,
                    message: 'Task created'
                });
            }
        })
    });

    router.get("/:email", (request, response) => {
        const emailUser = request.params.email;

        dbCollection.find({ email: emailUser }).toArray((error, result) => {
            if (error) {
                response.status(400).json({
                    success: false,
                    message: 'Getting tasks failed! Please check the request'
                });
            } else {
                response.status(200).json({
                    success: true,
                    data: result
                });
            }
        });
    });

    router.put("/:idTask", (request, response) => {
        const idTask = request.params.idTask;
        const item = request.body;

        dbCollection.updateOne({ _id: idTask }, { $set: item }, (error, result) => {
            if (error) {
                response.status(400).json({
                    success: false,
                    message: 'Update failed! Please check the request'
                });
            } else {
                response.status(200).json({
                    success: true
                });
            }
        });
    });

    router.delete("/:idTask", (request, response) => {
        const idTask = request.params.idTask;

        dbCollection.deleteOne({ _id: idTask }, function(error, result) {
            if (error) {
                response.status(400).json({
                    success: false,
                    message: 'Delete failed! Please check the request'
                });
            } else {
                response.status(200).json({
                    success: true
                });
            }
        });
    });

    router.get("/:idTask", (request, response) => {
        const idTask = request.params.idTask;

        dbCollection.findOne({ _id: idTask }, (error, result) => {
            if (error) {
                response.status(400).json({
                    success: false,
                    message: 'Error! Please check the request'
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
    router
};