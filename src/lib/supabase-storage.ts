import { supabase, type Profile, type ScoreHistoryRecord } from './supabase';

export interface ScoreHistoryItem {
  id: string;
  type: 'add' | 'subtract';
  itemName: string;
  scoreChange: number;
  scoreBefore: number;
  scoreAfter: number;
  timestamp: number;
}

// 当前用户的 profile ID（需要在登录后设置）
let currentProfileId: string | null = null;

export function setCurrentProfileId(profileId: string | null) {
  currentProfileId = profileId;
}

export function getCurrentProfileId(): string | null {
  return currentProfileId;
}

// 获取或创建用户档案
export async function getOrCreateProfile(userId: string, childName: string = '宝贝'): Promise<Profile> {
  // 先尝试获取现有档案
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existingProfile && !fetchError) {
    setCurrentProfileId(existingProfile.id);
    return existingProfile;
  }

  // 如果不存在，创建新档案
  const { data: newProfile, error: createError } = await supabase
    .from('profiles')
    .insert({
      user_id: userId,
      child_name: childName,
      current_score: 100,
    })
    .select()
    .single();

  if (createError) {
    throw new Error(`Failed to create profile: ${createError.message}`);
  }

  setCurrentProfileId(newProfile.id);
  return newProfile;
}

// 获取当前分数
export async function getCurrentScore(): Promise<number> {
  if (!currentProfileId) {
    console.warn('No profile ID set, returning default score');
    return 100;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('current_score')
    .eq('id', currentProfileId)
    .single();

  if (error) {
    console.error('Error fetching current score:', error);
    return 100;
  }

  return data.current_score;
}

// 设置当前分数
export async function setCurrentScore(score: number): Promise<void> {
  if (!currentProfileId) {
    throw new Error('No profile ID set');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ current_score: score })
    .eq('id', currentProfileId);

  if (error) {
    throw new Error(`Failed to update score: ${error.message}`);
  }
}

// 获取分数历史
export async function getScoreHistory(): Promise<ScoreHistoryItem[]> {
  if (!currentProfileId) {
    console.warn('No profile ID set, returning empty history');
    return [];
  }

  const { data, error } = await supabase
    .from('score_history')
    .select('*')
    .eq('profile_id', currentProfileId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching score history:', error);
    return [];
  }

  // 转换为前端格式
  return data.map((record: ScoreHistoryRecord) => ({
    id: record.id,
    type: record.type,
    itemName: record.item_name,
    scoreChange: record.score_change,
    scoreBefore: record.score_before,
    scoreAfter: record.score_after,
    timestamp: new Date(record.created_at).getTime(),
  }));
}

// 添加分数历史记录
export async function addScoreHistoryItem(item: ScoreHistoryItem): Promise<void> {
  if (!currentProfileId) {
    throw new Error('No profile ID set');
  }

  const { error } = await supabase
    .from('score_history')
    .insert({
      profile_id: currentProfileId,
      type: item.type,
      item_name: item.itemName,
      score_change: item.scoreChange,
      score_before: item.scoreBefore,
      score_after: item.scoreAfter,
    });

  if (error) {
    throw new Error(`Failed to add score history: ${error.message}`);
  }
}

// 清除所有数据（仅用于测试）
export async function clearAllData(): Promise<void> {
  if (!currentProfileId) {
    return;
  }

  // 删除历史记录
  await supabase
    .from('score_history')
    .delete()
    .eq('profile_id', currentProfileId);

  // 重置分数
  await supabase
    .from('profiles')
    .update({ current_score: 100 })
    .eq('id', currentProfileId);
}
