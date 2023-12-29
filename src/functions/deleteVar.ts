import { BaseFunction } from 'bdjs'

export default new BaseFunction({
    description: 'Deletes a variable from the local storage.',
    parameters: [
        {
            name: 'Name',
            description: 'Variable name.',
            required: true,
            resolver: 'String',
            value: 'none'
        },
        {
            name: 'Table',
            description: 'Local storage table.',
            required: false,
            resolver: 'String',
            value: 'none'
        }
    ],
    code: async (d, [name, table = 'main']) => {
        if (name === undefined)
            throw new d.error(d, 'required', 'Variable Name', d.function!.name)

        await d.bot?.vars?.delete(name, table)
    }
})