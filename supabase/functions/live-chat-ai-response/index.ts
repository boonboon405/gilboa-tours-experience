import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `אתה סוכן תמיכה AI של חוויות גלבוע-בית שאן, צפון ישראל.

🎯 תפקידך:
- לענות על שאלות נפוצות ולספק מידע מדויק
- לעזור ללקוחות להבין את השירותים שלנו
- להפנות לנציג אנושי כשצריך

📋 מידע חשוב:
- אנחנו מתמחים בסיורים ופעילויות בגלבוע ובית שאן
- יש לנו יותר מ-100 פעילויות שונות
- אנחנו מציעים סיורים מותאמים אישית לצוותים וקבוצות
- כולל: רכבי שטח, בית שאן העתיקה, מעיינות סחנה, חוויות קולינריות ועוד
- ניתן לשלב מספר פעילויות ליום מלא

💬 סגנון תקשורת:
- ענה בעברית טבעית וידידותית
- תן תשובות קצרות ומדויקות (2-4 משפטים)
- אם אינך בטוח או השאלה מורכבת - הפנה לנציג אנושי
- תמיד ציין שנציג אמיתי יהיה זמין בקרוב

📞 מידע ליצירת קשר:
- טלפון: 053-7314235
- דוד רחימי - בעל החברה
- זמינות: א׳-ה׳ 08:00-20:00, ו׳ 08:00-14:00

⚠️ כשלהפנות לנציג:
- שאלות על מחירים ספציפיים
- בקשות להזמנה מיידית
- שאלות מורכבות על לוגיסטיקה
- תלונות או בעיות
- כל בקשה מפורשת לדבר עם בן אדם

זכור: אתה כאן לעזור ולתת מענה ראשוני - נציג אמיתי תמיד זמין למי שצריך!`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationId, message } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get conversation history (last 10 messages for context)
    const { data: messages } = await supabase
      .from('live_chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    // Build message history for AI
    const conversationHistory = messages?.map(msg => ({
      role: msg.sender_type === 'visitor' ? 'user' : 'assistant',
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
          { role: "system", content: systemPrompt },
          ...conversationHistory,
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "מצטערים, יש עומס רב כרגע. נציג אנושי יחזור אליכם בהקדם או התקשרו ישירות ל-053-7314235",
            fallback: "אנא המתינו לנציג או התקשרו ישירות"
          }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "שירות AI זמנית לא זמין. נציג אמיתי יחזור אליכם בקרוב או התקשרו ל-053-7314235",
            fallback: "אנא המתינו לנציג אנושי"
          }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("AI gateway error");
    }

    const aiResponse = await response.json();
    const aiMessage = aiResponse.choices[0].message.content;

    // Check if AI suggests human agent (keywords detection)
    const needsHumanAgent = 
      aiMessage.includes('נציג') || 
      aiMessage.includes('053-7314235') ||
      aiMessage.includes('דוד') ||
      aiMessage.toLowerCase().includes('human') ||
      message.includes('להזמין') ||
      message.includes('מחיר') ||
      message.includes('כמה עולה');

    // Calculate confidence score based on response quality
    let confidenceScore = 0.8; // Default high confidence
    
    // Lower confidence if suggesting human agent
    if (needsHumanAgent) confidenceScore = 0.4;
    
    // Lower confidence for pricing/booking questions
    if (message.includes('מחיר') || message.includes('כמה עולה') || message.includes('להזמין')) {
      confidenceScore = 0.3;
    }
    
    // Lower confidence if response is too short (might be unclear)
    if (aiMessage.length < 50) confidenceScore = 0.5;
    
    // Higher confidence for informational questions
    if (message.includes('מה זה') || message.includes('איך') || message.includes('איפה')) {
      confidenceScore = Math.min(confidenceScore + 0.2, 0.95);
    }

    console.log("AI Response:", aiMessage, "Confidence:", confidenceScore);

    // Get conversation details for email alert
    const { data: conversation } = await supabase
      .from('live_chat_conversations')
      .select('visitor_name')
      .eq('id', conversationId)
      .single();

    // Send email alert if confidence is low
    if (confidenceScore < 0.4) {
      try {
        console.log("Triggering low confidence email alert");
        await fetch(`${SUPABASE_URL}/functions/v1/send-low-confidence-alert`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            conversationId,
            visitorName: conversation?.visitor_name,
            message: aiMessage,
            confidenceScore,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send email alert:", emailError);
        // Don't fail the response if email fails
      }
    }

    // Store AI response in database with confidence score
    await supabase
      .from('live_chat_messages')
      .insert({
        conversation_id: conversationId,
        sender_type: 'agent',
        sender_name: 'AI Assistant',
        message: aiMessage,
        read_by_visitor: false,
        read_by_agent: true,
        ai_confidence_score: confidenceScore
      });

    // Update conversation timestamp
    await supabase
      .from('live_chat_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return new Response(
      JSON.stringify({
        message: aiMessage,
        needsHumanAgent,
        isAiResponse: true,
        confidenceScore
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Response Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: "מצטערים, נתקלנו בבעיה. נציג אמיתי יחזור אליכם בקרוב או התקשרו ל-053-7314235" 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
