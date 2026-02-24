/**
 * Blog post data structure.
 *
 * To add a new post, push a new object to this array.
 * Fields:
 *   slug         – URL-safe identifier (used in /blog/:slug)
 *   title        – Display title
 *   description  – Short summary for cards and SEO
 *   tags         – Array of keyword strings
 *   date         – ISO date string (YYYY-MM-DD)
 *   readingTime  – Human-readable estimate
 *   author       – Author name(s)
 *   category     – Uppercase label (DEEP DIVE, TUTORIAL, RESEARCH, etc.)
 *   content      – Full article as a Markdown string
 */

const a2aVsMcpContent = `
The age of standalone AI models is over. In 2025, two open standards emerged that are fundamentally reshaping how AI systems work: Google's **Agent2Agent (A2A)** protocol and Anthropic's **Model Context Protocol (MCP)**. Together, they answer two distinct but complementary questions:

- **MCP:** *How does an AI agent access tools, data, and context?*
- **A2A:** *How do AI agents talk to each other?*

If you're building anything with AI agents — from a campus chatbot to a multi-agent enterprise pipeline — understanding these protocols isn't optional anymore. This article breaks down both, compares them head-to-head, and shows you when to use which.

---

## Why Agent Protocols Matter

Imagine you've built an AI assistant that can search your club's knowledge base. Now imagine you want it to also:

- Book meeting rooms via a campus API
- Pull real-time data from a Google Sheet
- Delegate a research task to a specialized "researcher" agent
- Coordinate with a "writer" agent to draft a blog post

Without standards, each of these integrations requires custom glue code. MCP and A2A replace that chaos with clean, universal contracts.

---

## Part 1: MCP — The "USB-C Port for AI"

### What It Is

The **Model Context Protocol**, introduced by Anthropic in November 2024, standardizes how AI applications connect to external tools and data sources. Think of it as the universal adapter between an LLM and the outside world.

### Architecture

MCP uses a **client–server** model with three key roles:

\`\`\`
┌─────────────────────────────────────────────┐
│  HOST (Claude Desktop, IDE, Custom App)     │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ MCP      │  │ MCP      │  │ MCP      │  │
│  │ Client 1 │  │ Client 2 │  │ Client 3 │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
└───────┼──────────────┼──────────────┼───────┘
        │              │              │
   ┌────▼─────┐  ┌─────▼────┐  ┌─────▼────┐
   │ MCP      │  │ MCP      │  │ MCP      │
   │ Server A │  │ Server B │  │ Server C │
   │ (GitHub) │  │ (Slack)  │  │ (DB)     │
   └──────────┘  └──────────┘  └──────────┘
\`\`\`

- **Host**: The AI application (e.g., Claude Desktop, a Cursor IDE plugin)
- **Client**: Lives inside the host, manages connections to servers
- **Server**: Exposes specific capabilities — tools, resources, or prompts

### The Three Primitives

MCP servers expose three types of capabilities:

| Primitive | Description | Example |
|-----------|-------------|---------|
| **Tools** | Functions the AI can call | \`search_database()\`, \`send_email()\` |
| **Resources** | Read-only data the AI can access | File contents, API responses, DB records |
| **Prompts** | Reusable prompt templates | "Summarize this PR", "Explain this error" |

### Code Example: A Simple MCP Server

\`\`\`python
from mcp.server import Server
from mcp.types import Tool, TextContent

server = Server("campus-events")

@server.tool()
async def get_upcoming_events(
    club_name: str,
    limit: int = 5
) -> list[TextContent]:
    """Fetch upcoming events for a student club."""
    events = await db.query(
        "SELECT * FROM events WHERE club = ? LIMIT ?",
        [club_name, limit]
    )
    return [TextContent(
        type="text",
        text=format_events(events)
    )]

# Run on stdio (local) or HTTP (remote)
server.run()
\`\`\`

### Key Features (2025–2026)

- **OAuth 2.1 Authentication**: Servers are OAuth 2.0 Resource Servers with RFC 8707 resource binding
- **Structured Output**: Tools can return typed JSON (\`structuredContent\`) alongside human-readable text
- **Elicitation**: Servers can ask users mid-session questions via \`elicitation/create\`
- **Remote Servers**: Full support for HTTP-based remote MCP servers
- **Governance**: Donated to the **Agentic AI Foundation** (Linux Foundation) in December 2025, with OpenAI and Block as co-founders

---

## Part 2: A2A — Agent-to-Agent Communication

### What It Is

The **Agent2Agent Protocol**, launched by Google Cloud in April 2025, standardizes how AI agents discover, communicate with, and delegate tasks to other AI agents — regardless of vendor or framework.

While MCP connects agents to *tools*, A2A connects agents to *other agents*.

### Architecture

A2A is built on familiar web standards: **JSON-RPC 2.0 over HTTP(S)**.

\`\`\`
┌────────────────┐         ┌────────────────┐
│  CLIENT AGENT  │         │  REMOTE AGENT  │
│  (Orchestrator)│         │  (Specialist)  │
│                │  A2A    │                │
│  "Plan my      ├────────►│  "I can search │
│   research     │  HTTP/  │   arxiv, run   │
│   project"     │  SSE    │   experiments" │
│                │◄────────┤                │
└────────────────┘         └────────────────┘
                   Task lifecycle:
                   submitted → working →
                   input-required → completed
\`\`\`

### Agent Cards: Discovery

Every A2A-compatible agent publishes an **Agent Card** — a JSON document at \`/.well-known/agent.json\` that describes its capabilities:

\`\`\`json
{
  "name": "Research Assistant",
  "description": "Searches academic papers and summarizes findings",
  "url": "https://research-agent.example.com",
  "version": "1.0.0",
  "capabilities": {
    "streaming": true,
    "pushNotifications": true
  },
  "skills": [
    {
      "id": "arxiv-search",
      "name": "ArXiv Paper Search",
      "description": "Search and summarize papers from ArXiv",
      "tags": ["research", "papers", "academic"],
      "examples": [
        "Find recent papers on transformer architectures"
      ]
    }
  ],
  "authentication": {
    "schemes": ["OAuth2"]
  }
}
\`\`\`

### Task Lifecycle

A2A models work as **Tasks** with a defined lifecycle:

1. **submitted** — Client sends a task to the remote agent
2. **working** — Remote agent is processing
3. **input-required** — Agent needs more info from the client
4. **completed** — Task is done, results are in the response
5. **failed** / **canceled** — Error or abort states

Tasks can be **long-running** — the client can poll or subscribe via **Server-Sent Events (SSE)** for real-time updates.

### Key Features

- **Modality Agnostic**: Supports text, images, audio, video, and structured data in messages
- **Enterprise Security**: OAuth 2.0, API keys, mutual TLS — built for production
- **Streaming**: Real-time updates via SSE during task execution
- **gRPC Support**: Added in v0.3 (July 2025) for high-performance scenarios
- **150+ Partners**: IBM's Agent Communication Protocol merged into A2A in August 2025

---

## Head-to-Head Comparison

| Dimension | MCP | A2A |
|-----------|-----|-----|
| **Purpose** | Connect agents to tools & data | Connect agents to other agents |
| **Analogy** | USB-C port | Telephone network |
| **Protocol** | JSON-RPC over stdio/HTTP | JSON-RPC 2.0 over HTTP(S) |
| **Discovery** | Server capability negotiation | Agent Cards (\`.well-known/agent.json\`) |
| **Auth** | OAuth 2.1 (RFC 8707) | OAuth 2.0, API keys, mTLS |
| **Streaming** | SSE | SSE + gRPC |
| **Data Types** | Tools, Resources, Prompts | Tasks, Messages, Artifacts |
| **Modality** | Primarily text + structured | Text, image, audio, video |
| **Governance** | Agentic AI Foundation (Linux Foundation) | Google Cloud (open-source) |
| **Best For** | Tool integration, data access | Multi-agent orchestration |
| **Launched** | November 2024 | April 2025 |

---

## When to Use Which

### Use MCP When...

- Your agent needs to **read files, query databases, or call APIs**
- You want to give an LLM **access to external tools** without custom code
- You're building a **single-agent** system that needs rich context
- You want **plug-and-play integrations** (hundreds of MCP servers already exist for GitHub, Slack, databases, etc.)

### Use A2A When...

- You have **multiple specialized agents** that need to collaborate
- A task requires **delegation** — e.g., an orchestrator assigning sub-tasks to domain experts
- You need **cross-vendor interoperability** between agents built on different frameworks
- Your workflow involves **long-running tasks** where agents need to negotiate and exchange updates

### Use Both Together

The most powerful architectures use both:

\`\`\`
┌──────────────────────────────────────────────┐
│              ORCHESTRATOR AGENT               │
│                                               │
│  ┌──────────────┐     ┌───────────────┐       │
│  │ MCP Client   │     │ A2A Client    │       │
│  │ (tools/data) │     │ (delegation)  │       │
│  └──────┬───────┘     └───────┬───────┘       │
└─────────┼─────────────────────┼───────────────┘
          │                     │
    ┌─────▼──────┐        ┌─────▼──────┐
    │ MCP Server │        │ Remote     │
    │ (Database) │        │ Agent      │
    └────────────┘        │ (Research) │
                          └────────────┘
\`\`\`

An orchestrator uses **MCP** to access local tools and data, and **A2A** to delegate complex sub-tasks to specialized remote agents. The remote agents themselves may also use MCP internally for their own tool access.

---

## The Bigger Picture

We're witnessing the emergence of an **agent protocol stack** — similar to how HTTP, TCP/IP, and DNS created the internet:

| Layer | Internet | AI Agents |
|-------|----------|-----------|
| **Application** | Web Apps | Agent Logic |
| **Communication** | HTTP | A2A |
| **Integration** | REST APIs | MCP |
| **Foundation** | TCP/IP | LLM APIs |

Both protocols are open-source, vendor-neutral, and rapidly gaining adoption. MCP was donated to the Agentic AI Foundation under the Linux Foundation in December 2025. A2A has attracted over 150 organizational partners.

The message is clear: **the future of AI isn't one model doing everything — it's an ecosystem of specialized agents, connected by open standards**.

---

## Getting Started

### Try MCP Today

1. Install the [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
2. Build a simple server exposing one tool
3. Connect it to Claude Desktop or any MCP-compatible host

### Try A2A Today

1. Clone the [A2A repository](https://github.com/google/a2a)
2. Run the sample agents
3. Create an Agent Card for your own agent

### Follow the Standards

- **MCP Specification**: [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **A2A Specification**: [google.github.io/a2a](https://google.github.io/A2A)

---

*Written by the Applied AI Club at Purdue University Northwest. We explore, build, and ship AI — from research to production.*
`;

export const blogPosts = [
    {
        slug: 'a2a-vs-mcp',
        title: 'A2A vs MCP: The Two Protocols Shaping the Future of AI Agents',
        description:
            "A deep-dive into Google's Agent2Agent (A2A) and Anthropic's Model Context Protocol (MCP) — the two open standards defining how AI agents communicate, collaborate, and access tools.",
        tags: ['AI Agents', 'A2A', 'MCP', 'Google', 'Anthropic', 'Protocols'],
        date: '2026-02-24',
        readingTime: '12 min read',
        author: 'Applied AI Club',
        category: 'DEEP DIVE',
        content: a2aVsMcpContent,
    },
];

/**
 * Lookup helper — returns a post by slug, or undefined.
 */
export function getPostBySlug(slug) {
    return blogPosts.find((p) => p.slug === slug);
}
