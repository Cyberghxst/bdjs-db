import { BaseFunction } from 'bdjs'

export default new BaseFunction({
    description: 'Filter all variables that met the condition.',
    parameters: [
        {
            name: 'Condition',
            description: 'Condition to filter variables.',
            required: true,
            resolver: 'String',
            value: 'none',
            compile: false
        },
        {
            name: 'Variable',
            description: 'Variable name to load the results to.',
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
    code: async (d, [condition, variable, table = 'main']) => {
        if (condition === undefined)
            throw new d.error(d, 'required', 'Condition', d.function!.name)
        if (variable === undefined)
            throw new d.error(d, 'required', 'Variable Name', d.function!.name)

        const records = d.bot?.vars?.getTable(table), results: string[] = []
        if (!records)
            throw new d.error(d, 'required', 'Table Name', d.function!.name)

        for (const [key, value] of Object.entries(records)) {
            d.cells.data.push({
                name: 'variableName',
                value: key
            },{
                name: 'variableValue',
                value
            })
        }

        for (const cell of d.cells.data) {
            const compiled = await d.reader.compile(
                d.cells.parse(
                    condition.trim(),
                    cell.name,
                    cell.value
                ),
                d
            )

            const solves = d.condition.evaluate(compiled.code)
            if (solves) results.push(cell.value)

        }

        d.cells.data.length = 0
        d.setEnvironmentVariable(variable, results)
    }
})