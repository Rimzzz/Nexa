#!/usr/bin/env node
/**
 * Custom Figma MCP Server
 * This server provides Figma API integration for Nexa project
 */

const { Server } = require('@modelcontextprotocol/sdk/server');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types');

const FIGMA_API_URL = 'https://api.figma.com/v1';

// In-memory storage for Figma data
let cachedFiles = {};
let figmaApiKey = process.env.FIGMA_API_KEY || '';

async function fetchFigmaData(endpoint) {
  if (!figmaApiKey) {
    throw new Error('FIGMA_API_KEY environment variable not set');
  }

  const response = await fetch(`${FIGMA_API_URL}${endpoint}`, {
    headers: {
      'X-Figmacolors(255, 107, 107);">oken': figmaApiKey
    }
  });

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function getFile(fileKey) {
  const cacheKey = `file:${fileKey}`;
  if (cachedFiles[cacheKey]) {
    return cachedFiles[cacheKey];
  }

  const data = await fetchFigmaData(`/files/${fileKey}`);
  cachedFiles[cacheKey] = data;
  return data;
}

async function getNodes(fileKey, nodeIds) {
  const nodes = Array.isArray(nodeIds) ? nodeIds.join(',') : nodeIds;
  const data = await fetchFigmaData(`/files/${fileKey}/nodes?ids=${nodes}`);
  
  // Cache each node
  if (data.nodes) {
    for (const [id, node] of Object.entries(data.nodes)) {
      cachedFiles[`node:${id}`] = node;
    }
  }
  return data;
}

async function getImage(fileKey, nodeIds, options = {}) {
  const nodes = Array.isArray(nodeIds) ? nodeIds.join(',') : nodeIds;
  const queryParams = new URLSearchParams({
    ids: nodes,
    format: options.format || 'png',
    scale: options.scale || 2,
    ...options
  });
  
  return `${FIGMA_API_URL}/images/${fileKey}?${queryParams.toString()}`;
}

const tools = [
  {
    name: 'figma_get_file',
    description: 'Get Figma file metadata and structure',
    inputSchema: {
      type: 'object',
      properties: {
        fileKey: {
          type: 'string',
          description: 'Figma file key (from URL: figma.com/file/{key}/...)'
        }
      },
      required: ['fileKey']
    }
  },
  {
    name: 'figma_get_nodes',
    description: 'Get specific nodes from a Figma file',
    inputSchema: {
      type: 'object',
      properties: {
        fileKey: {
          type: 'string',
          description: 'Figma file key'
        },
        nodeIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of node IDs to fetch'
        },
        depth: {
          type: 'number',
          description: 'Max depth to traverse'
        }
      },
      required: ['fileKey', 'nodeIds']
    }
  },
  {
    name: 'figma_get_image',
    description: 'Generate image URL for Figma nodes',
    inputSchema: {
      type: 'object',
      properties: {
        fileKey: {
          type: 'string',
          description: 'Figma file key'
        },
        nodeIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of node IDs'
        },
        format: {
          type: 'string',
          enum: ['png', 'svg', 'jpg', 'pdf'],
          default: 'png'
        },
        scale: {
          type: 'number',
          default: 2
        }
      },
      required: ['fileKey', 'nodeIds']
    }
  },
  {
    name: 'figma_search',
    description: 'Search for components in Figma file',
    inputSchema: {
      type: 'object',
      properties: {
        fileKey: {
          type: 'string',
          description: 'Figma file key'
        },
        query: {
          type: 'string',
          description: 'Search query'
        },
        type: {
          type: 'string',
          enum: ['FRAME', 'COMPONENT', 'TEXT', 'SHAPE'],
          description: 'Filter by node type'
        }
      },
      required: ['fileKey', 'query']
    }
  },
  {
    name: 'figma_get_styles',
    description: 'Get design styles from Figma file',
    inputSchema: {
      type: 'object',
      properties: {
        fileKey: {
          type: 'string',
          description: 'Figma file key'
        },
        styleType: {
          type: 'string',
          enum: ['TEXT', 'FILL', 'STROKE', 'EFFECT', 'GRID'],
          description: 'Type of style to fetch'
        }
      },
      required: ['fileKey']
    }
  }
];

const handlers = {
  'figma.get_file': async (params) => {
    const data = await getFile(params.fileKey);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2)
      }]
    };
  },
  
  'figma.get_nodes': async (params) => {
    const data = await getNodes(params.fileKey, params.nodeIds);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2)
      }]
    };
  },
  
  'figma.get_image': async (params) => {
    const imageUrl = await getImage(params.fileKey, params.nodeIds, params);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          imageUrl,
          fileKey: params.fileKey,
          nodeIds: params.nodeIds,
          format: params.format || 'png',
          scale: params.scale || 2
        }, null, 2)
      }]
    };
  },
  
  'figma.search': async (params) => {
    const data = await getFile(params.fileKey);
    
    // Simple search implementation
    const searchRecursive = (node, query, type) => {
      const results = [];
      const matchName = node.name?.toLowerCase().includes(query.toLowerCase());
      
      if (matchName && (!type || node.type === type)) {
        results.push({
          id: node.id,
          name: node.name,
          type: node.type
        });
      }
      
      if (node.children) {
        for (const child of node.children) {
          results.push(...searchRecursive(child, query, type));
        }
      }
      
      return results;
    };
    
    const results = searchRecursive(data.document, params.query, params.type);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ results, total: results.length }, null, 2)
      }]
    };
  },
  
  'figma.get_styles': async (params) => {
    const data = await getFile(params.fileKey);
    
    // Extract styles from document
    const styles = {
      TEXT: [],
      FILL: [],
      STROKE: [],
      EFFECT: [],
      GRID: []
    };
    
    const collectStyles = (node) => {
      if (node.style) {
        if (node.style.textStyleId) styles.TEXT.push(node.style.textStyleId);
        if (node.style.fills?.length > 0) styles.FILL.push(...node.style.fills);
        if (node.style.strokeWeight > 0) styles.STROKE.push(node.style.strokeWeight);
        if (node.style.effects?.length > 0) styles.EFFECT.push(...node.style.effects);
      }
      
      if (node.children) {
        for (const child of node.children) {
          collectStyles(child);
        }
      }
    };
    
    collectStyles(data.document);
    
    // Remove duplicates
    for (const key in styles) {
      styles[key] = [...new Set(styles[key])];
    }
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(styles, null, 2)
      }]
    };
  }
};

async function main() {
  const transport = new StdioServerTransport();
  const server = new Server({
    name: 'nexa-figma-mcp',
    version: '1.0.0'
  }, {
    capabilities: {
      tools: {}
    }
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const handler = handlers[request.params.name];
    if (!handler) {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }
    return handler(request.params.arguments);
  });

  await server.connect(transport);
  console.error('Nexa Figma MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
