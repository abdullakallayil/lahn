"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, Upload, BarChart3, User, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Library", icon: Library, href: "/library" },
    { label: "Upload", icon: Upload, href: "/upload" },
    { label: "Admin", icon: BarChart3, href: "/admin" },
    { label: "Me", icon: User, href: "/me" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full w-64 bg-zinc-950 border-r border-zinc-900">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Music2 className="text-white w-5 h-5" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent font-arabic">
                    لحن
                </h1>
            </div>

            <div className="flex-1 flex flex-col gap-1 px-3">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                            pathname === route.href
                                ? "bg-primary/10 text-primary" // Active state
                                : "text-zinc-400 hover:text-white hover:bg-zinc-900" // Inactive state
                        )}
                    >
                        <route.icon className={cn("w-5 h-5", pathname === route.href ? "text-primary" : "text-zinc-500 group-hover:text-white")} />
                        {route.label}
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-zinc-900">
                <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
                    <p className="text-xs text-zinc-500 mb-1">Playing on</p>
                    <p className="text-sm font-medium text-zinc-300">Web Player</p>
                </div>
            </div>
        </div>
    );
}
