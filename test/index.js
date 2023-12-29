const { Bot } = require('bdjs')
const { config } = require('dotenv')
const { LocalStorage } = require('../dist/index')

config()

const storage = new LocalStorage({
    tables: [{
        name: 'main',
        mod: 'main.json'
    }],
    mod: './database/',
    autoSave: true
})

const client = new Bot({
    auth: process.env.token,
    events: [
        'onMessageCreate',
        'onReady'
    ],
    intents: [
        'Guilds',
        'GuildMessages',
        'MessageContent'
    ],
    plugins: [
        storage
    ],
    prefixes: [
        '+'
    ]
})

storage.variables({
    message: 'default_one'
})

client.commands.add({
    type: 'ready',
    code: `
        $print[$clientGet[username] is connected!]
        $print[Starting process...]

        $await[1s]
        $print[$getVar[message]]

        $await[1s]
        $setVar[message;Hello world from LocalStorage]

        $await[1s]
        $print[This var exists?: $hasVar[message]]

        $await[1s]
        $print[$getVar[message]]

        $await[1s]
        $deleteVar[message]

        $await[1s]
        $print[This var exists?: $hasVar[message]]

        $await[1s]
        $print[Process finished!]
    `
},{
    type: 'ready',
    code: `
        $print[Setting a timed variable...]
        $print[TIMED_VAR_EXISTS: $hasTimedVar[message]]
        $setTimedVar[message;HELLO TIMED MESSAGE;1m]
        $await[1s]
        $print[TIMED_VAR_EXISTS: $hasTimedVar[message]]
        $await[1s]
        $print[TIMED_VAR_VALUE: $getTimedVar[message]]
        $await[1m]
        $print[TIMED_VAR_EXISTS: $hasTimedVar[message]]
        $await[1s]
        $print[TIMED_VAR_VALUE: $getTimedVar[message]]
    `
})

client.login()