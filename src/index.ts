#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.SIGNINSPIRE_API_KEY;
const API_BASE_URL = process.env.SIGNINSPIRE_API_URL || "https://api.signinspire.com.au/v1";

if (!API_KEY) {
  console.error("Error: SIGNINSPIRE_API_KEY environment variable is required.");
  process.exit(1);
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
});

const server = new Server(
  {
    name: "sign-inspire-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_locations",
        description: "List all digital signage locations and their current status.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "list_media",
        description: "List all available media assets in the Sign Inspire library.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "create_campaign",
        description: "Create a new digital signage campaign and publish it to specified screens.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Campaign name" },
            media_ids: { type: "array", items: { type: "string" }, description: "Array of media IDs to play" },
            location_ids: { type: "array", items: { type: "string" }, description: "Array of location/screen IDs" },
            start_date: { type: "string", description: "ISO 8601 start date" },
            end_date: { type: "string", description: "ISO 8601 end date" }
          },
          required: ["name", "media_ids", "location_ids"],
        },
      },
      {
        name: "get_screen_status",
        description: "Get real-time playback and online status of a specific screen.",
        inputSchema: {
          type: "object",
          properties: {
            screen_id: { type: "string", description: "The ID of the screen" }
          },
          required: ["screen_id"],
        },
      }
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (name === "list_locations") {
      const response = await axiosInstance.get("/locations");
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }
    
    if (name === "list_media") {
      const response = await axiosInstance.get("/media");
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }

    if (name === "create_campaign") {
      const response = await axiosInstance.post("/campaigns", args);
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }

    if (name === "get_screen_status") {
      const response = await axiosInstance.get(`/screens/${args?.screen_id}/status`);
      return { content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }] };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    return {
      content: [{ type: "text", text: `Error executing tool: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Start the server
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Sign Inspire MCP Server running on stdio");
}

run().catch(console.error);
