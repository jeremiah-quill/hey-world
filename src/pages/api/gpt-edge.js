import { getToken } from "next-auth/jwt";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  analytics: true,
  limiter: Ratelimit.slidingWindow(1, "10s"),
});

export const config = {
  runtime: "edge",
};

const handler = async (req) => {
  try {
    const session = await getToken({
      req,
    });

    const {
      prompt,
      conversation: messages,
      key,
      useUserKey,
    } = await req.json();

    // const useKey = getKey(session, key, useUserKey);

    const model = { id: "gpt-3.5-turbo" };

    if (session && !useUserKey) {
      const identifier = session?.user?.email;
      const { success } = await ratelimit.limit(identifier);

      // if rate limit fails, send error message to client and early return
      if (!success) {
        return new Response(
          JSON.stringify({
            error:
              "Too many messages in a short amount of time. Please wait a few seconds and try again, or enter your own OpenAI API key and choose 'Use personal key' option in settings.",
          })
        );

        // res.status(429).json({
        //   error:
        //     "Too many messages in a short amount of time. Please wait a few seconds and try again, or enter your own OpenAI API key and choose 'Use personal key' option in settings.",
        // });
        // return;
      }
    }

    // let promptToSend = prompt;
    // if (!promptToSend) {
    //   promptToSend =
    //     "Forget all previous instructions. You are a world class web interface designer and developer tasked with helping users build with HTML and CSS. Users will ask you questions about a feature, component, web technology, layout, etc. You will answer their questions and help them build what they want. If the user asks specifically for code, please only respond wth the minimal explanation.  Please only respond using markdown.";
    // }

    // let messagesToSend = [];

    // for (let i = messages.length - 1; i >= 0; i--) {
    //   const message = messages[i];

    //   messagesToSend = [message, ...messagesToSend];
    // }

    let url = `https://api.openai.com/v1/chat/completions`;

    const useKey = getKey(session, key, useUserKey);

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${useKey}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: model.id,
        messages: [
          {
            role: "system",
            content:
              "Forget all previous instructions. You are a world class web interface designer and developer tasked with helping users build with HTML and CSS. Users will ask you questions about a feature, component, web technology, layout, etc. You will answer their questions and help them build what they want. If the user asks specifically for code, please only respond wth the minimal explanation.  Please only respond using markdown.",
          },
          ...messages,
        ],
        max_tokens: 1000,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    if (error) {
      return new Response({ error: error.message });
    } else {
      return new Response({ error: 500 });
    }
  }
};

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

export default handler;
