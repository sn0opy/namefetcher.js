# namefetcher

Finds unknown fort names in any RM database and attempts to
find and update the name and images of them.

## Installation

If you just downloaded the single file, you have to install the
requirements via: `npm install axios mysql2`

If you cloned the whole repository, simply run: `npm install`

## Usage
  * configure the script via either of theses options:
    - option a) modify first few lines of name_fetcher.js to match your confguration
    - option b) set the following environment variables to match your setup:
      - NF_TOKEN
      - NF_URL
      - NF_DB_HOST     (default: 127.0.0.1)
      - NF_DB_USER
      - NF_DB_PASSWORD
      - NF_DB_DATABASE
      - NF_DB_PORT     (default: 3306)
  * run: `node name_fetcher.js`

## Changelog
  * 2019-11-28:
    - modified queries to exclude sponsored stops - we don't have names for them anyway
  * 2019-12-02:
    - further improved exclusion check for sponsored stops
    - print a proper error message and exit if the API is down
    - print a proper error message if npm packages are not installed
    - improved progress messages
  * 2019-12-28:
    - fixed gyms/stops IDs not ending with .16 not being sent to API
    - fixed random issue where names weren't updated
    - made logging a bit more structured
    - general code refactoring/cleanup
  * 2021-01-19:
    - update API domain from .de to .eu
  * 2021-01-20:
    - initial public Github release
    - proper error handling
  * 2021-01-21:
    - add ability to set environment variables instead of modifying the script
