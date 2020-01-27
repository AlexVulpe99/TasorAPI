// server.js

const express = require("express");
const server = express();

const body_parser = require("body-parser");

// parse JSON (application/json content-type)
server.use(body_parser.json());

let port = process.env.PORT;
if (port == null || port == "") {
    port = 4000;
}

// << services >>
const authService = require("./services/auth-service");
server.use("/", authService.router);

const taskService = require("./services/task-service");
server.use("/tasks", taskService.router);

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});