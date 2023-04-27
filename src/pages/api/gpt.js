import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  const { conversation, key } = req.body;

  const configuration = new Configuration({
    apiKey: key || process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `Forget all previous instructions. You are a world class web interface designer and developer tasked with helping users build with HTML and CSS. Users will ask you questions about a feature, component, web technology, layout, etc. You will answer their questions and help them build what they want. If the user asks specifically for code, please only respond wth the minimal explanation.  Please only respond using markdown.`,
      },
      ...conversation,
    ],
  });

  res.status(200).json(response.data);
}
