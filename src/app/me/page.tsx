"use client";

import { User, Settings, LogOut, ChevronRight, Bell, Shield, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
    {
        title: "Account",
        items: [
            { icon: User, label: "Edit Profile", href: "#" },
            { icon: Bell, label: "Notifications", href: "#" },
            { icon: Shield, label: "Privacy & Security", href: "#" },
        ]
    },
    {
        title: "App Settings",
        items: [
            { icon: Settings, label: "Playback", href: "#" },
            { icon: MessageCircle, label: "Feedback", href: "#" },
        ]
    }
];

export default function MePage() {
    return (
        <div className="p-8 pb-32 max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-12">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-zinc-800 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                    JD
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">John Doe</h1>
                    <p className="text-zinc-400">Premium Member</p>
                </div>
                <button className="ml-auto px-6 py-2 rounded-full border border-zinc-700 text-white font-medium hover:bg-zinc-800 transition-colors">
                    Edit
                </button>
            </div>

            {/* Settings Sections */}
            <div className="space-y-8">
                {SECTIONS.map((section, idx) => (
                    <section key={idx}>
                        <h2 className="text-lg font-semibold text-white mb-4">{section.title}</h2>
                        <div className="bg-zinc-900/40 rounded-xl overflow-hidden border border-zinc-800/50">
                            {section.items.map((item, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer group",
                                        (i !== section.items.length - 1) && "border-b border-zinc-800/50"
                                    )}
                                >
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors text-zinc-400">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <span className="flex-1 text-zinc-200 font-medium">{item.label}</span>
                                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white" />
                                </div>
                            ))}

                            {/* Fix for MessageCircle handling if needed, actually I corrected imports above but structure is fine */}
                            {section.title === "App Settings" && (
                                <div
                                    className="flex items-center gap-4 p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer group border-t border-zinc-800/50"
                                >
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors text-zinc-400">
                                        <MessageCircle className="w-4 h-4" />
                                    </div>
                                    <span className="flex-1 text-zinc-200 font-medium">Feedback</span>
                                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white" />
                                </div>
                            )}
                        </div>
                    </section>
                ))}

                <button className="w-full p-4 rounded-xl border border-red-900/30 text-red-500 font-medium hover:bg-red-950/20 transition-colors flex items-center justify-center gap-2 mt-8">
                    <LogOut className="w-4 h-4" />
                    Log Out
                </button>
            </div>
        </div>
    );
}
