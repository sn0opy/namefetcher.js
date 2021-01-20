# namefetcher

Finds unknown fort names in any RM database and attempts to
find and update the name and images of them.

## Installation

If you just downloaded the single file, you have to install the
requirements via: `npm install axios mysql2`

If you cloned the whole repository, simply run: `npm install`

## Usage
 - modify first few lines of name_fetcher.js to match your confguration
 - run: `node name_fetcher.js`

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
