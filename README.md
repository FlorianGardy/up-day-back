# UP Day

UP Day is an application dedicated to physiotherapist specialised in re-education of the perineum, to track micturition events from there patient.

There are 3 parts in this project :

- [Doctors](https://github.com/WildCodeSchool/biarritz_0319_kine_admin)
  - Tracks patients' events
- [Patients](https://github.com/WildCodeSchool/biarritz_0319_kine_front)
  - Adds and tracks their own events
- [Server](https://github.com/WildCodeSchool/biarritz_0319_kine_back) <- You are here
  - Sends, saves and receives data

## Stack

`NodeJs` `HAPI` `Sequelize` `Postgres` `Mocha`

## Directories

```App
└── src
    ├── db
    ├── plugins
    ├── routes
    ├── index.js
    └── server.js
```

`db` contains database models and functions
`plugins` contains plugins (auth)
`routes` server's routes (REST)

## Installation

### Install App

```sh
git clone git@github.com:WildCodeSchool/biarritz_0319_kine_back.git
cd biarritz_0319_kine_back
npm install
```

### Databases

You'll need 2 databases, one for production mode, a second for test (will be wiped before each test)

### .Env

```php
# Databases infos
## PROD
DB_HOST=prodDbServer
DB_NAME=prodDbName
DB_PORT=prodDbPort
DB_USER=prodDbUser
DB_PASS=prodDbPassword

## TEST
DB_HOST_TEST=testDbServer
DB_NAME_TEST=testDbName
DB_PORT_TEST=testDbPort
DB_USER_TEST=testDbUser
DB_PASS_TEST=testDbPassword

# SERVER PORT (OPTIONAL | 3030 by default)
PORT=3000

# JSON WEB TOKEN
SERVER_JWT_SECRET=YourTokenHere
```

### Start App

`npm start` to start server.

## Tests

`npm test` to launch integration tests.

## Team

[Perrine Martyris](https://www.linkedin.com/in/perrinemartyris/)

[Laura Bolea](https://www.linkedin.com/in/laura-bolea/)

[Florian Gardy](https://www.linkedin.com/in/florian-gardy/)

[Nizar Slama](https://www.linkedin.com/in/nizar-slama-197b3b182/)

[Jonathan Galvao-Diniz](https://www.linkedin.com/in/jonathan-galvao-diniz/)


## License

UP Day is open source software [licensed as MIT](https://github.com/WildCodeSchool/biarritz_0319_kine_admin/blob/master/LICENSE).
