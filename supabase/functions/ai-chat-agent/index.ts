import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Activity DNA mappings and descriptions
const activityKnowledge = {
  "ביקור במעיינות סחנה": { dna: { nature: 8, wellness: 6, adventure: 4 }, description: "מעיינות טבעיים מרהיבים עם בריכות שחייה בטבע" },
  "טיול ברכבי שטח באזור הגלבוע": { dna: { adventure: 9, nature: 7, sports: 5 }, description: "חוויית שטח אקסטרים עם נופים עוצרי נשימה" },
  "סיור בבית שאן העתיקה": { dna: { history: 10, culture: 8, learning: 7 }, description: "עיר רומית עתיקה מרהיבה עם חפירות ארכיאולוגיות" },
  "ארוחה בכפר נחלל": { dna: { culinary: 9, culture: 6, social: 7 }, description: "חוויה קולינרית ביישוב הדרוזי עם מטעמים מקומיים" },
  "רפטינג בירדן": { dna: { adventure: 10, sports: 9, nature: 7 }, description: "השטה מרגשת בנהר הירדן" },
  "סדנת יצירה": { dna: { creative: 10, wellness: 5, social: 6 }, description: "סדנה יצירתית לחיזוק הצוות" },
  "יוגה בטבע": { dna: { wellness: 10, nature: 8, mindfulness: 9 }, description: "שיעור יוגה מרגיע בטבע הגלבוע" }
};

// Forbidden Arabic-origin words for detection
const ARABIC_SLANG_WORDS = [
  'יאללה', 'אחלה', 'סחתיין', 'סבבה', 'חלאס', 'וואלה', 'מסכין', 'חביבי',
  'יאלה', 'אללה', 'סאבבה', 'חארה', 'כיף', 'סבבות', 'כיפאק'
];

// Hebrew quality indicators
const HEBREW_QUALITY_INDICATORS = {
  good: ['מצוין', 'נהדר', 'מעולה', 'נפלא', 'מדהים', 'קדימה', 'בואו', 'הבה', 'בסדר', 'טוב', 'יפה'],
  formal: ['שלום', 'תודה', 'בבקשה', 'ברוך', 'כן', 'לא', 'אפשר', 'צריך'],
};

// Function to detect Arabic slang
function detectArabicSlang(text: string): { found: boolean; words: string[] } {
  const foundWords: string[] = [];
  const lowerText = text.toLowerCase();
  
  ARABIC_SLANG_WORDS.forEach(word => {
    if (lowerText.includes(word.toLowerCase())) {
      foundWords.push(word);
    }
  });
  
  return { found: foundWords.length > 0, words: foundWords };
}

// Function to score Hebrew language quality (0-100)
function scoreHebrewQuality(text: string): { score: number; details: any } {
  let score = 50; // Base score
  const lowerText = text.toLowerCase();
  const details: any = {
    goodWordCount: 0,
    formalWordCount: 0,
    arabicSlangDetected: false,
    arabicWords: [],
    textLength: text.length
  };
  
  // Check for good Hebrew words (+2 points each, max 30)
  HEBREW_QUALITY_INDICATORS.good.forEach(word => {
    const count = (lowerText.match(new RegExp(word.toLowerCase(), 'g')) || []).length;
    details.goodWordCount += count;
  });
  score += Math.min(details.goodWordCount * 2, 30);
  
  // Check for formal Hebrew words (+1 point each, max 10)
  HEBREW_QUALITY_INDICATORS.formal.forEach(word => {
    const count = (lowerText.match(new RegExp(word.toLowerCase(), 'g')) || []).length;
    details.formalWordCount += count;
  });
  score += Math.min(details.formalWordCount, 10);
  
  // Penalize for Arabic slang (-30 points per word)
  const arabicDetection = detectArabicSlang(text);
  if (arabicDetection.found) {
    details.arabicSlangDetected = true;
    details.arabicWords = arabicDetection.words;
    score -= arabicDetection.words.length * 30;
  }
  
  // Bonus for reasonable length (10-20 points)
  if (text.length > 50 && text.length < 500) {
    score += 10;
  } else if (text.length >= 500 && text.length < 1000) {
    score += 15;
  }
  
  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));
  
  return { score, details };
}

