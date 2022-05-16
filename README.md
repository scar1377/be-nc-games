# Northcoders House of Games API

<u>please follow the steps</u>

Clone the repository

```
git clone https://github.com/scar1377/be-nc-games.git
```

Install the required dependencies by using

```
npm i
```

### **Connecting to different PostgreSQL databases**

In order to use `node-postgres` to connect to different databases, we need two .env files. Duplicate the `.env-example` and rename both of them to `.env.test` and `.env.development`.

in `.env.development`

```
PGDATABASE=development_database_name
```

in `.env.test`

```
PGDATABASE=test_database_name
```
