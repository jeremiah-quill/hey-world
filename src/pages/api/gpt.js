import { Configuration, OpenAIApi } from "openai";
import { getServerSession, authOptions } from "next-auth/next";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  analytics: true,
  limiter: Ratelimit.slidingWindow(1, "10s"),
});

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { conversation, key, useUserKey } = req.body;

  const useKey = getKey(session, key, useUserKey);

  try {
    // if session is found and user has not selected to use their own key, check the rate limit on the identifier (email)
    if (session && !useUserKey) {
      const identifier = session?.user?.email;
      const { success } = await ratelimit.limit(identifier);

      // if rate limit fails, send error message to client and early return
      if (!success) {
        res.status(429).json({
          error:
            "Too many messages in a short amount of time. Please enter your OpenAI API key and choose 'Use personal key' option in settings.",
        });
        return;
      }
    }

    // if rate limit is successful, send request to OpenAI API with the app key
    // of
    // if session is not found/user chose to use their own key, send request with user key
    const configuration = new Configuration({
      apiKey: useKey,
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
    // send error message to client
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

function getKey(session, key, useUserKey) {
  if (session) {
    if (!useUserKey) {
      return process.env.OPENAI_API_KEY;
    } else {
      return key;
    }
  } else {
    return key;
  }
}
