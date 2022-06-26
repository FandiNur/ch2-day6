const {Pool} = require('pg')

const dbPool = new Pool({
  database: 'personal_web_fn',
  port: '5432',
  user: 'postgres',
  password:'1',
})

module.exports = dbPool