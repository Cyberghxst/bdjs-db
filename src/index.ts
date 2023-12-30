import DataBase, { DataBaseOptions } from 'collie-db'
import { Bot, Plugin, VariableManager } from 'bdjs'
import { Handler } from './handler'
import { join } from 'path'

const BDJS_TIMEOUT = '__bdjs__timeouts__'

/**
 * Databse constructor options.
 */
export type DatabaseOptions = Omit<DataBaseOptions, 'timeoutsTable'>

/**
 * Represents a BDJS Local Storage.
 */
export class LocalStorage extends Plugin {
    #options: DataBaseOptions
    #wrapper: DataBase
    #vars: VariableManager
    constructor(options: DatabaseOptions) {
        super({
            name: 'BDJS DB',
            description: 'A powerful plugin to bring BDJS local database support.',
            version: require('../package.json').version
        });

        // Table management
        (options?.tables ?? []).push({ name: BDJS_TIMEOUT, mod: BDJS_TIMEOUT + '.json' });

        // Plugin essentials
        this.#options = { timeoutsTable: '__bdjs__timeouts__', ...options }
        this.#wrapper = new DataBase(this.#options)
        this.#vars = new VariableManager(
            options.tables.map(x => x.name).includes('main') 
                ? options.tables.map(x => x.name) : ['main', ...options.tables.map(x => x.name)],
            this.#wrapper
        )

        // Function loading
        this.load(join(__dirname, 'functions'), true)
    }

    /**
     * Creates the plugin setup.
     * @param bot - BDJS client.
     */
    async customSetup(bot: Bot) {
        bot.vars = this.#vars
        bot.db = this.#wrapper

        await this.#wrapper.init()
        Handler(this.#wrapper)
    }
}

/**
 * Default database options for quick sets.
 */
export function DefaultDataBaseOptions() {
    return {
        autoSave: true,
        mod: './database/',
        tables: [{
            name: 'main',
            mod: 'main.json'
        }]
    }
}