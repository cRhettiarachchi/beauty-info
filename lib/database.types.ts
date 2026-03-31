export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          ticker: string | null;
          sec_cik: string | null;
          website: string;
          linkedin_url: string | null;
          ir_page_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          ticker?: string | null;
          sec_cik?: string | null;
          website: string;
          linkedin_url?: string | null;
          ir_page_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          ticker?: string | null;
          sec_cik?: string | null;
          website?: string;
          linkedin_url?: string | null;
          ir_page_url?: string | null;
          updated_at?: string;
        };
      };
      signals: {
        Row: {
          id: string;
          company_id: string;
          signal_type: string;
          summary: string;
          ai_relevance_score: number;
          low_relevance: boolean;
          published_date: string | null;
          source_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          signal_type: string;
          summary: string;
          ai_relevance_score: number;
          low_relevance?: boolean;
          published_date?: string | null;
          source_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          signal_type?: string;
          summary?: string;
          ai_relevance_score?: number;
          low_relevance?: boolean;
          published_date?: string | null;
          source_url?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          company_id: string;
          name: string | null;
          title: string | null;
          region: string | null;
          linkedin_url: string | null;
          email: string | null;
          source_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name?: string | null;
          title?: string | null;
          region?: string | null;
          linkedin_url?: string | null;
          email?: string | null;
          source_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string | null;
          title?: string | null;
          region?: string | null;
          linkedin_url?: string | null;
          email?: string | null;
          source_url?: string;
        };
      };
      revenue_records: {
        Row: {
          id: string;
          company_id: string;
          year: number;
          revenue: number | null;
          currency: string | null;
          revenue_growth_pct: number | null;
          segment: string | null;
          source_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          year: number;
          revenue?: number | null;
          currency?: string | null;
          revenue_growth_pct?: number | null;
          segment?: string | null;
          source_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          year?: number;
          revenue?: number | null;
          currency?: string | null;
          revenue_growth_pct?: number | null;
          segment?: string | null;
          source_url?: string;
        };
      };
      failed_urls: {
        Row: {
          id: string;
          url: string;
          reason: string;
          context: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          reason: string;
          context?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          reason?: string;
          context?: string | null;
        };
      };
    };
  };
}
