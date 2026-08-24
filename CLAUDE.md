{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/home/ubuntu/project/Nexa"]
    },
    "figma": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-figma"],
      "env": {
        "FIGMA_API_KEY": "your-figma-api-key-here"
      }
    },
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-github-token-here"
      }
    },
    "docker": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-docker"]
    }
  }
}
