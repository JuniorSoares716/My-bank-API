var express = require('express'); // iniciando o express
var app = express(); // estanciando o express na variavel app
var router = require("./routes/accounts");
var fs = require('fs').promises; //para criação de arquivo
global.filename = 'accounts.json'

app.use(express.json()); //Tem que colocar esse linha de codigo, pois sem ela não funciona o JSON
app.use('/account', router);




app.listen(3000, async () => {

    try {
        await fs.readFile(global.filename, "utf8");
        console.log("API start");
    } catch (error) {
        const initialJson = {
            nextId: 1,
            accounts: []
        };
        fs.writeFile(global.filename, JSON.stringify(initialJson)).catch(error => {
            console.log(error);
        });
    }
});