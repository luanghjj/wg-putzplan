const { createClient } = require("@supabase/supabase-js");
const sb = createClient("https://bczqgejppndxmdyudtva.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjenFnZWpwcG5keG1keXVkdHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTY3MzYsImV4cCI6MjA5MDYzMjczNn0.GAiGmwOhrTMrmQ-3fnWYpW2vxGw5eEd9RU5MQfeKat0");

(async () => {
  const { data } = await sb.from("completions").select("*").order("id");
  console.log("Total completions:", data?.length);
  const byPerson = {};
  data?.forEach((c) => {
    if (!byPerson[c.person]) byPerson[c.person] = { total: 0, verified: 0, count: 0 };
    byPerson[c.person].total += c.pts || 0;
    if (c.verified) byPerson[c.person].verified += c.pts || 0;
    byPerson[c.person].count++;
  });
  console.log("\nPoints by person:");
  for (const [p, v] of Object.entries(byPerson)) {
    console.log("  " + p + ": total=" + v.total + " verified=" + v.verified + " tasks=" + v.count);
  }
  console.log("\nSample:");
  data?.slice(0, 3).forEach((c) => console.log(JSON.stringify(c)));
})();
