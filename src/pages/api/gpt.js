import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { conversation } = req.body;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversation,
  });

  res.status(200).json(response.data);
}
