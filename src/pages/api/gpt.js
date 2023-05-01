import { Configuration, OpenAIApi } from "openai";
import { getServerSession, authOptions } from "next-auth/next";

export default async function handler(req, res) {
  // const session = await getServerSession(req, res, authOptions);

  // if (!session) {
  //   res.status(401).json({ error: "Unauthorized" });
  //   return;
  // } else {
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
  // }
}

//   const { conversation, key } = req.body;

//   const configuration = new Configuration({
//     apiKey: key || process.env.OPENAI_API_KEY,
//   });

//   const openai = new OpenAIApi(configuration);

//   const response = await openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "system",
//         content: `Forget all previous instructions. You are a world class web interface designer and developer tasked with helping users build with HTML and CSS. Users will ask you questions about a feature, component, web technology, layout, etc. You will answer their questions and help them build what they want. If the user asks specifically for code, please only respond wth the minimal explanation.  Please only respond using markdown.`,
//       },
//       ...conversation,
//     ],
//   });

//   res.status(200).json(response.data);
// }

// import { getServerSession } from "next-auth/next"

// export default async function handler (req, res) {
//   const session = await getServerSession(req, res, authOptions)
//   if (session) {
//     res.send({
//       content:
//         "This is protected content. You can access this content because you are signed in.",
//     })
//   } else {
//     res.send({
//       error: "You must be signed in to view the protected content on this page.",
//     })
//   }
// }
