# BDJS DB
A powerful plugin to bring BDJS local database support.

## Setup
```js
const { LocalStorage } = require('bdjs-db')
const { Bot } = require('bdjs')

const Database = new LocalStorage({
    tables: [{
        name: 'main',
        mod: 'main.json'
    }],
    mod: './database/',
    autoSave: true
})

Database.variables({
    message: 'hello world'
})

const bot = new Bot({
    ...
    plugins: [
        Database
    ]
})
```

## Quick Setup
You can use the `DefaultDataBaseOptions` function to generate default database options
```js
const { DefaultDataBaseOptions, LocalStorage } = require('bdjs-db')
const { Bot } = require('bdjs')

const Database = new LocalStorage(DefaultDataBaseOptions())

const bot = new Bot({
    ...
    plugins: [
        Database
    ]
})
```