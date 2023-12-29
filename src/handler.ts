import DataBase from 'collie-db'

export function Handler (db: DataBase) {
    db.on('createTimeout', async (data) => {
        console.log('TIMEOUT_CREATED', data)
    })
    .on('expires', async (table) => {
        console.log(table)
    })
}