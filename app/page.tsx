"use client";

import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import UploadPanel from "./components/UploadPanel";
import ResumeEditor from "./components/ResumeEditor";
import { NavExportButton, NavCopyButton } from "./components/NavActions";
import { Resume } from "@/types/resume";
import { FileText } from "lucide-react";

const STORAGE_KEY = "resumiq_session";

type SaveStatus = "idle" | "saving" | "saved";

function generateFileName(name: string, company: string): string {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const safeName = name.toLowerCase().replace(/\s+/g, "_");
    const safeCompany = company.toLowerCase().replace(/\s+/g, "_");
    return `${safeName}_${safeCompany}_${today}`;
}

export default function Home() {
    const [tailoredResume, setTailoredResume] = useState<Resume | null>(null);
    const [masterResume, setMasterResume] = useState<Resume | null>(null);
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [masterFileName, setMasterFileName] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [hydrated, setHydrated] = useState(false);
    const [exportFileName, setExportFileName] = useState("");
    const [clearKey, setClearKey] = useState(0);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const session = JSON.parse(raw);
                if (session.masterResume) setMasterResume(session.masterResume);
                if (session.jobTitle) setJobTitle(session.jobTitle);
                if (session.jobDescription)
                    setJobDescription(session.jobDescription);
                if (session.tailoredResume)
                    setTailoredResume(session.tailoredResume);
                if (session.masterFileName)
                    setMasterFileName(session.masterFileName);
                if (session.exportFileName)
                    setExportFileName(session.exportFileName);
            }
        } catch {
            // corrupted storage, ignore
        }
        setHydrated(true);
    }, []);

    const saveToStorage = useDebouncedCallback(() => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    masterResume,
                    jobTitle,
                    jobDescription,
                    tailoredResume,
                    masterFileName,
                    exportFileName,
                }),
            );
            setSaveStatus("saved");
            setTimeout(() => setSaveStatus("idle"), 2000);
        } catch {
            setSaveStatus("idle");
        }
    }, 800);

    useEffect(() => {
        if (!hydrated) return;
        if (!masterResume && !jobTitle && !jobDescription && !tailoredResume)
            return;
        setSaveStatus("saving");
        saveToStorage();
    }, [
        masterResume,
        jobTitle,
        jobDescription,
        tailoredResume,
        exportFileName,
    ]);

    async function handleTailor(resume: Resume, jobDescription: string) {
        setIsLoading(true);
        setError(null);

        try {
            // Fire both calls in parallel
            const [tailorRes, extractRes] = await Promise.all([
                fetch("/api/tailor", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resume, jobDescription }),
                }),
                fetch("/api/extract", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ jobDescription }),
                }),
            ]);

            const tailorData = await tailorRes.json();
            const extractData = await extractRes.json();

            if (!tailorRes.ok)
                throw new Error(tailorData.error || "Something went wrong");

            setTailoredResume(tailorData.resume);

            // Auto-generate filename
            const company = extractData.company ?? "company";
            const name = tailorData.resume.name ?? "resume";
            setExportFileName(generateFileName(name, company));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setIsLoading(false);
        }
    }

    function handleClear() {
        localStorage.removeItem(STORAGE_KEY);
        setMasterResume(null);
        setJobTitle("");
        setJobDescription("");
        setTailoredResume(null);
        setExportFileName("");
        setError(null);
        setSaveStatus("idle");
        setClearKey((k) => k + 1);
    }

    return (
        <div className="flex h-screen flex-col bg-zinc-100">
            {/* Navbar */}
            <nav className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6">
                {/* Left side */}
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
                        <FileText className="h-4 w-4 text-white" />
                    </div>

                    {/* Editable filename */}
                    {tailoredResume && (
                        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                            <div className="relative">
                                {/* Hidden mirror to measure width */}
                                <span
                                    className="invisible absolute whitespace-pre text-sm"
                                    aria-hidden="true"
                                >
                                    {exportFileName || "filename"}
                                </span>
                                <input
                                    type="text"
                                    value={exportFileName}
                                    onChange={(e) =>
                                        setExportFileName(e.target.value)
                                    }
                                    style={{
                                        width: `${Math.max((exportFileName || "filename").length * 0.9, 4)}ch`,
                                    }}
                                    className="bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
                                    placeholder="filename"
                                />
                            </div>
                            <span className="text-sm text-zinc-400">.pdf</span>
                        </div>
                    )}

                    {/* Save indicator */}
                    <div className="w-20">
                        {saveStatus === "saving" && (
                            <span className="text-xs text-zinc-400">
                                Saving...
                            </span>
                        )}
                        {saveStatus === "saved" && (
                            <span className="text-xs text-emerald-500">
                                ✅ Saved
                            </span>
                        )}
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {tailoredResume && (
                        <>
                            <NavCopyButton resume={tailoredResume} />
                            <NavExportButton
                                resume={tailoredResume}
                                fileName={exportFileName}
                            />
                        </>
                    )}
                    <button
                        onClick={handleClear}
                        className="rounded-xl border border-zinc-200 bg-white px-4 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-400"
                    >
                        Clear
                    </button>
                </div>
            </nav>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden gap-4 p-4">
                <div className="flex w-[380px] shrink-0 flex-col gap-4 overflow-hidden">
                    <UploadPanel
                        key={clearKey}
                        onTailor={handleTailor}
                        isLoading={isLoading}
                        initialMasterResume={masterResume}
                        initialJobTitle={jobTitle}
                        initialJobDescription={jobDescription}
                        initialFileName={masterFileName}
                        onMasterResumeChange={setMasterResume}
                        onJobTitleChange={setJobTitle}
                        onJobDescriptionChange={setJobDescription}
                        onFileNameChange={setMasterFileName}
                    />
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">
                    <ResumeEditor
                        key={clearKey}
                        resume={tailoredResume}
                        isLoading={isLoading}
                        onResumeChange={setTailoredResume}
                    />
                </div>
            </div>
        </div>
    );
}
