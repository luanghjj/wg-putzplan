const { createClient } = require("@supabase/supabase-js");
const sb = createClient("https://bczqgejppndxmdyudtva.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjenFnZWpwcG5keG1keXVkdHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTY3MzYsImV4cCI6MjA5MDYzMjczNn0.GAiGmwOhrTMrmQ-3fnWYpW2vxGw5eEd9RU5MQfeKat0");

(async () => {
  // Delete all daily completions with day=null
  const { data, error } = await sb.from("completions").delete().eq("area_id", "daily").is("day", null).select();
  console.log(error ? "❌ " + error.message : "✅ Deleted " + data.length + " old daily completions (day=null)");

  // Verify remaining
  const { count } = await sb.from("completions").select("*", { count: "exact", head: true });
  console.log("📊 Remaining completions:", count);
})();
