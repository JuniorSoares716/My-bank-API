var express = require('express');

var fs = require('fs');

var router = express.Router();

//Rotas
router.post("/", (req, res) => {
  let account = req.body;

  fs.readFile(global.filename, "utf8", (err, data) => {
    if (!err) {

      try {
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
    }
  });
});

router.get('/', (req, res) => {
  fs.readFile(global.filename, "utf8", (err, data) => {
    if (!err) {
      let dataJson = JSON.parse(data);
      delete dataJson.nextId;
      res.send(dataJson);
    } else {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get('/:id', (req, res) => {
  let id = Number(req.params.id);
  fs.readFile(global.filename, "utf8", (err, data) => {
    if (!err) {
      let dataJson = JSON.parse(data);
      let accountFilter = dataJson.accounts.find(account => account.id === id);
      res.send(accountFilter);
    } else {
      res.status(400).send({ error: err.message });
    }
  });
});


module.exports = router;