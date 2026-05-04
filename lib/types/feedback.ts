export type FeedbackOutcome = 'advanced' | 'not_advanced' | 'pending';

export interface Feedback {
  id: string;
  submissionId: string;
  scores: Record<string, number>;
  comments: Record<string, string>;
  totalScore: number;
  outcome: FeedbackOutcome;
  published: boolean;
  publishedAt?: string;
  enteredByAdmin?: string;
  evaluatorName: string;
  evaluationDate?: string;
  deletedAt?: string;
}

export interface EnterFeedbackRequest {
  scores: Record<string, number>;
  comments: Record<string, string>;
  totalScore: number;
  outcome: FeedbackOutcome;
  evaluatorName: string;
  evaluationDate?: string;
}

export interface PublishFeedbackRequest {
  submissionIds: string[];
}
