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
      ai_prompt_versions: {
        Row: {
          change_note: string | null
          changed_by: string | null
          created_at: string
          id: string
          prompt_id: string
          prompt_text: string
        }
        Insert: {
          change_note?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          prompt_id: string
          prompt_text: string
        }
        Update: {
          change_note?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          prompt_id?: string
          prompt_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_prompt_versions_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "ai_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_prompts: {
        Row: {
          created_at: string
          description: string | null
          id: string
          prompt_key: string
          prompt_text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          prompt_key: string
          prompt_text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          prompt_key?: string
          prompt_text?: string
          updated_at?: string
        }
        Relationships: []
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
      categories: {
        Row: {
          category_key: string
          color: string
          created_at: string
          description: string
          display_order: number | null
          icon: string
          id: string
          is_active: boolean
          name: string
          recommendations: Json | null
          updated_at: string
        }
        Insert: {
          category_key: string
          color?: string
          created_at?: string
          description: string
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean
          name: string
          recommendations?: Json | null
          updated_at?: string
        }
        Update: {
          category_key?: string
          color?: string
          created_at?: string
          description?: string
          display_order?: number | null
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          recommendations?: Json | null
          updated_at?: string
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
      contact_tracking: {
        Row: {
          contact_type: string
          contact_value: string
          created_at: string
          id: string
          message_template: string | null
          referrer: string | null
          source_page: string | null
          user_agent: string | null
          user_session: string | null
        }
        Insert: {
          contact_type: string
          contact_value: string
          created_at?: string
          id?: string
          message_template?: string | null
          referrer?: string | null
          source_page?: string | null
          user_agent?: string | null
          user_session?: string | null
        }
        Update: {
          contact_type?: string
          contact_value?: string
          created_at?: string
          id?: string
          message_template?: string | null
          referrer?: string | null
          source_page?: string | null
          user_agent?: string | null
          user_session?: string | null
        }
        Relationships: []
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
      email_queue: {
        Row: {
          booking_id: string | null
          created_at: string
          error_message: string | null
          html_content: string
          id: string
          lead_id: string | null
          recipient_email: string
          scheduled_for: string
          sent_at: string | null
          sequence_id: string | null
          status: string
          step_id: string | null
          subject: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          error_message?: string | null
          html_content: string
          id?: string
          lead_id?: string | null
          recipient_email: string
          scheduled_for: string
          sent_at?: string | null
          sequence_id?: string | null
          status?: string
          step_id?: string | null
          subject: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          error_message?: string | null
          html_content?: string
          id?: string
          lead_id?: string | null
          recipient_email?: string
          scheduled_for?: string
          sent_at?: string | null
          sequence_id?: string | null
          status?: string
          step_id?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_queue_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_queue_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_queue_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "email_sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_queue_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "email_sequence_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequence_steps: {
        Row: {
          created_at: string
          delay_hours: number
          html_content: string
          id: string
          sequence_id: string
          step_order: number
          subject: string
          template_id: string | null
        }
        Insert: {
          created_at?: string
          delay_hours?: number
          html_content: string
          id?: string
          sequence_id: string
          step_order: number
          subject: string
          template_id?: string | null
        }
        Update: {
          created_at?: string
          delay_hours?: number
          html_content?: string
          id?: string
          sequence_id?: string
          step_order?: number
          subject?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sequence_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "email_sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sequence_steps_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequences: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          trigger_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          trigger_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          html_content: string
          id: string
          is_active: boolean
          name: string
          subject: string
          template_type: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          html_content: string
          id?: string
          is_active?: boolean
          name: string
          subject: string
          template_type: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          html_content?: string
          id?: string
          is_active?: boolean
          name?: string
          subject?: string
          template_type?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt_text: string
          category: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          alt_text: string
          category: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          alt_text?: string
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      generated_images: {
        Row: {
          created_at: string
          id: string
          image_key: string
          image_type: string
          image_url: string
          prompt: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_key: string
          image_type: string
          image_url: string
          prompt?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_key?: string
          image_type?: string
          image_url?: string
          prompt?: string | null
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
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
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
      testimonials: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          customer_company: string | null
          customer_email: string | null
          customer_name: string
          id: string
          image_url: string | null
          is_featured: boolean
          rating: number
          status: string
          testimonial_text: string
          tour_date: string | null
          tour_type: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          customer_company?: string | null
          customer_email?: string | null
          customer_name: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          rating: number
          status?: string
          testimonial_text: string
          tour_date?: string | null
          tour_type?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          customer_company?: string | null
          customer_email?: string | null
          customer_name?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          rating?: number
          status?: string
          testimonial_text?: string
          tour_date?: string | null
          tour_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      make_admin: { Args: { user_email: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
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
