var express = require('express'); // iniciando o express
var app = express(); // estanciando o express na variavel app
var router = require("./routes/accounts");
var fs = require('fs'); //para criação de arquivo
global.filename = 'accounts.json'

app.use(express.json()); //Tem que colocar esse linha de codigo, pois sem ela não funciona o JSON
app.use('/account', router);




app.listen(3000, function () {
    try {
        fs.readFile(global.filename, "utf8", (err, data) => {
            if (err) {
                const initialJson = {
                    nextId: 1,
                    accounts: []
                };
                fs.writeFile(global.filename, JSON.stringify(initialJson), err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    } catch (err) {
        console.log(err);

    }
    console.log("API start");
});