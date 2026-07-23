# Sign Inspire MCP Server

[![npm version](https://badge.fury.io/js/%40signinspire%2Fmcp-server.svg)](https://badge.fury.io/js/%40signinspire%2Fmcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The official [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for **[Sign Inspire](https://signinspire.com.au/)**, a cloud-based Digital Signage platform. 

This server allows AI agents (like Claude Desktop, Cursor, or your custom agents) to seamlessly interact with your digital signage network. Manage screens, deploy campaigns, and check real-time playback status entirely through natural language.

## 🚀 Features

Exposes the core API capabilities of [Sign Inspire Digital Signage](https://signinspire.com.au/) to AI models:
- **`list_locations`**: View all active screens, kiosks, and digital menu boards across your locations.
- **`list_media`**: Access your cloud media library (images, videos, HTML widgets).
- **`create_campaign`**: Instantly schedule and publish new advertising content to specific displays.
- **`get_screen_status`**: Monitor real-time online status and current playback of any hardware player.

### 🗺️ Roadmap

We are actively working on migrating the remaining 20+ Sign Inspire API endpoints to this public MCP specification. Future updates will include playlist management, device reboot controls, and advanced screen telemetry.

## 💡 Example AI Interactions

Here are a few ways you can interact with the server via an AI assistant like Claude:

**1. Checking Screen Status**
> **You:** "Are there any screens currently offline in the Sydney office?"
> **AI:** *Calls `list_locations` and `get_screen_status`* -> "Screen ID `syd-lobby-1` is currently offline. The last heartbeat was 45 minutes ago."

**2. Deploying a Campaign**
> **You:** "Create a new campaign called 'Summer Promo' and deploy the beach video to all screens in the Melbourne store."
> **AI:** *Calls `list_media` to find the video ID, `list_locations` to find Melbourne screens, and `create_campaign` to publish* -> "Successfully created the 'Summer Promo' campaign and pushed it to 4 screens in Melbourne. It is now live."

## 📦 Installation & Usage

### Use with Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sign-inspire": {
      "command": "npx",
      "args": ["-y", "@signinspire/mcp-server"],
      "env": {
        "SIGNINSPIRE_API_KEY": "your_api_token_here"
      }
    }
  }
}
```

### Use with Cursor

1. Open Cursor Settings -> Features -> MCP
2. Click **+ Add New MCP Server**
3. Select type: `command`
4. Name: `Sign Inspire`
5. Command: `npx -y @signinspire/mcp-server`
6. Add the environment variable `SIGNINSPIRE_API_KEY`.

## 🔑 Getting an API Key

To use this MCP server, you need an active [Sign Inspire](https://signinspire.com.au/) workspace. 
1. Log in to your dashboard.
2. Navigate to **Developer Settings** > **API Keys**.
3. Generate a new token with `read/write` permissions.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the TypeScript project
npm run build

# Run locally
npm run start
```

## 🤝 Contributing

We welcome contributions! Whether it's adding support for new API endpoints or improving the documentation, please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---
*Powered by **[Sign Inspire - Cloud Digital Signage Software](https://signinspire.com.au/)***
