
const { Client, Pool } = require('pg/lib');
const expressServer = require('./js/express');

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  database: "countryprofiles",
  password: "root",
  port: 5432
});

//SELECT json_agg(t) FROM (SELECT * FROM countries NATURAL JOIN regions NATURAL JOIN population NATURAL JOIN economy ORDER BY countrykey ASC) t;
async function getData(){
  const query = 'SELECT json_agg(t) FROM (SELECT * FROM countries NATURAL JOIN regions NATURAL JOIN population NATURAL JOIN economy ORDER BY countrykey ASC) t;'
  const client = await pool.connect();
  const res = await client.query(query);
  client.release();
  return res.rows[0].json_agg;;
}
async function fetch(q){
  const query = q;
  const client = await pool.connect();
  const res = await client.query(query);
  client.release();
  return res.rows[0].json_agg;;
}

  const server = new expressServer(3000);

  //fetch data from database
  server.app.get('/data.json', async (req, res) => {
    res.json(await getData());
    });

  //fetch region surface areas from database
  server.app.get('/rsum.json', async (req, res) => {
    const q = "SELECT json_agg(t) FROM (SELECT regionkey, rname, SUM(surfacearea) surfacearea FROM regions NATURAL JOIN countries GROUP BY regionkey) t;";
    res.json(await fetch(q));
    });

    //get data by region key
    server.app.get('/query', async (req, res) => {
      let regionkey = req.query.regionkey;
      const q = `SELECT json_agg(t) FROM (SELECT * FROM countries NATURAL JOIN regions NATURAL JOIN population NATURAL JOIN economy WHERE regionkey=${regionkey} ORDER BY countrykey ASC) t;`;
      res.json(await fetch(q));
    });

    //get data by cname
    server.app.get('/search', async (req, res) => {
      let cname = req.query.cname;
      const q = `SELECT json_agg(t) FROM (SELECT * FROM countries NATURAL JOIN regions NATURAL JOIN population NATURAL JOIN economy WHERE countries.cname='${cname}' ORDER BY countrykey ASC) t;`;
      res.json(await fetch(q));
    });

  //fetch population from database
  server.app.get('/population.json', async (req, res) => {
    const q = "SELECT json_agg(t) FROM (SELECT countries.countrykey,cname, popnumber FROM population, countries WHERE population.countrykey = countries.countrykey ORDER BY population.popnumber DESC limit 10) t;";
    res.json(await fetch(q));
    });

    //gdp for each country
  server.app.get('/gdp.json', async (req, res) => {
    const q = "SELECT json_agg(t) FROM (SELECT countries.countrykey,cname, gdpval FROM economy, countries WHERE economy.countrykey = countries.countrykey ORDER BY economy.gdpval DESC limit 10) t;";
    res.json(await fetch(q));
    });
