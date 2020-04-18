const Alpaca = require("@alpacahq/alpaca-trade-api");
const { Parser } = require("json2csv");
const fs = require('fs');

const creds = require("./secret");

const config = {
  time: "day",
  symbols: ["AMD", "INTC"],
};

const alpaca = new Alpaca({
  keyId: creds.keyId,
  secretKey: creds.secretKey,
  paper: true,
});

// Get daily price data for AAPL over the last 5 trading days.
const barset = alpaca
  .getBars(config.time, config.symbols, {
    limit: 1000,
  })
  .then((barset) => {

    config.symbols.map((cur) => {
      const data = barset[cur];
      const opts = {
        fields: ['t','o','h','l','c','v']
      };

      try {
        const parser = new Parser(opts);
        const csv = parser.parse(data);
        const name = `${cur}_${config.time}.csv`;

        fs.writeFile(name, csv, err => {
            if (err) throw err;
            console.log(`${cur} file created.`)
        });


    } catch (err) {
        console.error(err);
      }
    });
  });
