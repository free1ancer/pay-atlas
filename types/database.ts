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
      companies: {
        Row: {
          canonical_name: string
          created_at: string | null
          employee_count_range: string | null
          headquarters_city: string | null
          headquarters_country: string | null
          id: string
          industry: string | null
          name: string
          sector: string | null
          website: string | null
        }
        Insert: {
          canonical_name: string
          created_at?: string | null
          employee_count_range?: string | null
          headquarters_city?: string | null
          headquarters_country?: string | null
          id?: string
          industry?: string | null
          name: string
          sector?: string | null
          website?: string | null
        }
        Update: {
          canonical_name?: string
          created_at?: string | null
          employee_count_range?: string | null
          headquarters_city?: string | null
          headquarters_country?: string | null
          id?: string
          industry?: string | null
          name?: string
          sector?: string | null
          website?: string | null
        }
      }
      salary_entries: {
        Row: {
          as_of_date: string | null
          base_salary: number | null
          bonus_actual: number | null
          bonus_target: number | null
          city: string | null
          company_id: string | null
          company_level_id: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          equity_type: string | null
          equity_value: number | null
          function: string | null
          has_401k_match: boolean | null
          id: string
          other_benefits: string | null
          parental_leave_weeks: number | null
          person_id: string | null
          pto_days: number | null
          region: string | null
          remote_status: string | null
          signing_bonus: number | null
          title: string
          total_compensation: number | null
          updated_at: string | null
          verified: boolean | null
          years_at_company: number | null
          years_of_experience: number | null
        }
        Insert: {
          as_of_date?: string | null
          base_salary?: number | null
          bonus_actual?: number | null
          bonus_target?: number | null
          city?: string | null
          company_id?: string | null
          company_level_id?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          equity_type?: string | null
          equity_value?: number | null
          function?: string | null
          has_401k_match?: boolean | null
          id?: string
          other_benefits?: string | null
          parental_leave_weeks?: number | null
          person_id?: string | null
          pto_days?: number | null
          region?: string | null
          remote_status?: string | null
          signing_bonus?: number | null
          title: string
          total_compensation?: number | null
          updated_at?: string | null
          verified?: boolean | null
          years_at_company?: number | null
          years_of_experience?: number | null
        }
        Update: {
          as_of_date?: string | null
          base_salary?: number | null
          bonus_actual?: number | null
          bonus_target?: number | null
          city?: string | null
          company_id?: string | null
          company_level_id?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          equity_type?: string | null
          equity_value?: number | null
          function?: string | null
          has_401k_match?: boolean | null
          id?: string
          other_benefits?: string | null
          parental_leave_weeks?: number | null
          person_id?: string | null
          pto_days?: number | null
          region?: string | null
          remote_status?: string | null
          signing_bonus?: number | null
          title?: string
          total_compensation?: number | null
          updated_at?: string | null
          verified?: boolean | null
          years_at_company?: number | null
          years_of_experience?: number | null
        }
      }
    }
    Views: {
      company_comp_stats: {
        Row: {
          avg_total_comp: number | null
          company_id: string | null
          company_name: string | null
          entry_count: number | null
          function: string | null
          median: number | null
          p25: number | null
          p75: number | null
        }
      }
    }
  }
}
