# GitSearch AI — Open Source Discovery

Describe what you want to build in natural language. GitSearch AI extracts search intent, queries GitHub, analyzes repositories with AI (OpenAI or Gemini), and returns ranked recommendations.

## Features

- Natural language project descriptions
- AI-generated GitHub search keywords
- Repository discovery via GitHub Search API
- README-aware relevance scoring
- Ranked results with match scores, technologies, strengths, and gaps

## Getting Started

### Prerequisites

- Node.js 18+
- **OpenAI** or **Google Gemini** API key
- [GitHub personal access token](https://github.com/settings/tokens) (recommended)

### Setup

```bash
cp .env.example .env.local
# Edit .env.local with your API keys

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_PROVIDER` | With `AI_API_KEY` | `openai` or `gemini` |
| `AI_API_KEY` | With `AI_PROVIDER` | Unified API key for chosen provider |
| `GEMINI_API_KEY` | One of these | Gemini key (auto-selects Gemini) |
| `OPENAI_API_KEY` | One of these | OpenAI key (auto-selects OpenAI) |
| `AI_MODEL` | No | Model override (default: `gemini-2.0-flash` or `gpt-4o-mini`) |
| `GITHUB_TOKEN` | No | GitHub PAT for higher API rate limits |

**Gemini example (`.env.local`):**
```env
AI_PROVIDER=gemini
AI_API_KEY=your-gemini-api-key
```

**OpenAI example:**
```env
AI_PROVIDER=openai
AI_API_KEY=sk-your-openai-api-key
```

Or set only `GEMINI_API_KEY` / `OPENAI_API_KEY` — provider is auto-detected.

## Architecture

```
User Query → API Route → Search Orchestrator
                              ├── AI (OpenAI/Gemini): extract keywords
                              ├── GitHub: search repositories
                              ├── GitHub: fetch READMEs
                              └── AI (OpenAI/Gemini): evaluate & rank
```

### Folder Structure

```
app/                  # Next.js App Router pages & API routes
components/           # Presentational UI components
features/search/      # Feature-specific hooks
services/             # GitHub, OpenAI, and search orchestration
types/                # Shared TypeScript types
lib/                  # Env, errors, constants
utils/                # Validation, dates, formatting
```

## API

### `POST /api/search`

**Request:**
```json
{ "query": "I need a multi-tenant SaaS starter using Next.js, Stripe and Supabase." }
```

**Response:**
```json
{
  "query": "...",
  "keywords": ["nextjs saas starter", "..."],
  "repositories": [
    {
      "fullName": "owner/repo",
      "name": "repo",
      "htmlUrl": "https://github.com/owner/repo",
      "matchScore": 94,
      "technologiesDetected": ["Next.js", "Stripe"],
      "strengths": ["Production-ready SaaS boilerplate"],
      "stars": 8000,
      "updatedAt": "2025-01-15T00:00:00Z"
    }
  ]
}
```

## Database

Not required for MVP. Search is stateless. Future options: cache search results (Redis), store search history (PostgreSQL), or pre-index popular repos.

## Future Scalability

- **Caching**: Redis cache for GitHub search + evaluation results (TTL by repo `updated_at`)
- **Background jobs**: Queue long searches with BullMQ / Inngest
- **Streaming**: SSE progress updates (keywords → candidates → evaluations)
- **Auth & quotas**: User accounts with per-tier rate limits
- **Embeddings**: Vector search over README index for faster candidate retrieval
- **Feedback loop**: Thumbs up/down to fine-tune ranking

## License

MIT
