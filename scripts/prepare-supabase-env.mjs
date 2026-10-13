import fs from "node:fs";

const envPath = new URL("../.env", import.meta.url);
const text = fs.readFileSync(envPath, "utf8");
const lines = text.split(/\r?\n/);

function valueOf(name) {
  const line = lines.find((entry) => entry.startsWith(`${name}=`));
  if (!line) {
    return "";
  }

  return line.slice(name.length + 1).trim().replace(/`+$/g, "");
}

const databaseUrl = valueOf("DATABASE_URL");
let projectUrl = "";

try {
  const parsed = new URL(databaseUrl);
  const user = decodeURIComponent(parsed.username);
  const ref = user.split(".")[1] ?? "";
  if (ref) {
    projectUrl = `https://${ref}.supabase.co`;
  }
} catch {
  projectUrl = "";
}

const next = [];
let sawDatabase = false;
let sawUrl = false;

for (const line of lines) {
  if (!line) {
    continue;
  }

  if (line.startsWith("DATABASE_URL=")) {
    next.push(`DATABASE_URL=${databaseUrl}`);
    sawDatabase = true;
    continue;
  }

  if (line.startsWith("EXPO_PUBLIC_SUPABASE_URL=")) {
    next.push(`EXPO_PUBLIC_SUPABASE_URL=${projectUrl || valueOf("EXPO_PUBLIC_SUPABASE_URL")}`);
    sawUrl = true;
    continue;
  }

  next.push(line);
}

if (sawDatabase && projectUrl && !sawUrl) {
  next.push(`EXPO_PUBLIC_SUPABASE_URL=${projectUrl}`);
}

if (!valueOf("EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY") && !next.some((line) => line.startsWith("EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY="))) {
  next.push("EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=");
}

fs.writeFileSync(envPath, `${next.filter(Boolean).join("\n")}\n`);
console.log(projectUrl ? "project url set" : "project url missing");
console.log(valueOf("EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ? "publishable key present" : "publishable key blank");
