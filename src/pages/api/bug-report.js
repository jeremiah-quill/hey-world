import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const { email, bugDescription } = req.body;

  const supabaseUrl = "https://clkntrxfgwioyoenfxys.supabase.co";
  const supabaseKey = process.env.SUPABASE_KEY;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("bug_reports")
      .insert([{ email: email, bug_description: bugDescription }]);

    return res.status(200).json({ message: "Thanks! We are on it." });
  } catch (error) {
    // Catch and log errors - return a 500 with a message
    console.error(error);
    res.status(500).send({ message: "Sorry, there was an error on the server!" });
  }
}
