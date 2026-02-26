# RAG Workflow Integration Template

## ⚠️ Status: INACTIVE - Template Only

This document serves as a template for future RAG (Retrieval-Augmented Generation) implementation.
**Branch:** `feature/rag-workflow-integration`

---

## Overview

RAG (Retrieval-Augmented Generation) will enhance the AI Health Guide by:
- Retrieving relevant medical information from a knowledge base
- Augmenting AI responses with verified health data
- Providing more accurate and contextual health guidance

## Architecture

### Components

```
RAG System
├── n8n Workflow Engine
│   ├── Document Processing
│   ├── Embedding Generation
│   └── Query Orchestration
├── Supabase Vector Database
│   ├── Document Storage
│   ├── Vector Embeddings
│   └── Similarity Search
└── Mobile App Integration
    ├── Query Interface
    ├── Response Handler
    └── Cache Management
```

## Technology Stack

### n8n (Workflow Automation)
- **Purpose:** Orchestrate RAG pipeline
- **Features:**
  - Document ingestion
  - Embedding generation
  - Query processing
  - Response formatting

### Supabase (Backend & Vector DB)
- **Purpose:** Store and retrieve embeddings
- **Features:**
  - PostgreSQL with pgvector extension
  - Vector similarity search
  - Document metadata storage
  - Real-time subscriptions

### OpenAI Embeddings
- **Model:** text-embedding-ada-002
- **Purpose:** Convert text to vector embeddings
- **Dimensions:** 1536

## Implementation Plan

### Phase 1: Infrastructure Setup
```yaml
Tasks:
  - [ ] Set up Supabase project
  - [ ] Enable pgvector extension
  - [ ] Create embeddings table
  - [ ] Set up n8n instance
  - [ ] Configure API connections
```

### Phase 2: Document Processing
```yaml
Tasks:
  - [ ] Create document ingestion workflow
  - [ ] Implement text chunking
  - [ ] Generate embeddings
  - [ ] Store in Supabase
  - [ ] Add metadata indexing
```

### Phase 3: Query Pipeline
```yaml
Tasks:
  - [ ] Build query embedding workflow
  - [ ] Implement similarity search
  - [ ] Create context retrieval
  - [ ] Format augmented prompts
  - [ ] Return enhanced responses
```

### Phase 4: Mobile Integration
```yaml
Tasks:
  - [ ] Create RAG service layer
  - [ ] Update AI Doctor Assistant
  - [ ] Add caching mechanism
  - [ ] Implement error handling
  - [ ] Add loading states
```

## Database Schema

### Supabase Tables

#### documents
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT,
  category TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### embeddings
```sql
CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id),
  chunk_text TEXT NOT NULL,
  embedding VECTOR(1536),
  chunk_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for similarity search
CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops);
```

#### queries
```sql
CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  query_text TEXT NOT NULL,
  retrieved_chunks JSONB,
  response TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## n8n Workflows

### Workflow 1: Document Ingestion
```json
{
  "name": "Document Ingestion",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "name": "Text Splitter",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Split document into chunks"
      }
    },
    {
      "name": "OpenAI Embeddings",
      "type": "n8n-nodes-base.openAi"
    },
    {
      "name": "Supabase Insert",
      "type": "n8n-nodes-base.supabase"
    }
  ]
}
```

### Workflow 2: Query Processing
```json
{
  "name": "RAG Query",
  "nodes": [
    {
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest"
    },
    {
      "name": "Generate Query Embedding",
      "type": "n8n-nodes-base.openAi"
    },
    {
      "name": "Vector Search",
      "type": "n8n-nodes-base.supabase"
    },
    {
      "name": "Format Context",
      "type": "n8n-nodes-base.code"
    },
    {
      "name": "OpenAI Completion",
      "type": "n8n-nodes-base.openAi"
    }
  ]
}
```

## Mobile App Integration

### Service Layer

#### services/rag.ts (Template)
```typescript
// INACTIVE - Template Only

interface RAGQuery {
  query: string;
  userId: string;
  context?: string;
}

interface RAGResponse {
  answer: string;
  sources: Array<{
    title: string;
    content: string;
    relevance: number;
  }>;
  confidence: number;
}

export class RAGService {
  private baseUrl = process.env.EXPO_PUBLIC_N8N_WEBHOOK_URL;

  async query(params: RAGQuery): Promise<RAGResponse> {
    // Implementation pending
    throw new Error('RAG Service not implemented');
  }

  async indexDocument(document: any): Promise<void> {
    // Implementation pending
    throw new Error('RAG Service not implemented');
  }
}
```

### Updated AI Doctor Assistant (Template)

```typescript
// INACTIVE - Template Only

// Add to AiDoctorAssistantScreen.tsx
import { RAGService } from '../services/rag';

const ragService = new RAGService();

