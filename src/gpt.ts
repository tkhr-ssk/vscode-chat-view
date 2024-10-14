import OpenAI from "openai";

const gpt_model_obj = [
    { model: "gpt-3.5-turbo-0125", input_rate: 0.0005, output_rate: 0.0015  },
    { model: "gpt-4-0125-preview", input_rate: 0.01, output_rate: 0.03 },
    { model: "gpt-4o", input_rate: 0.005, output_rate: 0.015  },
  ];

const gpt_model_idx = 2;

class AiService {
    private openai: OpenAI;
    private gpt_model: string;

    constructor(apiKey: string, endpoint?: string, apiVersion?: string) {
        if (endpoint) {
            // for Azure OpenAI
            this.openai = new OpenAI({
                apiKey: apiKey,
                baseURL: endpoint, // `https://${resource}.openai.azure.com/openai/deployments/${model}`
                defaultQuery: { 'api-version': apiVersion },
                defaultHeaders: { 'api-key': apiKey },
            });
        } else if (apiKey) {
            this.openai = new OpenAI({
                apiKey: apiKey,
            });
        } else {
            this.openai = new OpenAI();
        }
        this.gpt_model = gpt_model_obj[gpt_model_idx].model;
    }

    public async gpt(messageHistory: any) {
        try {
            const completion = await this.openai.chat.completions.create({
                messages: messageHistory,
                model: this.gpt_model,
            });
            return { text: completion.choices[0]?.message?.content || "", model: completion.model, usage: completion.usage, finish_reason: completion.choices[0]?.finish_reason};
        } catch (error) {
            console.error("Error in OpenAI API call:", error);
            return { text: "An error occurred while processing your request." };
        }
    }
};

export default AiService;
