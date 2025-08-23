const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

// app.get('/*', function (req, res) {
//
//    need to change the above '/*' to the below '/*\w'
//    to get around the error:
//
//      TypeError: Invalid token at 1: https://git.new/pathToRegexpError
//
//    refer to: https://stackoverflow.com/questions/78973586/typeerror-invalid-token-at-1-https-git-new-pathtoregexperror
//
app.get('/*\w', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(9000);