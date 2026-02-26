// ⚠️ INACTIVE - Template Only
// RAG Configuration

import { RAGConfig } from '../types/rag-types';

export const ragConfig: RAGConfig = {
  // n8n Configuration
  n8nWebhookUrl: process.env.EXPO_PUBLIC_N8N_WEBHOOK_URL || '',
  n8nApiKey: process.env.EXPO_PUBLIC_N8N_API_KEY || '',

  // Supabase Configuration
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',

  // OpenAI Embeddings
  embeddingModel: 'text-embedding-ada-002',

  // Document Processing
  maxChunkSize: 1000,
  chunkOverlap: 200,
};

export const vectorSearchConfig = {
  defaultLimit: 5,
  minSimilarityThreshold: 0.7,
  maxTokens: 4000,
};

export const cacheConfig = {
  enabled: true,
  ttl: 86400, // 24 hours in seconds
  maxSize: 100, // Maximum cached queries
};

// Feature flags
export const ragFeatureFlags = {
  enabled: false, // INACTIVE
  useCache: true,
  logQueries: true,
  fallbackToOpenAI: true,
};
