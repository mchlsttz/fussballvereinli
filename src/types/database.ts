export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          nickname: string
          is_admin: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nickname: string
          is_admin?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nickname?: string
          is_admin?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          event_date: string
          start_time: string
          end_time: string
          location: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string
          event_date: string
          start_time: string
          end_time: string
          location: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          event_date?: string
          start_time?: string
          end_time?: string
          location?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      utensils: {
        Row: {
          id: string
          name: string
          icon: string
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      event_responses: {
        Row: {
          id: string
          event_id: string
          user_id: string
          response_type: 'zusage' | 'absage'
          guest_count: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          response_type: 'zusage' | 'absage'
          guest_count?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          response_type?: 'zusage' | 'absage'
          guest_count?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      utensil_assignments: {
        Row: {
          id: string
          event_id: string
          user_id: string
          utensil_id: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          utensil_id: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          utensil_id?: string
          created_at?: string
        }
      }
      recurring_event_templates: {
        Row: {
          id: string
          title: string
          day_of_week: number
          start_time: string
          end_time: string
          location: string
          start_date: string
          end_date: string
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string
          day_of_week: number
          start_time: string
          end_time: string
          location: string
          start_date: string
          end_date: string
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          location?: string
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
