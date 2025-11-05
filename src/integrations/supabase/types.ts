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
      [_ in never]: never
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
