# namefetcher

Finds unknown fort names in any RM database and attempts to
find and update the name and images of them.

## Installation

If you just downloaded the single file, you have to install the
requirements via: `npm install axios mysql2`

If you cloned the whole repository, simply run: `npm install`

## Usage
  * configure the script via either of theses options:
    - option a) modify first few lines of `name_fetcher.js` to match your confguration
    - option b) set the following environment variables to match your setup:
      - NF_TOKEN
      - NF_URL
      - NF_DB_HOST     (default: 127.0.0.1)
      - NF_DB_USER
      - NF_DB_PASSWORD
      - NF_DB_DATABASE
      - NF_DB_PORT     (default: 3306)
      - NF_INTERVAL    (re-run every n hours, Docker only)
  * run: `node name_fetcher.js`

By default, this script will run perfectly well with any RM database. If
you like to use it with a different DB format, you can specify a custom JSON
formatted config file with adjusted column names via `NF_DB_COLS_CONF`. The
format should look like so:

```
{
  "gym": { "table": "gymdetails", "imageCol": "url", "id": "gym_id", "type": "gyms" },
  "stop": { "table": "pokestop", "imageCol": "image", "id": "pokestop_id", "type": "stops" }
}
```

## Changelog
  * 2021-09-21:
    - use regex instead of length check to search for IDs
  * 2021-01-20:
    - initial public Github release
    - proper error handling
  * 2021-01-21:
    - add ability to set environment variables instead of modifying the script
    - add ability to specify a different column format / names via `NF_DB_COLS_CONF`
  * 2021-02-20:
    - add Dockerfile

