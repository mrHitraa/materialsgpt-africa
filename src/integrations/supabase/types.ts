export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      benchmark_results: {
        Row: {
          created_at: string;
          id: string;
          is_demo: boolean;
          material_id: string;
          metric_name: string;
          metric_unit: string;
          metric_value: number;
          notes: string | null;
          salt_composition: string;
          source_observation_id: string;
          temperature_c: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_demo?: boolean;
          material_id: string;
          metric_name: string;
          metric_unit: string;
          metric_value: number;
          notes?: string | null;
          salt_composition: string;
          source_observation_id: string;
          temperature_c: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_demo?: boolean;
          material_id?: string;
          metric_name?: string;
          metric_unit?: string;
          metric_value?: number;
          notes?: string | null;
          salt_composition?: string;
          source_observation_id?: string;
          temperature_c?: number;
        };
        Relationships: [
          {
            foreignKeyName: "benchmark_results_material_id_fkey";
            columns: ["material_id"];
            isOneToOne: false;
            referencedRelation: "candidate_materials";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "benchmark_results_source_observation_id_fkey";
            columns: ["source_observation_id"];
            isOneToOne: false;
            referencedRelation: "corrosion_observations";
            referencedColumns: ["id"];
          },
        ];
      };
      candidate_materials: {
        Row: {
          active: boolean;
          cost_tag: string | null;
          created_at: string;
          description: string | null;
          id: string;
          local_availability_tag: string | null;
          material_type: Database["public"]["Enums"]["material_type"];
          name: string;
        };
        Insert: {
          active?: boolean;
          cost_tag?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          local_availability_tag?: string | null;
          material_type: Database["public"]["Enums"]["material_type"];
          name: string;
        };
        Update: {
          active?: boolean;
          cost_tag?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          local_availability_tag?: string | null;
          material_type?: Database["public"]["Enums"]["material_type"];
          name?: string;
        };
        Relationships: [];
      };
      corrosion_observations: {
        Row: {
          atmosphere: string | null;
          corrosion_rate: number | null;
          corrosion_rate_unit: string | null;
          created_at: string;
          exposure_time: number | null;
          exposure_time_unit: string | null;
          id: string;
          is_demo: boolean;
          literature_record_id: string;
          manufacturing_route: string | null;
          material_form: string | null;
          material_name: string;
          notes: string | null;
          salt_composition: string;
          temperature_c: number;
          test_method: string | null;
          thermal_cycling_details: string | null;
          verification_status: Database["public"]["Enums"]["verification_status"];
        };
        Insert: {
          atmosphere?: string | null;
          corrosion_rate?: number | null;
          corrosion_rate_unit?: string | null;
          created_at?: string;
          exposure_time?: number | null;
          exposure_time_unit?: string | null;
          id?: string;
          is_demo?: boolean;
          literature_record_id: string;
          manufacturing_route?: string | null;
          material_form?: string | null;
          material_name: string;
          notes?: string | null;
          salt_composition: string;
          temperature_c: number;
          test_method?: string | null;
          thermal_cycling_details?: string | null;
          verification_status?: Database["public"]["Enums"]["verification_status"];
        };
        Update: {
          atmosphere?: string | null;
          corrosion_rate?: number | null;
          corrosion_rate_unit?: string | null;
          created_at?: string;
          exposure_time?: number | null;
          exposure_time_unit?: string | null;
          id?: string;
          is_demo?: boolean;
          literature_record_id?: string;
          manufacturing_route?: string | null;
          material_form?: string | null;
          material_name?: string;
          notes?: string | null;
          salt_composition?: string;
          temperature_c?: number;
          test_method?: string | null;
          thermal_cycling_details?: string | null;
          verification_status?: Database["public"]["Enums"]["verification_status"];
        };
        Relationships: [
          {
            foreignKeyName: "corrosion_observations_literature_record_id_fkey";
            columns: ["literature_record_id"];
            isOneToOne: false;
            referencedRelation: "literature_records";
            referencedColumns: ["id"];
          },
        ];
      };
      literature_records: {
        Row: {
          authors: string;
          created_at: string;
          doi: string | null;
          extraction_confidence: number | null;
          extraction_status: Database["public"]["Enums"]["extraction_status"];
          full_text_url: string | null;
          id: string;
          is_demo: boolean;
          journal: string | null;
          publication_year: number;
          source_database: string | null;
          source_url: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          authors: string;
          created_at?: string;
          doi?: string | null;
          extraction_confidence?: number | null;
          extraction_status?: Database["public"]["Enums"]["extraction_status"];
          full_text_url?: string | null;
          id?: string;
          is_demo?: boolean;
          journal?: string | null;
          publication_year: number;
          source_database?: string | null;
          source_url?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          authors?: string;
          created_at?: string;
          doi?: string | null;
          extraction_confidence?: number | null;
          extraction_status?: Database["public"]["Enums"]["extraction_status"];
          full_text_url?: string | null;
          id?: string;
          is_demo?: boolean;
          journal?: string | null;
          publication_year?: number;
          source_database?: string | null;
          source_url?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      prediction_records: {
        Row: {
          assumptions: string;
          created_at: string;
          failure_criterion: string;
          id: string;
          is_demo: boolean;
          material_name: string;
          metric_name: string;
          metric_unit: string;
          model_input_summary: string;
          model_name: string;
          model_reference_url: string;
          model_version: string;
          predicted_value: number;
          salt_composition: string;
          temperature_c: number;
          uncertainty: string | null;
        };
        Insert: {
          assumptions: string;
          created_at?: string;
          failure_criterion: string;
          id?: string;
          is_demo?: boolean;
          material_name: string;
          metric_name: string;
          metric_unit: string;
          model_input_summary: string;
          model_name: string;
          model_reference_url: string;
          model_version: string;
          predicted_value: number;
          salt_composition: string;
          temperature_c: number;
          uncertainty?: string | null;
        };
        Update: {
          assumptions?: string;
          created_at?: string;
          failure_criterion?: string;
          id?: string;
          is_demo?: boolean;
          material_name?: string;
          metric_name?: string;
          metric_unit?: string;
          model_input_summary?: string;
          model_name?: string;
          model_reference_url?: string;
          model_version?: string;
          predicted_value?: number;
          salt_composition?: string;
          temperature_c?: number;
          uncertainty?: string | null;
        };
        Relationships: [];
      };
      test_plan_drafts: {
        Row: {
          atmosphere: string
          candidate_materials: string
          characterization_methods: string
          controls: string
          coupon_specifications: string
          created_at: string
          exposure_duration: string
          id: string
          is_demo: boolean
          lab_capabilities: string
          open_questions: string
          replicate_count: string
          safety_review: string
          salt_composition: string
          status: "draft" | "ready_for_review" | "approved"
          target_temperature: string
          test_mode: string
          title: string
          updated_at: string
        }
        Insert: {
          atmosphere: string
          candidate_materials: string
          characterization_methods: string
          controls: string
          coupon_specifications: string
          created_at?: string
          exposure_duration: string
          id?: string
          is_demo?: boolean
          lab_capabilities: string
          open_questions: string
          replicate_count: string
          safety_review: string
          salt_composition: string
          status?: "draft" | "ready_for_review" | "approved"
          target_temperature: string
          test_mode: string
          title: string
          updated_at?: string
        }
        Update: {
          atmosphere?: string
          candidate_materials?: string
          characterization_methods?: string
          controls?: string
          coupon_specifications?: string
          created_at?: string
          exposure_duration?: string
          id?: string
          is_demo?: boolean
          lab_capabilities?: string
          open_questions?: string
          replicate_count?: string
          safety_review?: string
          salt_composition?: string
          status?: "draft" | "ready_for_review" | "approved"
          target_temperature?: string
          test_mode?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      extraction_status: "pending" | "in_progress" | "extracted" | "verified" | "failed";
      material_type: "alloy" | "coating";
      verification_status: "unverified" | "verified" | "rejected";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      extraction_status: ["pending", "in_progress", "extracted", "verified", "failed"],
      material_type: ["alloy", "coating"],
      verification_status: ["unverified", "verified", "rejected"],
    },
  },
} as const;
