import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const { email, featureDescription } = req.body;

  const supabaseUrl = "https://clkntrxfgwioyoenfxys.supabase.co";
  const supabaseKey = process.env.SUPABASE_KEY;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("feature_requests")
      .insert([{ email: email, feature_description: featureDescription }]);

    return res.status(200).json({ message: "Awesome! We will check out your suggestion." });
  } catch (error) {
    // Catch and log errors - return a 500 with a message
    console.error(error);
    res.status(500).send({ message: "Sorry, there was an error on the server!" });
  }
}
