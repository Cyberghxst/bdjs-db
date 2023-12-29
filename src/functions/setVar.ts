import { BaseFunction } from 'bdjs'

export default new BaseFunction({
    description: 'Set a variable into the local storage.',
    parameters: [
        {
            name: 'Name',
            description: 'Variable name.',
            required: true,
            resolver: 'String',
            value: 'none'
        },
        {
            name: 'Value',
            description: 'Variable value.',
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
    code: async (d, [name, value, table = 'main']) => {
        if (name === undefined)
            throw new d.error(d, 'required', 'Variable Name', d.function!.name)
        if (value === undefined)
            throw new d.error(d, 'required', 'Variable Value', d.function!.name)

        await d.bot?.vars?.set(name, value, table)
    }
})