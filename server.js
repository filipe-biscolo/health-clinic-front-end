//Install express server
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist/healthclinic'));

app.get('/*', function(req,res) {
    res.sendFile(__dirname + '/dist/healthclinic/index.html');
});

app.listen(process.env.PORT || 8080);