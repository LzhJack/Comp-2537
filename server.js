const express = require('express');
const app = express();

app.use(express.static(__dirname ));

app.listen(process.env.PORT || 5005, function (err) {
    if (err)
        console.log(err);
});

app.get('/',function(req,res){
    res.sendFile('poke.html', { root: __dirname });
});