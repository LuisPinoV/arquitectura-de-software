const fs = require("fs");

if (!fs.existsSync("tf-outputs.json")) {
  console.error("❌ Missing tf-outputs.json. Aborting deployment.");
  process.exit(1);
}

console.log("✔ Terraform output file found. Deploying...");