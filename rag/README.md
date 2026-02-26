# RAG (Retrieval-Augmented Generation) Module

## ⚠️ STATUS: INACTIVE

This module is currently **INACTIVE** and serves as a template for future implementation.

**Branch:** `feature/rag-workflow-integration`

---

## Overview

This directory contains the RAG implementation for enhancing the AI Health Guide with:
- Document retrieval from vector database
- Context-aware AI responses
- Medical knowledge base integration

## Structure

```
rag/
├── services/          # RAG service implementations
├── workflows/         # n8n workflow definitions
├── config/           # Configuration files
├── types/            # TypeScript type definitions
└── README.md         # This file
```

## Integration Status

- [ ] Supabase vector database setup
- [ ] n8n workflow deployment
- [ ] Service layer implementation
- [ ] Mobile app integration
- [ ] Testing and validation

## Usage (When Active)

```typescript
import { RAGService } from './rag/services/rag-service';

const ragService = new RAGService();
const response = await ragService.query({
  query: 'What are dengue symptoms?',
  userId: 'user123'
});
```

## Documentation

See `.claude/workflows/rag-integration-template.md` for complete implementation guide.

## Activation

To activate this module:
1. Complete infrastructure setup (Supabase + n8n)
2. Deploy workflows
3. Update environment variables
4. Remove INACTIVE status
5. Integrate with AI Doctor Assistant

---

**Last Updated:** 2024
**Status:** Template Only - Not Integrated
