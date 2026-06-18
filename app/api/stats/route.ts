import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [membersRes, statsRes] = await Promise.all([
      supabase.from('members').select('id', { count: 'exact', head: true }),
      supabase.from('impact_stats').select('*'),
    ]);

    const memberCount = membersRes.count || 0;
    const stats: Record<string, number> = { members: memberCount };

    if (statsRes.data) {
      for (const row of statsRes.data) {
        stats[row.key] = row.value;
      }
    }

    return NextResponse.json({
      members: memberCount,
      lives_impacted: stats.lives_impacted || 0,
      events: stats.events || 0,
      social_followers: stats.social_followers || 0,
      years_service: new Date().getFullYear() - 2018,
      districts_covered: stats.districts_covered || 0,
      volunteers: stats.volunteers || 0,
    });
  } catch {
    return NextResponse.json({
      members: 0,
      lives_impacted: 0,
      events: 0,
      social_followers: 0,
      years_service: new Date().getFullYear() - 2018,
      districts_covered: 0,
      volunteers: 0,
    });
  }
}
