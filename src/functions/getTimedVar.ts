import { BaseFunction } from 'bdjs'
import { Timeout } from 'collie-db'

/**
 * Check if the given object belongs to a timed var.
 * @param value - Timed variable object.
 * @returns {boolean}
 */
export function isTimedVar(value: Timeout) {
    if (typeof value !== 'object') return false
    if (Array.isArray(value)) return false
    return 'expires' in value && 'value' in value && 'time' in value && 'id' in value
}

/**
 * Unpacks the value of a timed var.
 * @param data - Timed variable object.
 * @returns {string}
 */
function unpackTimedVar(data: Timeout) {
    return data.value as string
}

export default new BaseFunction({
    description: 'Get a timed variable from the local storage.',
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
        if (!isTimedVar(variable))
            throw new d.error(d, 'invalid', 'Timed Variable', d.function!.name)

        return unpackTimedVar(variable)
    }
})