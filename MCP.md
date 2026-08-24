# Nexa MCP Configuration

## Environment Variables Setup

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Then fill in your API keys:
```env
FIGMA_API_KEY=your_figma_access_token_here
GITHUB_TOKEN=your_github_personal_access_token_here
```

## MCP Servers

### 1. Filesystem MCP
- **Purpose**: Access and manipulate project files
- **Scope**: `/home/ubuntu/project/Nexa`
- **Status**: ✅ Installed & Ready

### 2. Figma MCP
- **Purpose**: Connect to Figma for design assets, components, and specs
- **Requirements**: Figma API Key
- **Status**: ⚠️ Needs API Key
- **Features**:
  - Fetch design files
  - Extract components & styles
  - Get design specs & measurements
  - Sync design tokens

### 3. GitHub MCP
- **Purpose**: Git operations, PR management, issues
- **Requirements**: GitHub Personal Access Token
- **Status**: ⚠️ Needs Token
- **Features**:
  - Read/write repository files
  - Create & manage PRs
  - Access issues & PRs
  - Git operations

### 4. Docker MCP
- **Purpose**: Manage Docker containers & images
- **Status**: ❌ Not Available (package doesn't exist)
- **Alternative**: Use Docker CLI commands directly

## Setup Instructions

### Step 1: Get Figma API Token
1. Go to https://www.figma.com/developers/api
2. Navigate to "Your apps"
3. Click "Generate personal access token"
4. Copy the token

### Step 2: Get GitHub Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `workflow`
4. Generate and copy the token

### Step 3: Configure Environment
```bash
cd /home/ubuntu/project/Nexa
cp .env.example .env
# Edit .env and add your tokens
```

### Step 4: Configure Claude Code
Add to `~/.claude/settings.json`:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/home/ubuntu/project/Nexa"]
    },
    "figma": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-figma"],
      "env": { "FIGMA_API_KEY": "${FIGMA_API_KEY}" }
    },
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    }
  }
}
```

## Usage Examples

### With Figma Connected
```
"Fetch the login page design from Figma and implement it"
"Sync design tokens from Figma to our Tailwind config"
"Get component specs from Figma file ID: xyz123"
```

### With GitHub Connected
```
"Create a branch and PR for the new dashboard feature"
"Check open issues related to auth module"
"Review and merge PR #123"
```

## Security Notes

- Never commit `.env` file to git
- Use separate tokens for development/production
- Rotate tokens regularly
- MCP servers run locally - your API keys stay on your machine
