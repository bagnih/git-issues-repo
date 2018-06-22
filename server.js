var express = require("express");
var path = require("path");
var app = express();

app.use(express.static(__dirname + ''));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
})


app.listen(3000, () => console.log('server started at localhost:3000'));