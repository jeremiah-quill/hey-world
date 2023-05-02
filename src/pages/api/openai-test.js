import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  try {
    const { key } = req.body;

    const configuration = new Configuration({
      apiKey: key,
    });

    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `is this api key valid?`,
        },
      ],
    });

    res.status(200).json({ status: 200 });
  } catch (error) {
    const errorMessage = getErrorMessage(error.response.status);

    res.status(500).json({ error: errorMessage });
  }
}

function getErrorMessage(statusCode) {
  switch (statusCode) {
    case 401:
      return "Unauthorized: please enter a valid OpenAI API key";
    case 403:
      return "Forbidden";
    case 404:
      return "Not Found";
    case 405:
      return "Method Not Allowed";
    case 500:
      return "Internal Server Error";
    default:
      return "Something went wrong";
  }
}
