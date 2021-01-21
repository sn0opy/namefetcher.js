/*
 * Finds unknown fort names in any RM database and attempts to
 * find and update the name and images of them.
 *
 * Installation:
 * If you just downloaded the single file, you have to install the
 * requirements via: npm install axios mysql2
 *
 * If you cloned the whole repository, simply run: npm install
 *
 * Usage:
 *  - configure the script via either of theses options:
 *      option a)
 *        modify first few lines of name_fetcher.js to match your confguration
 *      option b)
 *        set the following environment variables to match your setup:
 *        - NF_TOKEN
 *        - NF_URL
 *        - NF_DB_HOST     (default: 127.0.0.1)
 *        - NF_DB_USER
 *        - NF_DB_PASSWORD
 *        - NF_DB_DATABASE
 *        - NF_DB_PORT     (default: 3306)
 *  - run: node name_fetcher.js
 *
 * Changelog:
 *   2019-11-28:
 *   - modified queries to exclude sponsored stops - we don't have names for them anyway
 *   2019-12-02:
 *   - further improved exclusion check for sponsored stops
 *   - print a proper error message and exit if the API is down
 *   - print a proper error message if npm packages are not installed
 *   - improved progress messages
 *   2019-12-28:
 *   - fixed gyms/stops IDs not ending with .16 not being sent to API
 *   - fixed random issue where names weren't updated
 *   - made logging a bit more structured
 *   - general code refactoring/cleanup
 *   2021-01-19:
 *   - update API domain from .de to .eu
 *   2021-01-20:
 *   - initial public Github release
 *   - proper error handling
 *   2021-01-21:
 *   - add ability to set environment variables instead of modifying the script
*/

let token = '' // the one provided on Discord with this script
let url = ''   // also provided on Discord
let dbConfig = {
  'host': '127.0.0.1',
  'user': '',
  'password': '',
  'database': '',
  'port': '3306',
}

// don't edit anything below this line
try {
  console.log('Starting namefetcher')

  // prefer env variables
  token = process.env.NF_TOKEN || token
  url = process.env.NF_URL || url
  dbConfig.host = process.env.NF_DB_HOST || dbConfig.host
  dbConfig.user = process.env.NF_DB_USER || dbConfig.user
  dbConfig.password = process.env.NF_DB_PASSWORD || dbConfig.password
  dbConfig.database = process.env.NF_DB_DATABASE || dbConfig.database
  dbConfig.port = process.env.NF_DB_PORT || dbConfig.port

  if (!token || !url) {
    console.error(`Please make sure that the url and token variables are set`)
    process.exit(1)
  }

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database || !dbConfig.port) {
    console.error(`Please make sure that your db configuration is properly set`)
    process.exit(1)
  }

  const axios = require('axios')
  const mysql = require('mysql2')
  const db = mysql.createConnection(dbConfig)
  const settings = {
    gym: { table: 'gymdetails', imageCol: 'url', id: 'gym_id', type: 'gyms' },
    stop: { table: 'pokestop', imageCol: 'image', id: 'pokestop_id', type: 'stops' }
  }

  async function dbUpdate(data, settings) {
    for (detail of data) {
      console.log(` --> Updating ${detail.id}: ${detail.name}`)
      if (detail.imageUrl == null || detail.imageUrl === '?') {
        await db.promise().execute(`UPDATE ${settings.table} set name=? WHERE ${settings.id}=?`, [detail.name, detail.id])
      } else {
        await db.promise().execute(`UPDATE ${settings.table} set name=?, ${settings.imageCol}=? WHERE ${settings.id}=?`, [detail.name, detail.imageUrl, detail.id])
      }
    }
  }

  async function askApiAndUpdate(req, settings) {
    let count = 0
    for(i=0, j=req.length, c=50; i < j; i += c) {
      const payload = Array.from(req.slice(i, i + c), r => r.id)

      console.log(`Chunk ${i/c+1}/${Math.ceil(req.length/c)} (${payload.length} ${settings.type})`)

      await axios.post(`${url}?token=${token}`, payload)
        .then(async response => {
          count += response.data.length
          await dbUpdate(response.data, settings)
        })
    }
    return count
  }

  (async () => {
    for (x of Object.keys(settings)) {
      await db.promise().query(`SELECT ${settings[x].id} as id FROM ${settings[x].table} WHERE (name IS NULL OR name="unknown") AND LENGTH(${settings[x].id}) > 32`)
        .then(async ([dbret]) => {
          console.log(`\nRequesting ${dbret.length} unknown ${x.type} from API`)
          const count = await askApiAndUpdate(dbret, settings[x])
          console.log(`API returned ${count} ${x} names`)
        })
    }
  })().then(() => {
    console.log("\nBye!")
    db.end()
    process.exit(0)
  }).catch(e => {
    if (e.sqlMessage) {
      console.error("Error while connecting to your database:\n")
      console.log(e.sqlMessage)
    } else if (e.response && e.response.status >= 400) {
      console.error("Error while requesting data from the API. Received:\n")
      console.log(`${e.response.status} ${e.response.statusText}: ${e.response.data.error}`)
    } else if (e.code) {
      console.error("Unknown error while requesting data from the API. Received:\n")
      console.log(e.code)
    } else {
      console.error("There was an unknown error:\n")
      console.log(e)
    }

    db.end()
    process.exit(1)
  })
} catch(e) {
  if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
    console.log('Cannot load requirements! please run `npm i mysql2 axios` first!')
    process.exit(1)
  } else {
    console.log(e)
  }
}
