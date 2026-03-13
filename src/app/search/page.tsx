"use client";

import { useSearchParams } from "next/navigation";
import { SongCard } from "@/components/SongCard";
import { Suspense, useEffect, useState } from "react";
import type { Song } from "@/context/AudioContext";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!query) return;

        const fetchResults = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (!res.ok) throw new Error("Failed to fetch results");
                const data = await res.json();
                setResults(data);
            } catch (err) {
                console.error(err);
                setError("Could not load results. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 500); // Debounce
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="p-8 pb-32 space-y-8">
            <h1 className="text-3xl font-bold text-white mb-6">
                Results for "<span className="text-primary">{query}</span>"
            </h1>

            {loading && <div className="text-zinc-400">Searching YouTube...</div>}
            {error && <div className="text-red-400">{error}</div>}

            {!loading && !error && results.length === 0 && query && (
                <div className="text-zinc-500">No results found.</div>
            )}

            {/* Songs */}
            <section>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {results.map((song, index) => (
                        <SongCard key={`${song.id}-${index}`} song={song} className="bg-zinc-900/40" />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="p-8 text-white">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
