import { ActivityTag, DNACategory } from './activityCategories';

export interface QuizQuestion {
  id: number;
  question: string;
  answers: {
    text: string;
    icon: string;
    scores: Partial<ActivityTag>;
  }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "איזו אנרגיה מאפיינת את הצוות שלכם?",
    answers: [
      {
        text: "אדרנלין גבוה - תנו לנו אתגר!",
        icon: "🚀",
        scores: { adventure: 5, sports: 4 }
      },
      {
        text: "פעילים אך מאוזנים",
        icon: "⚡",
        scores: { adventure: 3, sports: 3, nature: 2 }
      },
      {
        text: "רגועים ונהנים",
        icon: "🌸",
        scores: { nature: 5, wellness: 4, creative: 3 }
      },
      {
        text: "מחפשים שלווה והרגעה",
        icon: "🧘",
        scores: { wellness: 5, nature: 4, creative: 2 }
      }
    ]
  },
  {
    id: 2,
    question: "מה הצוות שלכם אוהב יותר?",
    answers: [
      {
        text: "פעילות גופנית ואתגרים",
        icon: "🏃",
        scores: { adventure: 5, sports: 5 }
      },
      {
        text: "למידה וחוויות תרבותיות",
        icon: "📚",
        scores: { history: 5, creative: 3 }
      },
      {
        text: "אוכל, יין וחוויות קולינריות",
        icon: "🍽️",
        scores: { culinary: 5, wellness: 2 }
      },
      {
        text: "שילוב מאוזן של הכל",
        icon: "🎯",
        scores: { adventure: 2, nature: 2, history: 2, culinary: 2, sports: 2, creative: 2, wellness: 2 }
      }
    ]
  },
  {
    id: 3,
    question: "כמה חשוב לכם אלמנט התחרותיות?",
    answers: [
      {
        text: "מאוד - אנחנו אוהבים לנצח!",
        icon: "🏆",
        scores: { sports: 5, adventure: 3 }
      },
      {
        text: "בינוני - תלוי במצב רוח",
        icon: "⚖️",
        scores: { sports: 3, adventure: 2 }
      },
      {
        text: "בכלל לא - מעדיפים שיתוף פעולה",
        icon: "🤝",
        scores: { wellness: 4, creative: 4, nature: 3 }
      }
    ]
  },
  {
    id: 4,
    question: "איזה סוג של חוויה אתם מחפשים?",
    answers: [
      {
        text: "היסטוריה ואותנטיות מקומית",
        icon: "🗺️",
        scores: { history: 5, creative: 2 }
      },
      {
        text: "טבע וחיבור לסביבה",
        icon: "🌊",
        scores: { nature: 5, wellness: 3 }
      },
      {
        text: "קולינריה ויין",
        icon: "🍇",
        scores: { culinary: 5, wellness: 2 }
      },
      {
        text: "אקשן ואתגרים",
        icon: "💪",
        scores: { adventure: 5, sports: 4 }
      }
    ]
  },
  {
    id: 5,
    question: "מהי הרמה הפיזית של רוב המשתתפים?",
    answers: [
      {
        text: "גבוהה - מוכנים לכל אתגר",
        icon: "💪",
        scores: { adventure: 5, sports: 5 }
      },
      {
        text: "בינונית - פעילים אבל לא קיצוניים",
        icon: "⚡",
        scores: { sports: 3, nature: 3, adventure: 2 }
      },
      {
        text: "נמוכה-בינונית - נהנים מקצב רגוע",
        icon: "🌸",
        scores: { nature: 5, wellness: 5, creative: 3 }
      },
      {
        text: "מעורב - יש מכל הסוגים",
        icon: "👥",
        scores: { adventure: 2, nature: 2, history: 2, culinary: 2, sports: 2, creative: 2, wellness: 2 }
      }
    ]
  },
  {
    id: 6,
    question: "איך הצוות שלכם אוהב לבלות בסוף השבוע?",
    answers: [
      {
        text: "תרבות - מוזיאונים, קולנוע, אירועים",
        icon: "🎬",
        scores: { history: 5, creative: 4 }
      },
      {
        text: "טבע - טיולים והרפתקאות",
        icon: "🥾",
        scores: { adventure: 4, nature: 4 }
      },
      {
        text: "מסעדות, בתי קפה, יקבים",
        icon: "🍷",
        scores: { culinary: 5 }
      },
      {
        text: "ספורט וכושר",
        icon: "🏋️",
        scores: { sports: 5, adventure: 3 }
      },
      {
        text: "בית ורוגע",
        icon: "🛋️",
        scores: { wellness: 5, creative: 3 }
      }
    ]
  },
  {
    id: 7,
    question: "מהי המטרה העיקרית של יום הגיבוש?",
    answers: [
      {
        text: "לחזק את העבודה הצוותית והתקשורת",
        icon: "🤝",
        scores: { teambuilding: 5, sports: 3, creative: 2 }
      },
      {
        text: "לפתח מנהיגות ואחריות אישית",
        icon: "👥",
        scores: { teambuilding: 5, history: 3, creative: 3 }
      },
      {
        text: "לשפר את האווירה והחיבור בין אנשים",
        icon: "💫",
        scores: { teambuilding: 4, wellness: 3, creative: 3 }
      },
      {
        text: "להעביר את הזמן ביחד בצורה מהנה",
        icon: "🎉",
        scores: { culinary: 3, nature: 3, adventure: 2 }
      }
    ]
  },
  {
    id: 8,
    question: "מה האווירה הרצויה ביום הגיבוש?",
    answers: [
      {
        text: "מלאת אנרגיה ודינמית",
        icon: "🔥",
        scores: { adventure: 4, sports: 4 }
      },
      {
        text: "חברית ושיתופית",
        icon: "🤝",
        scores: { sports: 3, creative: 3, culinary: 3, teambuilding: 3 }
      },
      {
        text: "רגועה ומרגיעה",
        icon: "🌅",
        scores: { nature: 5, wellness: 5 }
      },
      {
        text: "מעוררת מחשבה ולמידה",
        icon: "🎓",
        scores: { history: 5, creative: 3 }
      }
    ]
  }
];

export interface QuizResults {
  scores: ActivityTag;
  topCategories: DNACategory[];
  percentages: Record<DNACategory, number>;
}

export function calculateQuizResults(answers: number[][]): QuizResults {
  // Initialize scores
  const scores: ActivityTag = {
    adventure: 0,
    nature: 0,
    history: 0,
    culinary: 0,
    sports: 0,
    creative: 0,
    wellness: 0,
    teambuilding: 0
  };

  // Sum up all scores from answers
  answers.forEach((selectedAnswers, questionIndex) => {
    selectedAnswers.forEach(answerIndex => {
      const answer = quizQuestions[questionIndex]?.answers[answerIndex];
      if (answer) {
        Object.entries(answer.scores).forEach(([category, score]) => {
          scores[category as DNACategory] = (scores[category as DNACategory] || 0) + score;
        });
      }
    });
  });

  // Calculate total and percentages
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const percentages = Object.entries(scores).reduce((acc, [cat, score]) => {
    acc[cat as DNACategory] = total > 0 ? Math.round((score / total) * 100) : 0;
    return acc;
  }, {} as Record<DNACategory, number>);

  // Sort categories by score and get top 3
  const topCategories = (Object.entries(scores) as [DNACategory, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cat]) => cat);

  return {
    scores,
    topCategories,
    percentages
  };
}
