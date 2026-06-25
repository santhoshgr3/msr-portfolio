import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Member = {
  id: number;
  member_number: number;
  full_name: string;
  phone: string;
  city: string;
  district: string;
  interest_area: string;
  how_found: string;
  display_on_wall: boolean;
  created_at: string;
};

export type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  district: string;
  type: string;
  image_url: string;
  rsvp_count: number;
  is_upcoming: boolean;
  created_at: string;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  author: string;
  published_at: string;
};

export type ImpactStat = {
  id: number;
  key: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  updated_at: string;
};

export type GalleryItem = {
  id: number;
  title: string;
  description: string;
  tag: string;
  image_url: string;
  storage_path: string;
  is_visible: boolean;
  media_type: string; // 'image' | 'video'
  created_at: string;
};

export type SiteSettings = {
  id: number;
  phone: string;
  whatsapp_number: string;
  email: string;
  website: string;
  address: string;
  instagram_url: string;
  instagram_handle: string;
  youtube_url: string;
  youtube_handle: string;
  facebook_url: string;
  twitter_url: string;
  telegram_url: string;
  linkedin_url: string;
  whatsapp_community_url: string;
  announcement_text: string;
  updated_at: string;
};

// Fallback used before settings load / if the table is empty.
export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  phone: '+91 8886388264',
  whatsapp_number: '918886388264',
  email: 'teamsairathansunny@gmail.com',
  website: 'https://madhirajsairathan.com',
  address: 'Bhupalpally, Telangana, India',
  instagram_url: 'https://instagram.com/madhirajsairathan',
  instagram_handle: '@madhirajsairathan',
  youtube_url: 'https://youtube.com/@sunnyannayuvasena',
  youtube_handle: '@sunnyannayuvasena',
  facebook_url: 'https://facebook.com/share/14PdvF6Wuh/',
  twitter_url: '',
  telegram_url: '',
  linkedin_url: '',
  whatsapp_community_url: '',
  announcement_text: 'Join the movement transforming Telangana —',
  updated_at: '',
};

export type MediaVideo = {
  id: number;
  title: string;
  url: string;
  video_url: string;
  duration: string;
  views: string;
  thumbnail_url: string;
  created_at: string;
};
