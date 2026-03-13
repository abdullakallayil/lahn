"use client";

import { BarChart3, Users, Music2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
    const [topSongs, setTopSongs] = useState<any[]>([]);
    const [totalPlays, setTotalPlays] = useState(0);
    const [totalSongs, setTotalSongs] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch top songs
                const { data: songs, error } = await supabase
                    .from('songs')
                    .select('*')
                    .order('plays', { ascending: false })
                    .limit(10);

                if (error) throw error;

                setTopSongs(songs || []);

                // Calculate stats
                // Note: For large DBs, using count() query is better than fetching all.
                // But for this demo, we might not have a separate aggregate table yet.
                // We'll just sum the top songs or make a separate query for totals if possible.
                // Limit 10 means we only see top 10 stats.

                // Let's get a count of all songs
                const { count } = await supabase
                    .from('songs')
                    .select('*', { count: 'exact', head: true });

                setTotalSongs(count || 0);

                // Get sum of plays (this helper function might not exist in client, so we might need a rpc or just sum what we fetch for now if we don't have rpc)
                // For now, let's just sum the top 10 for the "Total Plays" display or fetch all plays column.

                const { data: allPlays } = await supabase.from('songs').select('plays');
                const total = allPlays?.reduce((sum, item) => sum + (item.plays || 0), 0) || 0;
                setTotalPlays(total);

            } catch (err) {
                console.error("Admin fetch error:", JSON.stringify(err, null, 2), err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const STATS = [
        { label: "Total Plays", value: totalPlays.toLocaleString(), icon: TrendingUp, change: "All time" },
        { label: "Active Listeners", value: "N/A", icon: Users, change: "Real-time" }, // Real-time requires more setup
        { label: "Unique Songs", value: totalSongs.toLocaleString(), icon: Music2, change: "Library" },
    ];

    if (loading) return <div className="p-8 text-white">Loading dashboard...</div>;

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {STATS.map((stat, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <stat.icon className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-zinc-500 text-sm font-medium">{stat.change}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-zinc-500 text-sm">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section (Simplified) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Songs List */}
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl col-span-2">
                    <h3 className="text-lg font-bold text-white mb-6">Top Songs</h3>
                    <div className="space-y-4">
                        {topSongs.map((song, index) => (
                            <div key={song.video_id} className="flex items-center justify-between p-3 hover:bg-zinc-800/50 rounded-lg transition-colors group">
                                <div className="flex items-center gap-4">
                                    <span className="text-zinc-500 font-mono w-4">{index + 1}</span>
                                    <div>
                                        <h4 className="text-white font-medium text-sm group-hover:text-primary transition-colors">{song.title}</h4>
                                        <p className="text-zinc-500 text-xs">{song.artist}</p>
                                    </div>
                                </div>
                                <span className="text-white text-sm font-medium">{song.plays} plays</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
