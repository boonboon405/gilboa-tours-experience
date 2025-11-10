import { ActivityTag, DNACategory, getActivityDNA } from './activityCategories';
import { QuizResults } from './quizScoring';

export interface FilteredActivity {
  text: string;
  index: number;
  relevanceScore: number;
  matchedCategories: DNACategory[];
}

export function filterActivitiesByDNA(
  activities: string[],
  quizResults: QuizResults,
  maxActivities: number = 10
): FilteredActivity[] {
  const { topCategories, scores } = quizResults;

  // Score each activity based on how well it matches the top categories
  const scoredActivities = activities.map((activity, index) => {
    const activityDNA = getActivityDNA(activity);
    let relevanceScore = 0;
    const matchedCategories: DNACategory[] = [];

    // Calculate relevance based on top 3 categories
    topCategories.forEach((category, priorityIndex) => {
      const categoryScore = activityDNA[category] || 0;
      if (categoryScore > 0) {
        // Weight by priority (first category gets more weight)
        const weight = 3 - priorityIndex;
        relevanceScore += categoryScore * weight;
        matchedCategories.push(category);
      }
    });

    // Add bonus for activities that match multiple top categories
    if (matchedCategories.length > 1) {
      relevanceScore += matchedCategories.length * 2;
    }

    return {
      text: activity,
      index,
      relevanceScore,
      matchedCategories
    };
  });

  // Sort by relevance score (descending) and return top N
  return scoredActivities
    .filter(a => a.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxActivities);
}

export function shouldShowActivity(
  activityText: string,
  quizResults: QuizResults | null
): boolean {
  // If no quiz results, show all activities
  if (!quizResults) return true;

  const activityDNA = getActivityDNA(activityText);
  const { topCategories } = quizResults;

  // Check if activity matches any of the top 3 categories
  return topCategories.some(category => {
    const score = activityDNA[category] || 0;
    return score >= 3; // Only show activities with significant match (3+)
  });
}
