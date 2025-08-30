import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export interface SentimentAnalysis {
  score: number; // Raw sentiment score
  normalizedScore: number; // Normalized to -1 to 1 range
  wellnessScore: number; // 0-100 wellness score
  category: 'positive' | 'neutral' | 'stressed' | 'high_risk';
  tokens: string[];
  positiveWords: string[];
  negativeWords: string[];
}

// Keywords that might indicate stress or mental health concerns
const stressKeywords = [
  'overwhelmed', 'exhausted', 'burned out', 'anxious', 'stressed',
  'depressed', 'lonely', 'isolated', 'worried', 'scared', 'panicked',
  'frustrated', 'angry', 'irritated', 'hopeless', 'helpless',
  'tired', 'drained', 'struggling', 'difficult', 'hard time',
  'can\'t cope', 'breaking down', 'falling apart'
];

const highRiskKeywords = [
  'suicide', 'kill myself', 'end it all', 'worthless', 'no point',
  'give up', 'can\'t go on', 'better off dead', 'harm myself',
  'self harm', 'cutting', 'hurt myself'
];

const positiveKeywords = [
  'happy', 'joyful', 'excited', 'grateful', 'blessed', 'wonderful',
  'amazing', 'fantastic', 'great', 'excellent', 'peaceful', 'calm',
  'relaxed', 'energized', 'motivated', 'optimistic', 'confident',
  'proud', 'satisfied', 'content', 'thankful'
];

export function analyzeSentiment(text: string): SentimentAnalysis {
  const result = sentiment.analyze(text);
  const lowerText = text.toLowerCase();
  
  // Normalize score to -1 to 1 range
  const normalizedScore = Math.max(-1, Math.min(1, result.score / 10));
  
  // Check for specific keyword patterns
  const hasHighRiskKeywords = highRiskKeywords.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  const hasStressKeywords = stressKeywords.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  const hasPositiveKeywords = positiveKeywords.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  // Determine category based on score and keywords
  let category: SentimentAnalysis['category'];
  
  if (hasHighRiskKeywords || normalizedScore <= -0.8) {
    category = 'high_risk';
  } else if (hasStressKeywords || normalizedScore <= -0.3) {
    category = 'stressed';
  } else if (hasPositiveKeywords || normalizedScore >= 0.3) {
    category = 'positive';
  } else {
    category = 'neutral';
  }
  
  // Calculate wellness score (0-100)
  // Convert sentiment score to 0-100 scale with adjustments for keywords
  let wellnessScore = 50 + (normalizedScore * 50); // Base score from sentiment
  
  // Adjust based on keywords
  if (hasHighRiskKeywords) {
    wellnessScore = Math.min(wellnessScore, 20);
  } else if (hasStressKeywords) {
    wellnessScore = Math.min(wellnessScore, 40);
  } else if (hasPositiveKeywords) {
    wellnessScore = Math.max(wellnessScore, 70);
  }
  
  // Ensure score is within bounds
  wellnessScore = Math.max(0, Math.min(100, Math.round(wellnessScore)));
  
  return {
    score: result.score,
    normalizedScore,
    wellnessScore,
    category,
    tokens: result.tokens,
    positiveWords: result.positive,
    negativeWords: result.negative,
  };
}

export function getWellnessColor(score: number): string {
  if (score >= 70) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  if (score >= 30) return 'text-orange-600';
  return 'text-red-600';
}

export function getWellnessBadgeColor(category: SentimentAnalysis['category']): string {
  switch (category) {
    case 'positive':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'neutral':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'stressed':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'high_risk':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}