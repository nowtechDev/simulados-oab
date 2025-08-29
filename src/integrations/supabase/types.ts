export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agentes_ia: {
        Row: {
          arquivos: Json | null
          ativo: boolean
          created_at: string
          ia_provider: string
          id: string
          links: string[] | null
          nome: string
          prompt: string
          token_agente: string | null
          token_id: string | null
          updated_at: string
          versao: string | null
        }
        Insert: {
          arquivos?: Json | null
          ativo?: boolean
          created_at?: string
          ia_provider: string
          id?: string
          links?: string[] | null
          nome: string
          prompt: string
          token_agente?: string | null
          token_id?: string | null
          updated_at?: string
          versao?: string | null
        }
        Update: {
          arquivos?: Json | null
          ativo?: boolean
          created_at?: string
          ia_provider?: string
          id?: string
          links?: string[] | null
          nome?: string
          prompt?: string
          token_agente?: string | null
          token_id?: string | null
          updated_at?: string
          versao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agentes_ia_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_progress: {
        Row: {
          answered_questions: number | null
          answers: Json | null
          correct_answers: number | null
          exam_id: number
          id: string
          last_updated: string | null
          total_questions: number | null
          user_id: string
        }
        Insert: {
          answered_questions?: number | null
          answers?: Json | null
          correct_answers?: number | null
          exam_id: number
          id?: string
          last_updated?: string | null
          total_questions?: number | null
          user_id: string
        }
        Update: {
          answered_questions?: number | null
          answers?: Json | null
          correct_answers?: number | null
          exam_id?: number
          id?: string
          last_updated?: string | null
          total_questions?: number | null
          user_id?: string
        }
        Relationships: []
      }
      ia_interactions: {
        Row: {
          cost_usd: number | null
          created_at: string
          id: string
          metadata: Json | null
          model: string
          page_context: string
          prompt: string
          provider: string
          response: string
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string
          id?: string
          metadata?: Json | null
          model: string
          page_context: string
          prompt: string
          provider: string
          response: string
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          cost_usd?: number | null
          created_at?: string
          id?: string
          metadata?: Json | null
          model?: string
          page_context?: string
          prompt?: string
          provider?: string
          response?: string
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
      institutions: {
        Row: {
          admin_email: string | null
          created_at: string
          id: string
          nome: string
          plano: string | null
          usuarios: number | null
        }
        Insert: {
          admin_email?: string | null
          created_at?: string
          id?: string
          nome: string
          plano?: string | null
          usuarios?: number | null
        }
        Update: {
          admin_email?: string | null
          created_at?: string
          id?: string
          nome?: string
          plano?: string | null
          usuarios?: number | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          bank: string | null
          created_at: string
          date: string | null
          datePay: string | null
          expiration: string | null
          id: string
          lastDatePay: string | null
          method_pay: string | null
          payment_id: string | null
          plan_id: number | null
          plan_user_id: string | null
          status: string | null
          user_id: string | null
          user_id_: number | null
          value: number | null
        }
        Insert: {
          bank?: string | null
          created_at?: string
          date?: string | null
          datePay?: string | null
          expiration?: string | null
          id?: string
          lastDatePay?: string | null
          method_pay?: string | null
          payment_id?: string | null
          plan_id?: number | null
          plan_user_id?: string | null
          status?: string | null
          user_id?: string | null
          user_id_?: number | null
          value?: number | null
        }
        Update: {
          bank?: string | null
          created_at?: string
          date?: string | null
          datePay?: string | null
          expiration?: string | null
          id?: string
          lastDatePay?: string | null
          method_pay?: string | null
          payment_id?: string | null
          plan_id?: number | null
          plan_user_id?: string | null
          status?: string | null
          user_id?: string | null
          user_id_?: number | null
          value?: number | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          active: boolean | null
          benefits: Json | null
          billing_cycle: string | null
          color_theme: string | null
          created_at: string
          description: string | null
          display_name: string | null
          id: number
          is_popular: boolean | null
          name: string | null
          price: number | null
          slug: string | null
          sort_order: number | null
          value: number | null
        }
        Insert: {
          active?: boolean | null
          benefits?: Json | null
          billing_cycle?: string | null
          color_theme?: string | null
          created_at?: string
          description?: string | null
          display_name?: string | null
          id?: number
          is_popular?: boolean | null
          name?: string | null
          price?: number | null
          slug?: string | null
          sort_order?: number | null
          value?: number | null
        }
        Update: {
          active?: boolean | null
          benefits?: Json | null
          billing_cycle?: string | null
          color_theme?: string | null
          created_at?: string
          description?: string | null
          display_name?: string | null
          id?: number
          is_popular?: boolean | null
          name?: string | null
          price?: number | null
          slug?: string | null
          sort_order?: number | null
          value?: number | null
        }
        Relationships: []
      }
      plans_user: {
        Row: {
          bank: string | null
          created_at: string
          date: string | null
          datePay: string | null
          expiration: string | null
          id: number
          lastDatePay: string | null
          method_pay: string | null
          payment_id: string | null
          plan_id: number | null
          status: boolean
          user_id: string | null
          value: number | null
        }
        Insert: {
          bank?: string | null
          created_at?: string
          date?: string | null
          datePay?: string | null
          expiration?: string | null
          id?: number
          lastDatePay?: string | null
          method_pay?: string | null
          payment_id?: string | null
          plan_id?: number | null
          status?: boolean
          user_id?: string | null
          value?: number | null
        }
        Update: {
          bank?: string | null
          created_at?: string
          date?: string | null
          datePay?: string | null
          expiration?: string | null
          id?: number
          lastDatePay?: string | null
          method_pay?: string | null
          payment_id?: string | null
          plan_id?: number | null
          status?: boolean
          user_id?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plans_user_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plans_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      provas_oab: {
        Row: {
          "Alternativa A": string | null
          "Alternativa B": string | null
          "Alternativa C": string | null
          "Alternativa D": string | null
          Área: string | null
          Enunciado: string | null
          Numero: number | null
          prova: number | null
          "Resposta Correta": string | null
          simulado_id: number | null
          Tema: string | null
        }
        Insert: {
          "Alternativa A"?: string | null
          "Alternativa B"?: string | null
          "Alternativa C"?: string | null
          "Alternativa D"?: string | null
          Área?: string | null
          Enunciado?: string | null
          Numero?: number | null
          prova?: number | null
          "Resposta Correta"?: string | null
          simulado_id?: number | null
          Tema?: string | null
        }
        Update: {
          "Alternativa A"?: string | null
          "Alternativa B"?: string | null
          "Alternativa C"?: string | null
          "Alternativa D"?: string | null
          Área?: string | null
          Enunciado?: string | null
          Numero?: number | null
          prova?: number | null
          "Resposta Correta"?: string | null
          simulado_id?: number | null
          Tema?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provas_oab_simulado_id_fkey"
            columns: ["simulado_id"]
            isOneToOne: false
            referencedRelation: "simulados"
            referencedColumns: ["id"]
          },
        ]
      }
      segunda_fase_areas: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      segunda_fase_pontos: {
        Row: {
          created_at: string
          descricao: string | null
          entrada_id: string | null
          id: string
          pontuacao: string | null
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          entrada_id?: string | null
          id: string
          pontuacao?: string | null
        }
        Update: {
          created_at?: string
          descricao?: string | null
          entrada_id?: string | null
          id?: string
          pontuacao?: string | null
        }
        Relationships: []
      }
      segunda_fase_questoes: {
        Row: {
          area_id: string | null
          ativa: boolean
          created_at: string
          enunciado: string
          gabarito: string | null
          id: string
          numero_exame: number
          numero_questao: string | null
          tipo: string | null
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          ativa?: boolean
          created_at?: string
          enunciado: string
          gabarito?: string | null
          id?: string
          numero_exame: number
          numero_questao?: string | null
          tipo?: string | null
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          ativa?: boolean
          created_at?: string
          enunciado?: string
          gabarito?: string | null
          id?: string
          numero_exame?: number
          numero_questao?: string | null
          tipo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "segunda_fase_questoes_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "segunda_fase_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      simulados: {
        Row: {
          area: string | null
          category: string | null
          created_at: string
          custom_click_behavior: string | null
          description: string | null
          difficulty: string | null
          duration: string | null
          id: number
          path: string | null
          phase: string | null
          questions: number | null
          title: string | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          area?: string | null
          category?: string | null
          created_at?: string
          custom_click_behavior?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          id?: number
          path?: string | null
          phase?: string | null
          questions?: number | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          area?: string | null
          category?: string | null
          created_at?: string
          custom_click_behavior?: string | null
          description?: string | null
          difficulty?: string | null
          duration?: string | null
          id?: number
          path?: string | null
          phase?: string | null
          questions?: number | null
          title?: string | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tokens: {
        Row: {
          created_at: string
          id: string
          nome_ia: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome_ia: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nome_ia?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          company_id: string | null
          cpfCnpj: string | null
          created_at: string
          disabled: boolean | null
          doc: string | null
          email: string | null
          id: string
          idAsaas: string | null
          institution_id: string | null
          lastname: string | null
          name: string | null
          phone: string | null
          type_user: number | null
        }
        Insert: {
          company_id?: string | null
          cpfCnpj?: string | null
          created_at?: string
          disabled?: boolean | null
          doc?: string | null
          email?: string | null
          id?: string
          idAsaas?: string | null
          institution_id?: string | null
          lastname?: string | null
          name?: string | null
          phone?: string | null
          type_user?: number | null
        }
        Update: {
          company_id?: string | null
          cpfCnpj?: string | null
          created_at?: string
          disabled?: boolean | null
          doc?: string | null
          email?: string | null
          id?: string
          idAsaas?: string | null
          institution_id?: string | null
          lastname?: string | null
          name?: string | null
          phone?: string | null
          type_user?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