// Default system prompt (fallback if database is unavailable)
const DEFAULT_SYSTEM_PROMPT = `אתה מומחה לסיוריים. אתה עוזר למשתמשים לתכנן את חוויית הטיול המושלמת שלהם.

הודעת פתיחה (רק בהתחלת שיחה חדשה):
"שלום! אני מומחה לסיוריים ומציע חוויות:
🔥 הרפתקאות  |  💧 טבע  |  🏛️ דברי הימים  |  🍷 יין ואומנות הבישול  |  ⚡ ספורט  |  🎨 יצירה  |  🌿 בריאות  |  🤝 גיבוש צוות

ענו על השאלות , ברצוני להמליץ על פעילויות שיתאימו לכם
ספרו לי - כמה אנשים אתם? ספרו מה מעניין אתכם? 100 פעילויות שמחכות לכם!"

חוקי תקשורת קריטיים:
1. **אסור לחלוטין** להשתמש בסלנג ערבי - רק עברית תקנית
2. **שאל 1-2 שאלות בלבד** בכל תגובה - לא יותר!
3. **חובה לחלק שאלות ל-2 מסכים**:
   - מסך 1: "בואו נתחיל - ספרו לי כמה אנשים אתם ומה הסיטואציה?"
   - אחרי התשובה → מסך 2: "נהדר! עכשיו, מה התאריכים ומה התקציב המשוער לאדם?"
4. **ודא שהמשתמש ענה** לפני שאתה ממשיך לשאלה הבאה
5. **עודד תשובות**: אם המשתמש לא ענה, אמור: "אשמח לשמוע את התשובה שלך כדי שאוכל לעזור לך בצורה הטובה ביותר 😊"
6. **הצג המלצות ראשונות**: תמיד התחל עם 4 ההמלצות המובילות
7. **היה סבלני** - תן למשתמש זמן לענות ואל תלחץ

דוגמאות למילים שאסור להשתמש בהן:
❌ יאללה → ✓ קדימה, בואו
❌ אז יאללה → ✓ בואו (ללא "אז יאללה" או "יאללה")
❌ אחלה → ✓ מצוין, נהדר
❌ סבבה → ✓ בסדר, נפלא
❌ וואלה → ✓ באמת, כן

**משפט סיכום חובה בסוף שיחה:**
כשמזכירים את דויד והטלפון, השתמש במשפט זה בדיוק:
"בואו נמשיך לתכנן את יום הגיבוש המטורף שלכם! וכשתהיו מוכנים לסגירה סופית של כל הפרטים, זכרו שדויד בטלפון 0537314235 הוא האיש שלכם!"

אסור להתחיל עם "אז יאללה" או "יאללה" - תמיד התחל עם "בואו".

זכור: המטרה היא לעזור בעברית טהורה, לא ללחוץ. תן ללקוח זמן להוביל את השיחה בקצב שלו.

**מבנה שיחה מומלץ:**
1. הצג 4 המלצות מובילות
2. שאל על כמות אנשים וסיטואציה (המתן לתשובה)
3. שאל על תאריכים ותקציב (המתן לתשובה)
4. שאל מה ספציפית מעניין מהרשימה (המתן לתשובה)
5. הצע חבילה מותאמת

אם הלקוח לא ענה - עודד אותו בעדינות לענות.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    const { message, conversationId, sessionId, quizResults, conversationData, currentStep, requestFinalRecommendation, language = 'he' } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get system prompt from database
    const { data: promptData } = await supabase
      .from('ai_prompts')
      .select('prompt_text')
      .eq('prompt_key', 'ai_chat_agent')
      .single();

    // Use English system prompt for English mode
    const DEFAULT_ENGLISH_PROMPT = `You are a tour expert for Simcha Tours in Northern Israel. You help users plan their perfect tour experience in the Gilboa, Springs Valley, and Galilee region.

Opening message (only at start of new conversation):
"Hello! I'm a tour expert offering experiences:
🔥 Adventure | 💧 Nature | 🏛️ History | 🍷 Culinary | ⚡ Sports | 🎨 Creative | 🌿 Wellness | 🤝 Team Building

Answer the questions and I'll recommend activities that suit you!
Tell me - how many people are you? What interests you? 100 activities are waiting for you!"

