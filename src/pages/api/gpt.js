import { Configuration, OpenAIApi } from "openai";
import { getServerSession, authOptions } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  try {
    const { conversation, key } = req.body;

    const configuration = new Configuration({
      apiKey: session ? process.env.OPENAI_API_KEY : key,
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
  } catch (error) {
    const errorMessage = getErrorMessage(error.response.status);

    res.status(500).json({ error: errorMessage });
  }
}

function getErrorMessage(statusCode) {
  switch (statusCode) {
    case 401:
      return "Unauthorized: please try again or enter a different OpenAI API key";
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
