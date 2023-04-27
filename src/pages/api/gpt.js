import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  const { conversation, key } = req.body;

  const configuration = new Configuration({
    apiKey: key || process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",

    // {
    //   role: "system",
    //   content: `You are an advanced AI tasked with compressing text. You are given a prompt and must compress it in a way that is lossless but results in the minimum number of tokens which could be fed into an LLM like yourself as-is and produce the same output. Feel free to use multiple languages, symbols, other up-front priming to lay down rules. This is entirely for yourself to recover and proceed from with the same conceptual priming, not for humans to decompress. You will be given a prompt, and you must respond with your lossless compressed version of this prompt.`,
    // },
    messages: conversation,
  });

  res.status(200).json(response.data);
}