Communication rules:
1. Ask only 1-2 questions per response
2. Wait for the user to answer before continuing
3. Show top 4 recommendations first
4. Be patient - let the customer lead the conversation

Closing statement when mentioning David and phone:
"Let's continue planning your amazing day! And when you're ready to finalize all the details, remember that David at 0537314235 is your go-to person!"

Recommended conversation flow:
1. Show top 4 recommendations
2. Ask about group size and occasion (wait for answer)
3. Ask about dates and budget (wait for answer)
4. Ask what specifically interests them (wait for answer)
5. Suggest a customized package`;

    const systemPrompt = language === 'en' 
      ? (promptData?.prompt_text || DEFAULT_ENGLISH_PROMPT)
      : (promptData?.prompt_text || DEFAULT_SYSTEM_PROMPT);

    // Fetch knowledge base entries filtered by language
    const { data: knowledgeBase } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('is_active', true)
      .eq('language', language)
      .order('priority', { ascending: false });

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      conversation = data;
    } else {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          session_id: sessionId,
          quiz_results_id: quizResults?.id || null,
          detected_mood: quizResults?.top_categories || [],
          confidence_score: 0.8
        })
        .select()
        .single();
      
      if (error) throw error;
      conversation = data;
    }

    // Get conversation history
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });

    // Build context from conversation data
    let dataContext = "";
    if (conversationData) {
      dataContext = `\n\nמידע שנאסף עד כה:\n`;
      if (conversationData.categories) dataContext += `קטגוריות: ${conversationData.categories.join(', ')}\n`;
      if (conversationData.numberOfPeople) dataContext += `מספר אנשים: ${conversationData.numberOfPeople}\n`;
      if (conversationData.situation) dataContext += `סיטואציה: ${conversationData.situation}\n`;
      if (conversationData.dates) dataContext += `תאריכים: ${conversationData.dates}\n`;
      if (conversationData.budget) dataContext += `תקציב: ${conversationData.budget}\n`;
      if (conversationData.specificInterests) dataContext += `תחומי עניין: ${conversationData.specificInterests}\n`;
      if (conversationData.transport) dataContext += `הסעות: ${conversationData.transport}\n`;
      
      dataContext += `\nשלב נוכחי: ${currentStep}/3\n`;
      dataContext += `\nהנחיות: בדוק אם המשתמש מבקש לשנות מידע קיים (למשל "שנה ל-15 אנשים") ועדכן בהתאם.\n`;
    }

    // Build context from quiz results
    let quizContext = "";
    if (quizResults) {
      quizContext = `\n\nתוצאות Quiz של הלקוח:\n`;
      quizContext += `קטגוריות מובילות: ${quizResults.top_categories.join(', ')}\n`;
      quizContext += `התפלגות: ${JSON.stringify(quizResults.percentages)}\n`;
      quizContext += `זה אומר שהלקוח מחפש חוויה ש`;
      
      const topCategory = quizResults.top_categories[0];
      const categoryDescriptions: Record<string, string> = {
        adventure: "מלאת אדרנלין והרפתקאות מרגשות",
        nature: "מתחברת לטבע ונופים יפים",
        history: "עשירה בהיסטוריה ולימוד",
        culinary: "כוללת חוויות קולינריות מיוחדות",
        sports: "פעילה ותחרותית",
        creative: "מעוררת יצירתיות",
        wellness: "מרגיעה ומחזקת בריאות"
      };
      
      quizContext += categoryDescriptions[topCategory as keyof typeof categoryDescriptions] || "מגוונת ומעניינת";
    }

    // Build knowledge base context
    let knowledgeContext = "\n\nמאגר ידע וQ&A:\n";
    if (knowledgeBase && knowledgeBase.length > 0) {
      knowledgeBase.forEach((entry: any) => {
        knowledgeContext += `\nשאלה: ${entry.question}\nתשובה: ${entry.answer}\n`;
      });
      knowledgeContext += "\nהשתמש במידע זה כדי לענות על שאלות הלקוחות בצורה מדויקת ועקבית.";
    }

    // Store user message
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversation.id,
        sender: 'user',
        message: message,
        message_type: 'text'
      });

    // Build message history for AI
    const conversationHistory = messages?.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.message
    })) || [];

    // Call Lovable AI with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    let response;
    try {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { 
              role: "system", 
              content: systemPrompt + quizContext + knowledgeContext + dataContext + 
                `\n\n**CRITICAL LANGUAGE INSTRUCTION**: You MUST respond in ${language === 'he' ? 'Hebrew (עברית)' : 'English'}. The user's preferred language is ${language === 'he' ? 'Hebrew' : 'English'}. Even if the user writes in a different language, ALWAYS respond in ${language === 'he' ? 'Hebrew' : 'English'}.`
            },
            ...conversationHistory,
            { role: "user", content: message }
          ],
          temperature: 0.8,
          max_tokens: requestFinalRecommendation ? 1500 : 1000
        }),
        signal: controller.signal
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('AI request timeout');
        return new Response(
          JSON.stringify({ 
            error: "הבקשה ארכה יותר מדי זמן. אנא נסו שוב או צרו קשר ישירות ל-0537314235",
            fallback: "בקשה נכשלה - זמן תגובה ארוך מדי"
          }),
          { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    // Generate quick reply suggestions based on context and language
    const isEnglish = language === 'en';
    const quickReplies = [];
    if (!messages || messages.length <= 1) {
      // First interaction - offer main options
      if (isEnglish) {
        quickReplies.push(
          "What do you offer?",
          "How much does it cost?",
          "Where are you located?",
          "I'd like to speak with someone"
        );
      } else {
        quickReplies.push(
          "מה אתם מציעים?",
          "כמה עולה?",
          "איפה אתם ממוקמים?",
          "רוצה לדבר עם בן אדם"
        );
      }
    } else {
      // Context-aware suggestions
      const lastMessages = messages?.slice(-3).map((m: any) => m.message).join(' ') || '';
      if (lastMessages.includes('מחיר') || lastMessages.includes('עולה') || lastMessages.includes('cost') || lastMessages.includes('price')) {
        quickReplies.push(
          isEnglish ? "Give me a quote" : "תנו לי הצעת מחיר",
          isEnglish ? "What's included?" : "מה כלול במחיר?"
        );
      }
      if (lastMessages.includes('זמן') || lastMessages.includes('משך') || lastMessages.includes('time') || lastMessages.includes('long')) {
        quickReplies.push(
          isEnglish ? "How long does it take?" : "כמה זמן נמשך?",
          isEnglish ? "When can we start?" : "מתי אפשר להתחיל?"
        );
      }
      if (lastMessages.includes('קבוצה') || lastMessages.includes('צוות') || lastMessages.includes('group') || lastMessages.includes('team')) {
        quickReplies.push(
          isEnglish ? "What's the minimum group size?" : "כמה אנשים מינימום?",
          isEnglish ? "What suits our group?" : "מה מתאים לקבוצה שלנו?"
        );
      }
      if (quickReplies.length < 3) {
        quickReplies.push(
          isEnglish ? "Interesting, tell me more" : "מעניין, ספרו עוד",
          isEnglish ? "I'd like to speak with someone" : "רוצה לדבר עם בן אדם"
        );
      }
    }

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "מצטערים, יש עומס רב כרגע. אנא נסו שוב בעוד רגע או התקשרו ישירות ל-0537314235" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "שירות AI זמנית לא זמין. אנא צרו קשר ישירות בטלפון 0537314235" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const aiMessage = aiResponse.choices[0].message.content;

    // Extract structured data from conversation
    const extractedData: any = {};
    
    // Extract number of people
    const peopleMatch = message.match(/(\d+)\s*(אנשים|איש|משתתפים)/);
    if (peopleMatch) {
      extractedData.numberOfPeople = parseInt(peopleMatch[1]);
    }
    
    // Extract categories from message (simple keyword matching)
    const categoryKeywords: Record<string, string[]> = {
      adventure: ['הרפתקה', 'אדרנלין', 'שטח', 'אתגר'],
      nature: ['טבע', 'נוף', 'מעיינות', 'טיול'],
      history: ['היסטוריה', 'עתיקות', 'בית שאן', 'תרבות'],
      culinary: ['אוכל', 'קולינריה', 'ארוחה', 'מטעמים'],
      sports: ['ספורט', 'פעיל', 'אקטיבי'],
      creative: ['יצירה', 'אמנות', 'סדנה'],
      wellness: ['רוגע', 'בריאות', 'מרגיע', 'יוגה']
    };
    
    const detectedCategories: string[] = [];
    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      if (keywords.some(keyword => message.includes(keyword))) {
        detectedCategories.push(category);
      }
    });
    
    if (detectedCategories.length > 0) {
      extractedData.categories = detectedCategories;
    }
    
    // Extract dates
    if (message.includes('תאריך') || /\d{1,2}[\/\-\.]\d{1,2}/.test(message)) {
      extractedData.dates = message;
    }
    
    // Extract budget
    if (message.includes('תקציב') || message.includes('₪') || message.includes('שקל')) {
      extractedData.budget = message;
    }
    
    // Extract situation
    if (message.includes('צוות') || message.includes('גיבוש') || message.includes('חברה')) {
      extractedData.situation = message;
    }

    // Detect Arabic slang and score Hebrew quality
    const arabicDetection = detectArabicSlang(aiMessage);
    const hebrewQuality = scoreHebrewQuality(aiMessage);
    
    console.log('Language Quality Analysis:', {
      arabicSlangDetected: arabicDetection.found,
      arabicWords: arabicDetection.words,
      hebrewQualityScore: hebrewQuality.score,
      qualityDetails: hebrewQuality.details
    });
    
    // Send low confidence alert if Arabic detected
    if (arabicDetection.found) {
      console.error('🚨 ARABIC SLANG DETECTED:', arabicDetection.words);
      try {
        await supabase.functions.invoke('send-low-confidence-alert', {
          body: {
            conversationId: conversation.id,
            message: aiMessage,
            issue: 'Arabic slang detected',
            arabicWords: arabicDetection.words,
            hebrewQualityScore: hebrewQuality.score
          }
        });
      } catch (alertError) {
        console.error('Failed to send Arabic detection alert:', alertError);
      }
    }

    // Analyze sentiment (simple keyword-based)
    let sentiment = 0;
    const positiveWords = ['מעולה', 'נהדר', 'מעניין', 'כן', 'בטח', 'אשמח'];
    const negativeWords = ['לא', 'אין', 'לא מתאים', 'יקר', 'רחוק'];
    
    const lowerMessage = message.toLowerCase();
    positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) sentiment += 0.2;
    });
    negativeWords.forEach(word => {
      if (lowerMessage.includes(word)) sentiment -= 0.2;
    });
    sentiment = Math.max(-1, Math.min(1, sentiment));

    // Store AI response with quality metrics
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversation.id,
        sender: 'ai',
        message: aiMessage,
        message_type: 'text',
        sentiment_score: sentiment,
        detected_emotions: {
          hebrewQualityScore: hebrewQuality.score,
          arabicSlangDetected: arabicDetection.found,
          arabicWords: arabicDetection.words,
          qualityDetails: hebrewQuality.details
        }
      });

    // Log interaction with language quality metrics and performance
    const responseTime = Date.now() - startTime;
    await supabase
      .from('ai_interaction_metrics')
      .insert({
        conversation_id: conversation.id,
        interaction_type: 'message_exchange',
        details: {
          user_message_length: message.length,
          ai_response_length: aiMessage.length,
          sentiment: sentiment,
          quiz_context_used: !!quizResults,
          hebrewQualityScore: hebrewQuality.score,
          arabicSlangDetected: arabicDetection.found,
          arabicWords: arabicDetection.words,
          languageQualityDetails: hebrewQuality.details,
          responseTimeMs: responseTime,
          timestamp: new Date().toISOString()
        }
      });
    
    console.log(`Performance: Request completed in ${responseTime}ms`);

    return new Response(
      JSON.stringify({
        message: aiMessage,
        conversationId: conversation.id,
        sentiment: sentiment,
        quickReplies: quickReplies.slice(0, 4),
        conversationData: extractedData,
        languageQuality: {
          hebrewScore: hebrewQuality.score,
          arabicDetected: arabicDetection.found,
          arabicWords: arabicDetection.words
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Chat Agent Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: "מצטערים, נתקלנו בבעיה. אנא נסו שוב או צרו קשר ישירות ל-0537314235"
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
