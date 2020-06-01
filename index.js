var express = require('express'); // iniciando o express
var app = express(); // estanciando o express na variavel app

var fs = require('fs'); //para criação de arquivo


app.use(express.json()); //Tem que colocar esse linha de codigo, pois sem ela não funciona o JSON


//Rotas
app.post("/account", (req, res) => {
    let account = req.body;

    fs.readFile("accounts.json", "utf8", (err, data) => {
        if (!err) {

            try {
                let json = JSON.parse(data);
                account = { id: json.nextId++, ...account };
                json.accounts.push(account);

                fs.writeFile("accounts.json", JSON.stringify(json), err => {
                    if (err) {
                        res.status(400).send({ error: err.message });
                    } else {
                        res.end();
                    }
                });

            } catch (err) {
                res.status(400).send({ error: err.message });
            }
        }
    });
});


app.listen(3000, function () {
    try {
        fs.readFile('accounts.json', "utf8", (err, data) => {
            if (err) {
                const initialJson = {
                    nextId: 1,
                    accounts: []
                };
                fs.writeFile("accounts.json", JSON.stringify(initialJson), err => {
                    if (err) {
                        console.log(err);
                    }

                });
            }
        });
    } catch (err) {
        console.log(err);
        l

    }
    console.log("API start");
});