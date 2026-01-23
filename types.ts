export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioData?: string;
  timestamp: Date;
  followUpQuestions?: string[];
  contextActions?: ContextAction[];
  requiresFeedback?: boolean;
  feedbackGiven?: boolean;
}

export interface ContextAction {
  type: 'download' | 'navigate' | 'external_link';
  label: string;
  action: string;
  icon?: string;
}

export interface PolicyContext {
  productName: string;
  keyFeatures: string[];
  waitingPeriods: Record<string, string>;
  optionalCovers: string[];
  documentSummaries: string;
}

export interface FeedbackData {
  sessionId: string;
  messageId: string;
  rating: number;
  comment?: string;
  timestamp: Date;
  queryType: string;
}
