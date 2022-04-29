
const { Client, Pool } = require('pg/lib');
const expressServer = require('./js/express');
var csv = require("csvtojson");
const { get } = require('express/lib/response');
var format = require('pg-format');


const pool = new Pool({
  host: "localhost",
  user: "postgres",
  database: "countryprofiles",
  password: "root",
  port: 5432
});

var data = [];

var regiontable;
var countrytable;

async function getRkeys(){
  const query = "SELECT * FROM regions";
  const client = await pool.connect();
  const result = await client.query(query);
  regiontable = result.rows;
  console.log(regiontable);
}

async function getCountries(){
  const query = "SELECT * FROM countries";
  const client = await pool.connect();
  const result = await client.query(query);
  countrytable = result.rows;
  //console.log(countrytable);
}

async function getRkey(rname){
  for (const t of regiontable){
    if (t['rname'] == rname){
      return t['regionkey'];
    }
  }
}
async function getCkey(cname){
  for (const t of countrytable){
    if (t['cname'] == cname){
      return t['countrykey'];
    }
  }
}
var country = [];
async function prepCountry(rname, cn, sa){
  var rkey = await getRkey(rname);
  country.push([rkey, cn, sa])
}
var pop = [];
async function prepPop(cname, dn, growthrate, sexratio, number, urban, urbanpopgr){
  var ckey = await getCkey(cname);
  pop.push([ckey,  dn, growthrate, sexratio, number, urban, urbanpopgr]);
}
var economy = [];
async function prepEconomy(cname, gdpval, gr, gdppercap, agric, indus, other, imports, exports, unemployment){
  var ckey = await getCkey(cname);
  economy.push([ckey, gdpval, gr, gdppercap, agric, indus, other, imports, exports, unemployment])
}

async function populateEconomy(){
  getCountries().then(async () => {
    await data.forEach(async (d) => {
      await prepEconomy(d['cName'], d['GDPval'], d['GDPGrowthRate'], d['GDPPerCapita'], d['EconomyAgriculture'], d['EconomyIndustry'], d['EconomyOther'], d['Imports'], d['Exports'], d['Unemployment']);
    });
    await insertEconomies();
  })
}


//populates the database with the data from the csv file
async function populateDatabase(){
  getCountries().then(async () => {
    await data.forEach(async (d) => {
      await prepCountry(d['rName'], d['cName'], d['SurfaceArea']);
    });
    await insertCountries();
  }).then(async () => {
    await data.forEach(async (d) => {
      await prepPop(d['cName'], d['Population'], d['GrowthRate'], d['SexRatio'], d['NumberOfCountries'], d['UrbanPop'], d['UrbanPopGrowthRate']);
    });
    await insertPops();
  }).then(async () => {
    await populateEconomy();
  }).catch(err => {
    console.log(err);
  }).finally(() => {
    pool.end();
  });
}


async function populatePopulation(){
  getCountries().then(async () => {
    await data.forEach(async (d) => {
      await prepPop(d['cName'], d['PopulationDensity'], d['PopulationGrowthRate'], d['SexRatio'], d['Number'], d['UrbanPopulation'], d['UrbanPopulationGrowthRate']);
    });
    await insertPopulation();
  })
}
async function insertCountries(){
  const query = "INSERT INTO countries(regionkey, cname, surfacearea) VALUES %L";
  const client = await pool.connect();
  const result = await client.query(format(query, country), [], (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res)
    }
  });
  country = [];
}
async function insertPopulation(){
    const query = "INSERT INTO population(countrykey, density, popgrowthrate, sexratio, popnumber, urbanpop, urbanpopgrowthrate) VALUES %L";
    const client = await pool.connect();
    const result = await client.query(format(query, pop), [], (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res)
      }
    });
    pop = [];
  }
async function insertEconomies(){
    const query = "INSERT INTO economy(countrykey, gdpval, gdpgrowthrate, gdppercapita, agriculture, industry, other, imports, exports, unemployment) VALUES %L";
    const client = await pool.connect();
    const result = await client.query(format(query, economy), [], (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res)
      }
    });
    economy = [];
  }
//Parsing
csv()
  .fromFile('./new_country_profile_variables.csv')
  .then(function(jsonArrayObj){ 
     jsonArrayObj.forEach(d => {
       var parsed = (function(){
         return {
            'cName' : d['country'],
            'SurfaceArea' : parseInt(d['SurfaceArea']),

            'Region' : d['Region'],
          
            'Number' : parseInt(d['Population']),
            'PopulationDensity' : parseFloat(d['PopulationDensity']),
            'PopulationGrowthRate' : parseFloat(d['PopulationGrowthRate']),
            'UrbanPopulation' : parseFloat(d['UrbanPopulation']),
            'UrbanPopulationGrowthRate' : parseFloat(d['UrbanPopulationGrowthRate']),
            'Unemployment' : parseFloat(d['Unemployment']),
            'SexRatio' : parseFloat(d['SexRatio']),

            'GDPval' : parseInt(d['GDP']),
            'GDPGrowthRate' : parseFloat(d['GDPGrowthRate']),
            'GDPPerCapita' : parseFloat(d['GDPPerCapita']),
            'EconomyAgriculture' : parseFloat(d['EconomyAgriculture']),
            'EconomyIndustry' : parseFloat(d['EconomyIndustry']),
            'EconomyOther' : parseFloat(d['EconomyOther']),
            'Imports' : parseInt(d['Imports']),
            'Exports' : parseInt(d['Exports']),
        }
      })();
      //push to data array
      data.push(parsed);
    });
   })

const server = new expressServer(3000);