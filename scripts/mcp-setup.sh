#!/bin/bash
# Nexa MCP Setup Script

echo "=== Nexa MCP Setup ==="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js first."
    exit 1
fi

echo "✅ npx found: $(npx --version)"
echo ""

# Install MCP packages
echo "📦 Installing MCP packages..."
echo ""
echo "1. Installing filesystem MCP..."
npm install -g @modelcontextprotocol/server-filesystem 2>&1 | tail -3
echo "   ✅ Done"
echo ""

echo "2. Installing GitHub MCP..."
npm install -g @modelcontextprotocol/server-github 2>&1 | tail -3
echo "   ✅ Done"
echo ""

echo "3. Setting up Figma MCP..."
chmod +x /home/ubuntu/project/Nexa/scripts/figma-mcp-server.js
echo "   ✅ Custom Figma MCP server ready"
echo ""

echo "✅ All MCP packages installed!"
echo ""
echo "=== Next Steps ==="
echo ""
echo "1. Set environment variables:"
echo "   export FIGMA_API_KEY='your-figma-token'"
echo "   echo 'export FIGMA_API_KEY=\"your-figma-token\"' >> ~/.bashrc"
echo ""
echo "2. Configure Claude Code (add to ~/.claude/settings.json):"
echo '   {'
echo '     "mcpServers": {'
echo '       "filesystem": {"command": "npx", "args": ["@modelcontextprotocol/server-filesystem", "/home/ubuntu/project/Nexa"]},'
echo '       "figma": {"command": "node", "args": ["/home/ubuntu/project/Nexa/scripts/figma-mcp-server.js"], "env": {"FIGMA_API_KEY": "${FIGMA_API_KEY}"}},'
echo '       "github": {"command": "npx", "args": ["@modelcontextprotocol/server-github"]}'
echo '     }'
echo '   }'
echo ""
echo "3. Restart Claude Code"
echo ""
echo "Done! 🚀"
