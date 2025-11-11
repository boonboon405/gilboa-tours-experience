export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_interaction_metrics: {
        Row: {
          conversation_id: string
          details: Json | null
          id: string
          interaction_type: string
          timestamp: string
        }
        Insert: {
          conversation_id: string
          details?: Json | null
          id?: string
          interaction_type: string
          timestamp?: string
        }
        Update: {
          conversation_id?: string
          details?: Json | null
          id?: string
          interaction_type?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_interaction_metrics_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string
          customer_company: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          participants_count: number
          preferred_language: string | null
          selected_destinations: Json | null
          special_requests: string | null
          status: string
          tour_date: string
          tour_duration: string | null
          tour_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_company?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          participants_count: number
          preferred_language?: string | null
          selected_destinations?: Json | null
          special_requests?: string | null
          status?: string
          tour_date: string
          tour_duration?: string | null
          tour_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_company?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          participants_count?: number
          preferred_language?: string | null
          selected_destinations?: Json | null
          special_requests?: string | null
          status?: string
          tour_date?: string
          tour_duration?: string | null
          tour_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          conversation_id: string
          created_at: string
          detected_emotions: Json | null
          id: string
          message: string
          message_type: string
          sender: string
          sentiment_score: number | null
        }
        Insert: {
          conversation_id: string
          created_at?: string
          detected_emotions?: Json | null
          id?: string
          message: string
          message_type?: string
          sender: string
          sentiment_score?: number | null
        }
        Update: {
          conversation_id?: string
          created_at?: string
          detected_emotions?: Json | null
          id?: string
          message?: string
          message_type?: string
          sender?: string
          sentiment_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          confidence_score: number | null
          created_at: string
          detected_mood: string[] | null
          id: string
          last_message_at: string
          lead_id: string | null
          quiz_results_id: string | null
          session_id: string
          started_at: string
          status: string
          user_email: string | null
          user_name: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          detected_mood?: string[] | null
          id?: string
          last_message_at?: string
          lead_id?: string | null
          quiz_results_id?: string | null
          session_id: string
          started_at?: string
          status?: string
          user_email?: string | null
          user_name?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          detected_mood?: string[] | null
          id?: string
          last_message_at?: string
          lead_id?: string | null
          quiz_results_id?: string | null
          session_id?: string
          started_at?: string
          status?: string
          user_email?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_quiz_results_id_fkey"
            columns: ["quiz_results_id"]
            isOneToOne: false
            referencedRelation: "quiz_results"
            referencedColumns: ["id"]
          },
        ]
      }
      email_archive: {
        Row: {
          email_data: Json | null
          error_message: string | null
          html_content: string
          id: string
          recipient_email: string
          sent_at: string
          status: string
          subject: string
        }
        Insert: {
          email_data?: Json | null
          error_message?: string | null
          html_content: string
          id?: string
          recipient_email: string
          sent_at?: string
          status?: string
          subject: string
        }
        Update: {
          email_data?: Json | null
          error_message?: string | null
          html_content?: string
          id?: string
          recipient_email?: string
          sent_at?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          keywords: string[] | null
          priority: number | null
          question: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          keywords?: string[] | null
          priority?: number | null
          question: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          keywords?: string[] | null
          priority?: number | null
          question?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_to: string | null
          contact_status: Database["public"]["Enums"]["contact_status"]
          created_at: string
          email: string | null
          engagement_type: Database["public"]["Enums"]["engagement_type"]
          id: string
          interested_keywords: string[] | null
          last_contacted_at: string | null
          name: string
          notes: string | null
          phone: string | null
          source_platform: Database["public"]["Enums"]["lead_source"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          contact_status?: Database["public"]["Enums"]["contact_status"]
          created_at?: string
          email?: string | null
          engagement_type?: Database["public"]["Enums"]["engagement_type"]
          id?: string
          interested_keywords?: string[] | null
          last_contacted_at?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          source_platform?: Database["public"]["Enums"]["lead_source"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          contact_status?: Database["public"]["Enums"]["contact_status"]
          created_at?: string
          email?: string | null
          engagement_type?: Database["public"]["Enums"]["engagement_type"]
          id?: string
          interested_keywords?: string[] | null
          last_contacted_at?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          source_platform?: Database["public"]["Enums"]["lead_source"]
          updated_at?: string
        }
        Relationships: []
      }
      live_chat_conversations: {
        Row: {
          assigned_to: string | null
          created_at: string
          id: string
          session_id: string
          status: string
          updated_at: string
          visitor_email: string | null
          visitor_name: string | null
          visitor_phone: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          session_id: string
          status?: string
          updated_at?: string
          visitor_email?: string | null
          visitor_name?: string | null
          visitor_phone?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          session_id?: string
          status?: string
          updated_at?: string
          visitor_email?: string | null
          visitor_name?: string | null
          visitor_phone?: string | null
        }
        Relationships: []
      }
      live_chat_messages: {
        Row: {
          agent_feedback: string | null
          ai_confidence_score: number | null
          conversation_id: string
          created_at: string
          id: string
          message: string
          read_by_agent: boolean | null
          read_by_visitor: boolean | null
          sender_name: string | null
          sender_type: string
        }
        Insert: {
          agent_feedback?: string | null
          ai_confidence_score?: number | null
          conversation_id: string
          created_at?: string
          id?: string
          message: string
          read_by_agent?: boolean | null
          read_by_visitor?: boolean | null
          sender_name?: string | null
          sender_type: string
        }
        Update: {
          agent_feedback?: string | null
          ai_confidence_score?: number | null
          conversation_id?: string
          created_at?: string
          id?: string
          message?: string
          read_by_agent?: boolean | null
          read_by_visitor?: boolean | null
          sender_name?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "live_chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      message_logs: {
        Row: {
          created_at: string
          error_message: string | null
          external_id: string | null
          id: string
          lead_id: string | null
          message_content: string
          message_type: string
          recipient: string
          sent_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          external_id?: string | null
          id?: string
          lead_id?: string | null
          message_content: string
          message_type: string
          recipient: string
          sent_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          external_id?: string | null
          id?: string
          lead_id?: string | null
          message_content?: string
          message_type?: string
          recipient?: string
          sent_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          created_at: string
          id: string
          percentages: Json
          scores: Json
          session_id: string | null
          top_categories: string[]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          percentages: Json
          scores: Json
          session_id?: string | null
          top_categories: string[]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          percentages?: Json
          scores?: Json
          session_id?: string | null
          top_categories?: string[]
          user_id?: string | null
        }
        Relationships: []
      }
      seo_keywords: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          keyword: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          keyword: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          keyword?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_category_stats: {
        Args: never
        Returns: {
          appearance_count: number
          avg_percentage: number
          category: string
        }[]
      }
    }
    Enums: {
      contact_status:
        | "new"
        | "contacted"
        | "interested"
        | "not_interested"
        | "converted"
        | "follow_up"
      engagement_type:
        | "comment"
        | "dm"
        | "ad_click"
        | "form_submission"
        | "phone_call"
        | "email"
        | "other"
      lead_source:
        | "instagram"
        | "facebook"
        | "tiktok"
        | "website"
        | "referral"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      contact_status: [
        "new",
        "contacted",
        "interested",
        "not_interested",
        "converted",
        "follow_up",
      ],
      engagement_type: [
        "comment",
        "dm",
        "ad_click",
        "form_submission",
        "phone_call",
        "email",
        "other",
      ],
      lead_source: [
        "instagram",
        "facebook",
        "tiktok",
        "website",
        "referral",
        "other",
      ],
    },
  },
} as const
