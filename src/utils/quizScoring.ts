import { ActivityTag, DNACategory } from './activityCategories';

export interface QuizAnswer {
  text: string;
  textEn: string;
  icon: string;
  scores: Partial<ActivityTag>;
}

export interface QuizQuestion {
  id: number;
  question: string;
  questionEn: string;
  answers: QuizAnswer[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "איזו אנרגיה מאפיינת את הצוות שלכם?",
    questionEn: "What energy best describes your team?",
    answers: [
      { text: "אדרנלין גבוה - תנו לנו אתגר!", textEn: "High adrenaline — give us a challenge!", icon: "🚀", scores: { adventure: 5, sports: 4 } },
      { text: "פעילים אך מאוזנים", textEn: "Active but balanced", icon: "⚡", scores: { adventure: 3, sports: 3, nature: 2 } },
      { text: "רגועים ונהנים", textEn: "Relaxed and fun-loving", icon: "🌸", scores: { nature: 5, wellness: 4, creative: 3 } },
      { text: "מחפשים שלווה והרגעה", textEn: "Looking for peace and calm", icon: "🧘", scores: { wellness: 5, nature: 4, creative: 2 } }
    ]
  },
  {
    id: 2,
    question: "מה הצוות שלכם אוהב יותר?",
    questionEn: "What does your team enjoy most?",
    answers: [
      { text: "פעילות גופנית ואתגרים", textEn: "Physical activity and challenges", icon: "🏃", scores: { adventure: 5, sports: 5 } },
      { text: "למידה וחוויות תרבותיות", textEn: "Learning and cultural experiences", icon: "📚", scores: { history: 5, creative: 3 } },
      { text: "אוכל, יין וחוויות קולינריות", textEn: "Food, wine and culinary experiences", icon: "🍽️", scores: { culinary: 5, wellness: 2 } },
      { text: "שילוב מאוזן של הכל", textEn: "A balanced mix of everything", icon: "🎯", scores: { adventure: 2, nature: 2, history: 2, culinary: 2, sports: 2, creative: 2, wellness: 2 } }
    ]
  },
  {
    id: 3,
    question: "כמה חשוב לכם אלמנט התחרותיות?",
    questionEn: "How important is competitiveness?",
    answers: [
      { text: "מאוד - אנחנו אוהבים לנצח!", textEn: "Very — we love to win!", icon: "🏆", scores: { sports: 5, adventure: 3 } },
      { text: "בינוני - תלוי במצב רוח", textEn: "Moderate — depends on the mood", icon: "⚖️", scores: { sports: 3, adventure: 2 } },
      { text: "בכלל לא - מעדיפים שיתוף פעולה", textEn: "Not at all — we prefer collaboration", icon: "🤝", scores: { wellness: 4, creative: 4, nature: 3 } }
    ]
  },
  {
    id: 4,
    question: "איזה סוג של חוויה אתם מחפשים?",
    questionEn: "What kind of experience are you looking for?",
    answers: [
      { text: "היסטוריה ואותנטיות מקומית", textEn: "History and local authenticity", icon: "🗺️", scores: { history: 5, creative: 2 } },
      { text: "טבע וחיבור לסביבה", textEn: "Nature and connecting to the environment", icon: "🌊", scores: { nature: 5, wellness: 3 } },
      { text: "קולינריה ויין", textEn: "Culinary and wine", icon: "🍇", scores: { culinary: 5, wellness: 2 } },
      { text: "אקשן ואתגרים", textEn: "Action and challenges", icon: "💪", scores: { adventure: 5, sports: 4 } }
    ]
  },
  {
    id: 5,
    question: "מהי הרמה הפיזית של רוב המשתתפים?",
    questionEn: "What is the fitness level of most participants?",
    answers: [
      { text: "גבוהה - מוכנים לכל אתגר", textEn: "High — ready for any challenge", icon: "💪", scores: { adventure: 5, sports: 5 } },
      { text: "בינונית - פעילים אבל לא קיצוניים", textEn: "Moderate — active but not extreme", icon: "⚡", scores: { sports: 3, nature: 3, adventure: 2 } },
      { text: "נמוכה-בינונית - נהנים מקצב רגוע", textEn: "Low-moderate — enjoy a relaxed pace", icon: "🌸", scores: { nature: 5, wellness: 5, creative: 3 } },
      { text: "מעורב - יש מכל הסוגים", textEn: "Mixed — all types", icon: "👥", scores: { adventure: 2, nature: 2, history: 2, culinary: 2, sports: 2, creative: 2, wellness: 2 } }
    ]
  },
  {
    id: 6,
    question: "איך הצוות שלכם אוהב לבלות בסוף השבוע?",
    questionEn: "How does your team like to spend weekends?",
    answers: [
      { text: "תרבות - מוזיאונים, קולנוע, אירועים", textEn: "Culture — museums, cinema, events", icon: "🎬", scores: { history: 5, creative: 4 } },
      { text: "טבע - טיולים והרפתקאות", textEn: "Nature — hikes and adventures", icon: "🥾", scores: { adventure: 4, nature: 4 } },
      { text: "מסעדות, בתי קפה, יקבים", textEn: "Restaurants, cafés, wineries", icon: "🍷", scores: { culinary: 5 } },
      { text: "ספורט וכושר", textEn: "Sports and fitness", icon: "🏋️", scores: { sports: 5, adventure: 3 } },
      { text: "בית ורוגע", textEn: "Home and relaxation", icon: "🛋️", scores: { wellness: 5, creative: 3 } }
    ]
  },
  {
    id: 7,
    question: "מהי המטרה העיקרית של יום הגיבוש?",
    questionEn: "What is the main goal of the team day?",
    answers: [
      { text: "לחזק את העבודה הצוותית והתקשורת", textEn: "Strengthen teamwork and communication", icon: "🤝", scores: { teambuilding: 5, sports: 3, creative: 2 } },
      { text: "לפתח מנהיגות ואחריות אישית", textEn: "Develop leadership and personal accountability", icon: "👥", scores: { teambuilding: 5, history: 3, creative: 3 } },
      { text: "לשפר את האווירה והחיבור בין אנשים", textEn: "Improve atmosphere and interpersonal connection", icon: "💫", scores: { teambuilding: 4, wellness: 3, creative: 3 } },
      { text: "להעביר את הזמן ביחד בצורה מהנה", textEn: "Simply have a great time together", icon: "🎉", scores: { culinary: 3, nature: 3, adventure: 2 } }
    ]
  },
  {
    id: 8,
    question: "מה האווירה הרצויה ביום הגיבוש?",
    questionEn: "What atmosphere do you want for the team day?",
    answers: [
      { text: "מלאת אנרגיה ודינמית", textEn: "Energetic and dynamic", icon: "🔥", scores: { adventure: 4, sports: 4 } },
      { text: "חברית ושיתופית", textEn: "Friendly and collaborative", icon: "🤝", scores: { sports: 3, creative: 3, culinary: 3, teambuilding: 3 } },
      { text: "רגועה ומרגיעה", textEn: "Calm and relaxing", icon: "🌅", scores: { nature: 5, wellness: 5 } },
      { text: "מעוררת מחשבה ולמידה", textEn: "Thought-provoking and educational", icon: "🎓", scores: { history: 5, creative: 3 } }
    ]
  }
];

export interface QuizResults {
  scores: ActivityTag;
  topCategories: DNACategory[];
  percentages: Record<DNACategory, number>;
}

export function calculateQuizResults(answers: number[][]): QuizResults {
  const scores: ActivityTag = {
    adventure: 0, nature: 0, history: 0, culinary: 0,
    sports: 0, creative: 0, wellness: 0, teambuilding: 0
  };

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

  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const percentages = Object.entries(scores).reduce((acc, [cat, score]) => {
    acc[cat as DNACategory] = total > 0 ? Math.round((score / total) * 100) : 0;
    return acc;
  }, {} as Record<DNACategory, number>);

  const topCategories = (Object.entries(scores) as [DNACategory, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([cat]) => cat);

  return { scores, topCategories, percentages };
}
