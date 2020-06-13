const express = require('express'); // iniciando o express
const fs = require('fs').promises; //para criação de arquivo
const winston = require('winston');

const router = require("./routes/accounts");

const app = express(); // estanciando o express na variavel app

global.filename = 'accounts.json';



const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: "MY-BANK-API.log" })
    ],
    format: combine(
        label({ label: "MY BANK API" }),
        timestamp(),
        myFormat
    )
});

app.use(express.json()); //Tem que colocar esse linha de codigo, pois sem ela não funciona o JSON
app.use('/account', router);




app.listen(3000, async () => {

    try {
        await fs.readFile(global.filename, "utf8");
        logger.info("API start");
    } catch (error) {
        const initialJson = {
            nextId: 1,
            accounts: []
        };
        fs.writeFile(global.filename, JSON.stringify(initialJson)).catch(error => {
            logger.error(error);
        });
    }
});