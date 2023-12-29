import { BaseFieldOptions } from 'bdjs/dist/structures/Function'
import { cp, readdir, writeFile } from 'fs/promises'
import { AsciiTable3 } from 'ascii-table3'
import { BDJSLog } from 'bdjs'
import { join } from 'path'

interface FunctionExtraOptions {
    /** If function supports builders. */
    builders: boolean
    /** If function supports injection. */
    injection: boolean
    /** Function parameters, if any. */
    params: BaseFieldOptions[]
}

/**
 * Represents a function documentation.
 */
class FunctionInfo {
    name: string;
    description: string;
    extraOptions: FunctionExtraOptions;
    constructor(name: string, description: string, extraOptions: FunctionExtraOptions) {
        this.name = name
        this.description = description
        this.extraOptions = extraOptions
    }

    /**
     * Returns the parameter table as string.
     */
    getParamTable() {
        const table = new AsciiTable3()
        .setHeading('Name', 'Description', 'Type', 'Default value')
        .addRowMatrix(this.extraOptions.params.map(x => {
            return [x.name, x.description, x.resolver ?? 'String', x.value]
        }))
        .setStyle('github-markdown')

        return table.toString()
    }

    /**
     * Get the function source.
     */
    async getSource() {
        const url = `https://raw.githubusercontent.com/Cyberghxst/bdjs-db/main/src/functions/${this.name}.ts`
        const result = await fetch(url)
        if (!result.ok) return null
        const text = await result.text()
        return text
    }

    /**
     * Generates a markdown file from function data.
     */
    async toMD() {
        const args = (this.extraOptions.params?.length ?? 0) > 0 ? `## Parameters\n${this.getParamTable()}` : undefined
        const special = (this.extraOptions.builders && this.extraOptions.injection) ? `## Extra Data\n> Supports Builders\n> Supports Injection` : this.extraOptions.builders ? `## Extra Data\n> Supports Builders` : this.extraOptions.injection ? `## Extra Data\n> Supports Injection` : undefined
        return [
            `# $${this.name}`,
            this.description,
            '## Usage',
            `> \`${this.usage}\``,
            args,
            special,
            /*'## Source Code',
            '```ts',
            await this.getSource(),
            '```',
            `Available on GitHub: [Click Here](${this.url})`*/
        ].filter(line => !!line).join('\n')
    }

    /**
     * Returns the function URL.
     */
    get url() {
        return `https://raw.githubusercontent.com/Cyberghxst/bdjs-db/main/src/functions/${this.name}.ts`
    }

    /**
     * Get the function usage as string.
     */
    get usage() {
        const args = (this.extraOptions.params.length ?? 0) > 0 ? this.extraOptions.params.map(x => x.required ? x.name.toLowerCase() : x.name.toLowerCase() + '?') : []
        return `$${this.name + (args.length > 0 ? '[' + args.join(';') + ']' : '')}`
    }
}

export class Generators {
    /**
     * Get the documentation of a function.
     * @param output_dir - Output directory (without filename).
     */
    static async getFunctionDoc(output_dir: string) {
        const files = (await readdir(join(process.cwd(), 'dist/functions'))).filter(file => file.endsWith('.js'))
        for (const file of files) {
            BDJSLog.debug('Encoding ' + file)
            const func = require(join(process.cwd(), 'dist/functions', file)).default
            const doc = new FunctionInfo(file.slice(0, -3), func.description, {
                builders: func.builders ?? false,
                injection: func.injectable ?? false,
                params: func.parameters ?? []
            })
            await writeFile(join(process.cwd(), output_dir, file.replace('.js', '.md')), (await doc.toMD()))
        }
    }
    
    /**
     * Get the sidebar for documentation.
     * @param output_dir - Output directory (without filename).
     */
    static async getSideBar(output_dir: string) {
        const files = (await readdir(join(process.cwd(), 'dist/functions'))).filter(file => file.endsWith('.js'))
        await writeFile(join(process.cwd(), output_dir, 'sidebar.md'), `**Home**\n* [Getting Started](README.md)\n\n**Functions**\n${files.map(t => `* [$${t.slice(0, -3)}](functions/${t.slice(0,-3)}.md)`).join('\n')}`)
    }

    /**
     * Saves all function data in a JSON object.
     */
    static async getSchema() {
        const files = (await readdir(join(process.cwd(), 'dist/functions'))).filter(file => file.endsWith('.js'))
        const datas: Record<string, any>[] = []
        for (const file of files) {
            BDJSLog.debug('Encoding ' + file)
            let func = require(join(process.cwd(), 'dist/functions', file)).default
            func.name = file.slice(0, -3)
            datas.push(JSON.parse(JSON.stringify(func)))
        }
        await writeFile(join(process.cwd(), 'schema.json'), JSON.stringify(datas, null, 4))
    }
}

async function main() {
    cp(join(process.cwd(), 'README.md'), join(process.cwd(), 'docs/README.md'))
    Generators.getFunctionDoc('docs/functions')
    Generators.getSideBar('docs')
    Generators.getSchema()
}

main().then(() => console.log('SOURCE_GENERATED!'))