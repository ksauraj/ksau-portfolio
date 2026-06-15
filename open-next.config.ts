import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const cloudflareConfig = defineCloudflareConfig({
  // Add your Cloudflare-specific overrides here if needed
});

export default {
  ...cloudflareConfig,
  buildCommand: "npx next build",
};
