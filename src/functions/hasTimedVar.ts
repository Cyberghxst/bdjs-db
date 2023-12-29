import { BaseFunction } from 'bdjs'

export default new BaseFunction({
    description: 'Check if a timed variable exists in the local storage.',
    parameters: [
        {
            name: 'Name',
            description: 'Variable name.',
            required: true,
            resolver: 'String',
            value: 'none'
        }
    ],
    code: async (d, [name]) => {
        if (name === undefined)
            throw new d.error(d, 'required', 'Variable Name', d.function!.name)
        
        const variable = await d.bot?.vars?.get(name, '__bdjs__timeouts__')
        
        return !!variable
    }
})