import { BaseFunction } from 'bdjs'
import ms from 'ms'

export default new BaseFunction({
    description: 'Set a timed variable into the local storage.',
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
            name: 'Time',
            description: 'Time for the variable to stay in the local storage.',
            required: true,
            resolver: 'Number',
            value: 'none'
        }
    ],
    code: async (d, [name, value, duration]) => {
        if (name === undefined)
            throw new d.error(d, 'required', 'Variable Name', d.function!.name)
        if (value === undefined)
            throw new d.error(d, 'required', 'Variable Value', d.function!.name)
        if (duration === undefined)
            throw new d.error(d, 'required', 'Variable Duration', d.function!.name)

        const parsedDuration = ms(duration)
        if (isNaN(parsedDuration))
            throw new d.error(d, 'invalid', 'Variable Duration', d.function!.name)

        await d.bot?.db.timeout(value, parsedDuration, name, '__bdjs__timeouts__')
    }
})