const sendMessageWithRAG = async (message: string) => {
  try {
    // Get RAG-enhanced response
    const ragResponse = await ragService.query({
      query: message,
      userId: user?.uid || '',
      context: symptomFrequency
    });

    // Display response with sources
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: ragResponse.answer,
      sources: ragResponse.sources,
      confidence: ragResponse.confidence
    }]);
  } catch (error) {
    // Fallback to regular OpenAI
    console.log('RAG unavailable, using fallback');
  }
};
```

## Environment Variables

### Required Variables (Template)
```env
# n8n Configuration
EXPO_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/rag-query
EXPO_PUBLIC_N8N_API_KEY=your_n8n_api_key

# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# OpenAI Embeddings
OPENAI_EMBEDDING_MODEL=text-embedding-ada-002
```

## Data Flow

```
User Query
    ↓
Mobile App
    ↓
n8n Webhook (Query Processing)
    ↓
Generate Query Embedding (OpenAI)
    ↓
Vector Similarity Search (Supabase)
    ↓
Retrieve Top K Documents
    ↓
Format Context + Original Query
    ↓
OpenAI Completion (Augmented)
    ↓
Return Enhanced Response
    ↓
Display in Mobile App
```

## Knowledge Base Structure

### Document Categories
- **Diseases:** Common conditions, symptoms, treatments
- **Medications:** Drug information, interactions, side effects
- **Procedures:** Medical procedures, preparations, recovery
- **Prevention:** Health tips, lifestyle recommendations
- **Emergency:** When to seek immediate care

### Document Format
```json
{
  "title": "Dengue Fever",
  "category": "diseases",
  "content": "Detailed medical information...",
  "metadata": {
    "source": "WHO Guidelines",
    "last_updated": "2024-01-01",
    "language": "en",
    "region": "Philippines"
  }
}
```

## Performance Considerations

### Caching Strategy
- Cache frequent queries locally
- TTL: 24 hours
- Invalidate on new documents

### Optimization
- Limit retrieved chunks: 3-5
- Use approximate nearest neighbor search
- Implement query result pagination
- Compress embeddings if needed

## Security & Privacy

### Data Protection
- Encrypt embeddings at rest
- Use row-level security in Supabase
- Sanitize user queries
- No PII in embeddings

### Access Control
- API key authentication
- Rate limiting
- User-specific query logs
- Audit trail

## Testing Strategy

### Unit Tests
- [ ] Embedding generation
- [ ] Vector similarity search
- [ ] Context formatting
- [ ] Response parsing

### Integration Tests
- [ ] n8n workflow execution
- [ ] Supabase queries
- [ ] End-to-end RAG pipeline
- [ ] Mobile app integration

### Performance Tests
- [ ] Query latency
- [ ] Concurrent requests
- [ ] Cache hit rate
- [ ] Embedding generation time

## Monitoring

### Metrics to Track
- Query response time
- Retrieval accuracy
- Cache hit rate
- Error rate
- User satisfaction

### Logging
- Query logs
- Retrieved documents
- Response quality
- Error traces

## Future Enhancements

### Potential Features
- [ ] Multi-language support
- [ ] Image-based retrieval
- [ ] Conversational memory
- [ ] Personalized recommendations
- [ ] Feedback loop for improvement
- [ ] A/B testing framework

## Migration Path

### From Current to RAG
1. Deploy RAG infrastructure (n8n + Supabase)
2. Ingest initial knowledge base
3. Test RAG pipeline independently
4. Add feature flag in mobile app
5. Gradual rollout to users
6. Monitor and optimize
7. Full migration

## Rollback Plan

### If Issues Occur
1. Disable RAG feature flag
2. Fallback to direct OpenAI
3. Investigate and fix issues
4. Re-enable gradually

## Documentation

### Required Docs
- [ ] n8n workflow documentation
- [ ] Supabase schema documentation
- [ ] API endpoint documentation
- [ ] Mobile integration guide
- [ ] Troubleshooting guide

## Timeline (Estimated)

```
Phase 1: Infrastructure (2 weeks)
Phase 2: Document Processing (2 weeks)
Phase 3: Query Pipeline (2 weeks)
Phase 4: Mobile Integration (1 week)
Testing & Optimization (1 week)
---
Total: 8 weeks
```

## Resources

### Documentation
- [n8n Documentation](https://docs.n8n.io/)
- [Supabase Vector Guide](https://supabase.com/docs/guides/ai)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [pgvector](https://github.com/pgvector/pgvector)

### Tutorials
- RAG implementation guides
- Vector database tutorials
- n8n workflow examples
- Supabase AI examples

---

## Notes

- This is a **template** for future implementation
- Currently **INACTIVE** - not integrated into main app
- Branch: `feature/rag-workflow-integration`
- Review and update before implementation
- Ensure compliance with medical data regulations
