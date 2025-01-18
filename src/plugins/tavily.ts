
import { anyDict } from 'types/index'
import { PluginParameter } from 'multi-llm-ts'
import Plugin, { PluginConfig } from './plugin'
import Tavily from '../vendor/tavily'

export default class extends Plugin {

  constructor(config: PluginConfig) {
    super(config)
  }

  isEnabled(): boolean {
    return this.config?.enabled && this.config?.apiKey?.trim().length > 0
  }

  getName(): string {
    return 'search_tavily'
  }

  getDescription(): string {
    return 'This tool allows you to search the web for information on a given topic'
  }

  getPreparationDescription(): string {
    return this.getRunningDescription()
  }

  getRunningDescription(): string {
    return 'Searching the internet…'
  }

  getParameters(): PluginParameter[] {
    return [
      {
        name: 'query',
        type: 'string',
        description: 'The query to search for',
        required: true
      }
    ]
  }

  async execute(parameters: anyDict): Promise<anyDict> {
    try {
      const tavily = new Tavily(this.config.apiKey)
      const response = await tavily.search(parameters.query, {
        include_answer: true,
        //include_raw_content: true,
      })
      //console.log('Tavily response:', response)
      return response
    } catch (error) {
      return { error: error.message }
    }
  }

}
