const express = require('express');
const path = require('path');
const rootDir = path.dirname(require.main.filename);

exports.getUserSignUp = (req, res, next) => {
    res.sendFile(path.join(rootDir, "views", "signup.html"));
}

exports.postUser = (req, res, next) => {
    console.log(req.body);
    res.send(req.body)
}
