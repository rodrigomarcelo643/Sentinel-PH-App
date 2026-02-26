// ⚠️ INACTIVE - Template Only
// TypeScript types for RAG implementation

export interface RAGQuery {
  query: string;
  userId: string;
  context?: string;
  maxResults?: number;
  minRelevance?: number;
}

export interface RAGResponse {
  answer: string;
  sources: DocumentSource[];
  confidence: number;
  queryId?: string;
}

export interface DocumentSource {
  id: string;
  title: string;
  content: string;
  relevance: number;
  category?: string;
  metadata?: DocumentMetadata;
}

export interface DocumentMetadata {
  source: string;
  lastUpdated: string;
  language: string;
  region?: string;
  author?: string;
  verified?: boolean;
}

export interface DocumentInput {
  title: string;
  content: string;
  category: string;
  source?: string;
  metadata?: Partial<DocumentMetadata>;
}

export interface EmbeddingResult {
  documentId: string;
  chunkIndex: number;
  embedding: number[];
  chunkText: string;
}

export interface VectorSearchParams {
  embedding: number[];
  limit: number;
  threshold?: number;
}

export interface VectorSearchResult {
  documentId: string;
  chunkText: string;
  similarity: number;
  metadata?: any;
}

export interface RAGConfig {
  n8nWebhookUrl: string;
  n8nApiKey: string;
  supabaseUrl: string;
  supabaseKey: string;
  embeddingModel: string;
  maxChunkSize: number;
  chunkOverlap: number;
}

export interface QueryLog {
  id: string;
  userId: string;
  query: string;
  response: string;
  sources: DocumentSource[];
  timestamp: Date;
  responseTime: number;
}
