
import express from 'express';
import { promises } from 'fs';


const router = express.Router();



const readFile = promises.readFile;
const writeFile = promises.writeFile;

//Rotas
router.post("/", async (req, res) => {

  try {
    let account = req.body;

    let data = await readFile(global.filename, "utf8");
    let json = JSON.parse(data);

    account = { id: json.nextId++, ...account };
    json.accounts.push(account);

    await writeFile(global.filename, JSON.stringify(json));

    res.send(account);
    logger.info(`POST /account - ${JSON.stringify(account)}`);

  } catch (error) {
    res.status(400).send({ error: error.message });
    logger.error(`POST /account - ${error.message}`);
  }
});

router.get('/', async (_, res) => {

  try {
    let data = await readFile(global.filename, "utf8");
    let dataJson = JSON.parse(data);
    delete dataJson.nextId;
    res.send(dataJson);

    logger.info("GET /account");

  } catch (error) {
    res.status(400).send({ error: error.message });
    logger.error(`GET /account - ${error.message}`);

  }
});

router.get('/:id', async (req, res) => {


  try {
    let id = Number(req.params.id);

    let data = await readFile(global.filename, "utf8");
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
    logger.error(`GET /account/:id - ${error.message}`);

  }
});

router.delete("/:id", async (req, res) => {

  try {
    let id = Number(req.params.id);

    let data = await readFile(global.filename, "utf8");
    let dataJson = JSON.parse(data);
    let accounts = dataJson.accounts.filter(account => account.id !== id);

    dataJson.accounts = accounts;


    await writeFile(global.filename, JSON.stringify(dataJson));

    res.end();

    logger.info(`DELETE /account/:id ${id}`);


  } catch (error) {
    res.status(400).send({ error: error.message });
    logger.error(`DELETE /account/:id ${error.message}`);
  }
});


router.put("/", async (req, res) => {


  try {
    let newAccount = req.body;


    let id = newAccount.id;
    let name = newAccount.name;
    let balance = newAccount.balance;

    let data = await readFile(global.filename, "utf8");
    let dataJson = JSON.parse(data);


    let oldIndex = dataJson.accounts.findIndex(account => account.id === id);

    dataJson.accounts[oldIndex].name = name;
    dataJson.accounts[oldIndex].balance = balance;

    await writeFile(global.filename, JSON.stringify(dataJson));

    res.end();
    logger.info(`PUT /account - ${JSON.stringify(newAccount)}`)

  } catch (error) {
    res.status(400).send({ error: error.message });
    logger.error(`DELETE /account/:id ${error.message}`);

  }
});


router.post("/transation", async (req, res) => {


  try {
    const params = req.body;

    let id = params.id;
    let value = params.value;

    let data = await readFile(global.filename, "utf8");
    let dataJson = JSON.parse(data);

    let index = dataJson.accounts.findIndex(account => account.id === id);

    if (value < 0 && ((dataJson.accounts[index].balance + value) < 0)) {
      throw new Error("Saldo insuficiente");
    }

    dataJson.accounts[index].balance += value;

    await writeFile(global.filename, JSON.stringify(dataJson));

    res.send(dataJson.accounts[index]);
    logger.info(`POST /account/transation - ${JSON.stringify(params)}`)

  } catch (error) {
    res.status(400).send({ error: error.message });
    logger.error(`POST /account/transation ${error.message}`);

  }
});
// module.exports = router;
export default router;