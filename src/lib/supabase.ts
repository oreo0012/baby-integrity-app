import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 数据库类型定义
export interface Profile {
  id: string;
  user_id: string;
  child_name: string;
  current_score: number;
  created_at: string;
  updated_at: string;
}

export interface ScoreHistoryRecord {
  id: string;
  profile_id: string;
  type: 'add' | 'subtract';
  item_name: string;
  score_change: number;
  score_before: number;
  score_after: number;
  created_at: string;
}

export interface ScoreItemRecord {
  id: string;
  type: 'add' | 'subtract';
  name: string;
  min_score: number;
  max_score: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ScoreRangeRecord {
  id: string;
  name: string;
  min_score: number;
  max_score: number;
  free_time_value: number;
  spending_limit_value: number;
  weekly_allowance_value: number;
  weekend_game_value: boolean;
  created_at: string;
}
