// Sentiment analysis utility for voice chat messages
// Analyzes conversation tone to display user satisfaction

export type SentimentType = 'positive' | 'neutral' | 'negative';

interface SentimentResult {
  type: SentimentType;
  icon: string;
  color: string;
}

const positiveWords = [
  'תודה', 'מעולה', 'נהדר', 'טוב', 'מצוין', 'כיף', 'אהבתי', 'מושלם', 'יפה',
  'thank', 'great', 'excellent', 'good', 'perfect', 'amazing', 'love', 'wonderful'
];

const negativeWords = [
  'לא', 'רע', 'גרוע', 'בעיה', 'לא מבין', 'טעות', 'לא טוב',
  'no', 'bad', 'wrong', 'problem', 'issue', 'confused', 'unclear', 'not good'
];

export const analyzeSentiment = (text: string): SentimentResult => {
  const lowerText = text.toLowerCase();
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeScore++;
  });
  
  // Question marks suggest uncertainty/neutral
  const questionMarks = (text.match(/\?/g) || []).length;
  
  if (positiveScore > negativeScore) {
    return {
      type: 'positive',
      icon: '😊',
      color: 'text-green-500'
    };
  } else if (negativeScore > positiveScore) {
    return {
      type: 'negative',
      icon: '😕',
      color: 'text-orange-500'
    };
  } else {
    return {
      type: 'neutral',
      icon: questionMarks > 0 ? '🤔' : '😐',
      color: 'text-muted-foreground'
    };
  }
};

export const getOverallSentiment = (messages: { sender: string; message: string }[]): SentimentResult => {
  const userMessages = messages.filter(m => m.sender === 'user');
  
  if (userMessages.length === 0) {
    return { type: 'neutral', icon: '😐', color: 'text-muted-foreground' };
  }
  
  let totalPositive = 0;
  let totalNegative = 0;
  
  userMessages.forEach(msg => {
    const sentiment = analyzeSentiment(msg.message);
    if (sentiment.type === 'positive') totalPositive++;
    if (sentiment.type === 'negative') totalNegative++;
  });
  
  const positiveRatio = totalPositive / userMessages.length;
  
  if (positiveRatio > 0.4) {
    return { type: 'positive', icon: '😊', color: 'text-green-500' };
  } else if (totalNegative > totalPositive) {
    return { type: 'negative', icon: '😕', color: 'text-orange-500' };
  } else {
    return { type: 'neutral', icon: '😐', color: 'text-muted-foreground' };
  }
};
