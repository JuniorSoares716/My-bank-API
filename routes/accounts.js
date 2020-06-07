var express = require('express');

var fs = require('fs');

var router = express.Router();

//Rotas
router.post("/", (req, res) => {
  let account = req.body;

  fs.readFile(global.filename, "utf8", (err, data) => {

    try {
      if (err) throw err;

      let json = JSON.parse(data);
      account = { id: json.nextId++, ...account };
      json.accounts.push(account);

      fs.writeFile(global.filename, JSON.stringify(json), err => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });

    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get('/', (req, res) => {
  fs.readFile(global.filename, "utf8", (err, data) => {

    try {
      if (err) throw err;

      let dataJson = JSON.parse(data);
      delete dataJson.nextId;
      res.send(dataJson);

    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get('/:id', (req, res) => {

  let id = Number(req.params.id);
  fs.readFile(global.filename, "utf8", (err, data) => {
    try {
      if (err) throw err;


      let dataJson = JSON.parse(data);
      let accountFilter = dataJson.accounts.find(account => account.id === id);

      if (accountFilter) {
        res.send(accountFilter);
      }
      else {
        res.end();
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.delete("/:id", (req, res) => {
  fs.readFile(global.filename, "utf8", (err, data) => {

    let id = Number(req.params.id);

    try {

      if (err) throw err;

      let dataJson = JSON.parse(data);

      let accounts = dataJson.accounts.filter(account => account.id !== id);

      dataJson.accounts = accounts;

      fs.writeFile(global.filename, JSON.stringify(dataJson), err => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });


    } catch (err) {
      res.status(400).send({ err: err.message });
    }
  });
});


router.put("/", (req, res) => {
  let newAccount = req.body;


  let id = newAccount.id;
  let name = newAccount.nome;
  let balance = newAccount.balance;


  fs.readFile(global.filename, "utf8", (err, data) => {
    try {
      if (err) throw err;

      let dataJson = JSON.parse(data);


      let oldIndex = dataJson.accounts.findIndex(account => account.id === id);

      dataJson.accounts[oldIndex].name = name;
      dataJson.accounts[oldIndex].balance = balance;


      fs.writeFile(global.filename, JSON.stringify(dataJson), err => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });


    } catch (err) {
      res.status(400).send({ err: err.message });
    }
  })
});

module.exports = router;