const port = 3000;
const express = require('express');
const app = express();
const path = require("path");

app.use('/src', express.static(__dirname + '/src'));
app.use('/dist', express.static(__dirname + '/dist'));

app.get('/',function(req,res){
     res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen( port, () => console.log(`\n server listening on port ${port} \n` ));