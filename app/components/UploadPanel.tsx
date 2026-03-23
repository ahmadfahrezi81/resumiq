"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, FileJson, Loader2 } from "lucide-react";
import { Resume } from "@/types/resume";

interface Props {
    onTailor: (resume: Resume, jobDescription: string) => void;
    isLoading: boolean;
    initialMasterResume: Resume | null;
    initialJobTitle: string;
    initialJobDescription: string;
    initialFileName: string;
    onFileNameChange: (name: string) => void;
    onMasterResumeChange: (resume: Resume | null) => void;
    onJobTitleChange: (title: string) => void;
    onJobDescriptionChange: (desc: string) => void;
}

export default function UploadPanel({
    onTailor,
    isLoading,
    initialMasterResume,
    initialJobTitle,
    initialJobDescription,
    onMasterResumeChange,
    onJobTitleChange,
    onJobDescriptionChange,
    initialFileName,
    onFileNameChange,
}: Props) {
    const [resume, setResume] = useState<Resume | null>(initialMasterResume);
    const [fileName, setFileName] = useState<string | null>(
        initialMasterResume ? initialFileName || "Loaded from session" : null,
    );
    const [jobDescription, setJobDescription] = useState(initialJobDescription);
    const [jobTitle, setJobTitle] = useState(initialJobTitle);
    const [parseError, setParseError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialMasterResume) {
            setResume(initialMasterResume);
            setFileName("Loaded from session");
        }
    }, [initialMasterResume]);

    useEffect(() => {
        if (initialJobTitle) setJobTitle(initialJobTitle);
    }, [initialJobTitle]);

    useEffect(() => {
        if (initialJobDescription) setJobDescription(initialJobDescription);
    }, [initialJobDescription]);

    useEffect(() => {
        if (initialMasterResume) {
            setResume(initialMasterResume);
            setFileName(initialFileName || "Loaded from session");
        }
    }, [initialMasterResume, initialFileName]);

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setParseError(null);
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string);
                setResume(parsed);
                setFileName(file.name);
                setFileName(file.name);
                onFileNameChange(file.name);
                onMasterResumeChange(parsed);
            } catch {
                setParseError(
                    "Invalid JSON file. Please check your resume file.",
                );
            }
        };
        reader.readAsText(file);
    }

    function handleJobTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setJobTitle(e.target.value);
        onJobTitleChange(e.target.value);
    }

    function handleJobDescriptionChange(
        e: React.ChangeEvent<HTMLTextAreaElement>,
    ) {
        setJobDescription(e.target.value);
        onJobDescriptionChange(e.target.value);
    }

    function handleSubmit() {
        if (!resume || !jobDescription.trim()) return;
        const fullJobDescription = jobTitle
            ? `Job Title: ${jobTitle}\n\n${jobDescription}`
            : jobDescription;
        onTailor(resume, fullJobDescription);
    }

    const canSubmit =
        !!resume &&
        jobTitle.trim().length > 0 &&
        jobDescription.trim().length > 0 &&
        !isLoading;

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* JSON Upload */}
            <div
                onClick={() => fileRef.current?.click()}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-zinc-300 bg-white px-5 py-4 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
                    {resume ? (
                        <FileJson className="h-5 w-5 text-emerald-500" />
                    ) : (
                        <Upload className="h-5 w-5 text-zinc-400" />
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-700">
                        {resume ? fileName : "Upload Master Resume"}
                    </span>
                    <span className="text-xs text-zinc-400">
                        {resume ? "Click to replace" : "JSON format only"}
                    </span>
                </div>
                <input
                    ref={fileRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileUpload}
                />
            </div>

            {parseError && (
                <p className="text-xs text-red-500 px-1">{parseError}</p>
            )}

            {/* Job Title */}
            <input
                type="text"
                placeholder="Job title (required)"
                value={jobTitle}
                onChange={handleJobTitleChange}
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-zinc-400"
            />

            {/* Job Description */}
            <textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                className="flex-1 resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-zinc-400 min-h-[200px]"
            />

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Tailoring...
                    </>
                ) : (
                    "Tailor Resume"
                )}
            </button>
        </div>
    );
}
