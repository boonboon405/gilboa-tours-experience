import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

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

// Default system prompt (fallback if database is unavailable)
const DEFAULT_SYSTEM_PROMPT = `אתה מדריך טיולים AI מומחה לצפון ישראל. אתה עוזר למשתמשים לתכנן את חוויית הטיול המושלמת שלהם.

הודעת פתיחה (רק בהתחלת שיחה חדשה):
כשהשיחה מתחילה, פתח בהודעה הזו בדיוק:
"שלום! אני הסוכן הדיגיטלי של החברה - טיולים עם דויד. אני כאן לעזור לכם למצוא את החוויה המושלמת לצוות שלכם שיהיה לכם יום כייף מוצלח ביותר ובלתי נשכח! ספרו לי - כמה אנשים אתם? מה מעניין אתכם?"

חוקי תקשורת חשובים:
1. דבר בעברית פשוטה וברורה - ללא סלנג מערבית (אל תשתמש במילים כמו: אחלה, יאללה, סחתיין, וכו')
2. השתמש רק במילים עבריות תקניות ופשוטות
3. שאל לא יותר מ-3 שאלות בכל תגובה - אל תציף את המשתמש
4. היה בטוח ועוזר, אבל לא לוחץ או אגרסיבי במכירה
5. תן למשתמש זמן לענות - אל תמהר לשאלה הבאה
6. התאם את טון הדיבור להיות חם ומזמין אבל מקצועי
7. הקפד על עברית תקנית - אם אתה מזהה שהשפה היא עברית, דבר רק בעברית פשוטה

זכור: המטרה היא לעזור ולייעץ, לא ללחוץ. תן למשתמש להוביל את השיחה בקצב שלו.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, sessionId, quizResults } = await req.json();
    
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

    const systemPrompt = promptData?.prompt_text || DEFAULT_SYSTEM_PROMPT;

    // Fetch knowledge base entries
    const { data: knowledgeBase } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('is_active', true)
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

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt + quizContext + knowledgeContext },
          ...conversationHistory,
          { role: "user", content: message }
        ],
        temperature: 0.8,
        max_tokens: 1000
      }),
    });

    // Generate quick reply suggestions based on context
    const quickReplies = [];
    if (!messages || messages.length <= 1) {
      // First interaction - offer main options
      quickReplies.push(
        "מה אתם מציעים?",
        "כמה עולה?",
        "איפה אתם ממוקמים?",
        "רוצה לדבר עם בן אדם"
      );
    } else {
      // Context-aware suggestions
      const lastMessages = messages?.slice(-3).map((m: any) => m.message).join(' ') || '';
      if (lastMessages.includes('מחיר') || lastMessages.includes('עולה')) {
        quickReplies.push("תנו לי הצעת מחיר", "מה כלול במחיר?");
      }
      if (lastMessages.includes('זמן') || lastMessages.includes('משך')) {
        quickReplies.push("כמה זמן נמשך?", "מתי אפשר להתחיל?");
      }
      if (lastMessages.includes('קבוצה') || lastMessages.includes('צוות')) {
        quickReplies.push("כמה אנשים מינימום?", "מה מתאים לקבוצה שלנו?");
      }
      if (quickReplies.length < 3) {
        quickReplies.push("מעניין, ספרו עוד", "רוצה לדבר עם בן אדם");
      }
    }

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "מצטערים, יש עומס רב כרגע. אנא נסו שוב בעוד רגע או התקשרו ישירות ל-053-7314235" }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "שירות AI זמנית לא זמין. אנא צרו קשר ישירות בטלפון 053-7314235" }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const aiMessage = aiResponse.choices[0].message.content;

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

    // Store AI response
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversation.id,
        sender: 'ai',
        message: aiMessage,
        message_type: 'text',
        sentiment_score: sentiment
      });

    // Log interaction
    await supabase
      .from('ai_interaction_metrics')
      .insert({
        conversation_id: conversation.id,
        interaction_type: 'message_exchange',
        details: {
          user_message_length: message.length,
          ai_response_length: aiMessage.length,
          sentiment: sentiment,
          quiz_context_used: !!quizResults
        }
      });

    return new Response(
      JSON.stringify({
        message: aiMessage,
        conversationId: conversation.id,
        sentiment: sentiment,
        quickReplies: quickReplies.slice(0, 4)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Chat Agent Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: "מצטערים, נתקלנו בבעיה. אנא נסו שוב או צרו קשר ישירות ל-053-7314235" 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
