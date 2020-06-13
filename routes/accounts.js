var express = require('express');

var fs = require('fs').promises;

var router = express.Router();

//Rotas
router.post("/", async (req, res) => {



  try {
    let account = req.body;

    let data = await fs.readFile(global.filename, "utf8");
    let json = JSON.parse(data);

    account = { id: json.nextId++, ...account };
    json.accounts.push(account);

    await fs.writeFile(global.filename, JSON.stringify(json));

    res.send(account);

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/', async (_, res) => {

  try {
    let data = await fs.readFile(global.filename, "utf8");
    let dataJson = JSON.parse(data);
    delete dataJson.nextId;
    res.send(dataJson);

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {


  try {
    let id = Number(req.params.id);

    let data = await fs.readFile(global.filename, "utf8");
    let dataJson = JSON.parse(data);
    let accountFilter = dataJson.accounts.find(account => account.id === id);

    if (accountFilter) {
      res.send(accountFilter);
    }
    else {
      res.end();
    }

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {



  try {
    let id = Number(req.params.id);

    let data = await fs.readFile(global.filename, "utf8");
    let dataJson = JSON.parse(data);
    let accounts = dataJson.accounts.filter(account => account.id !== id);

    dataJson.accounts = accounts;


    await fs.writeFile(global.filename, JSON.stringify(dataJson));

    res.end();

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


router.put("/", async (req, res) => {


  try {
    let newAccount = req.body;


    let id = newAccount.id;
    let name = newAccount.name;
    let balance = newAccount.balance;

    let data = await fs.readFile(global.filename, "utf8");
    let dataJson = JSON.parse(data);


    let oldIndex = dataJson.accounts.findIndex(account => account.id === id);

    dataJson.accounts[oldIndex].name = name;
    dataJson.accounts[oldIndex].balance = balance;

    await fs.writeFile(global.filename, JSON.stringify(dataJson));

    res.end();

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


router.post("/transation", async (req, res) => {


  try {
    const params = req.body;

    let id = params.id;
    let value = params.value;

    let data = await fs.readFile(global.filename, "utf8");
    let dataJson = JSON.parse(data);

    let index = dataJson.accounts.findIndex(account => account.id === id);

    if (value < 0 && ((dataJson.accounts[index].balance + value) < 0)) {
      throw new Error("Saldo insuficiente");
    }

    dataJson.accounts[index].balance += value;

    await fs.writeFile(global.filename, JSON.stringify(dataJson));

    res.send(dataJson.accounts[index]);

  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
module.exports = router;