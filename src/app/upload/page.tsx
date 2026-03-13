"use client";

import { useState, useCallback } from "react";
import { UploadCloud, Music, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudio } from "@/context/AudioContext";

export default function UploadPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { play } = useAudio();

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type.startsWith("audio/")) {
                setFile(droppedFile);
            } else {
                alert("Please upload an audio file (MP3, WAV)");
            }
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const clearFile = () => {
        setFile(null);
        setSuccess(false);
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();

            setUploading(false);
            setSuccess(true);

            // Optionally play the uploaded song immediately?
            // play({
            //     id: data.url,
            //     title: file.name,
            //     artist: "Unknown Artist",
            //     audioUrl: data.url,
            //     coverUrl: ""
            // });

        } catch (err) {
            console.error(err);
            alert("Upload failed. Please try again.");
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-xl p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-2 text-center">Upload Music</h1>
                <p className="text-zinc-400 text-center mb-10">Add your own tracks to your library</p>

                {!success ? (
                    <div className="space-y-6">
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer",
                                isDragging ? "border-primary bg-primary/10 scale-[1.02]" : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50",
                                file ? "border-green-500/50 bg-green-500/5" : ""
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById("file-upload")?.click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept="audio/*"
                                onChange={handleFileChange}
                            />

                            {file ? (
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                        <Music className="w-8 h-8 text-green-500" />
                                    </div>
                                    <p className="text-white font-medium truncate max-w-[300px]">{file.name}</p>
                                    <p className="text-zinc-500 text-sm mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                                        <UploadCloud className="w-8 h-8 text-zinc-400" />
                                    </div>
                                    <p className="text-lg font-medium text-white">Click to upload or drag and drop</p>
                                    <p className="text-sm text-zinc-500 mt-2">MP3, WAV, OGG (Max 20MB)</p>
                                </div>
                            )}
                        </div>

                        {file && (
                            <div className="flex gap-3">
                                <button
                                    onClick={clearFile}
                                    className="flex-1 py-3 px-4 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Uploading...
                                        </>
                                    ) : "Upload Song"}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                            <Check className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Upload Successful!</h2>
                        <p className="text-zinc-400 mb-8">"{file?.name}" has been added to your library.</p>
                        <button
                            onClick={clearFile}
                            className="py-3 px-8 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform"
                        >
                            Upload Another
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
