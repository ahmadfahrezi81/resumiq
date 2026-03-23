"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { Resume } from "@/types/resume";
import ResumePDF from "./ResumePDF";

interface ExportProps {
    resume: Resume;
    fileName: string;
}

interface CopyProps {
    resume: Resume;
}

export function NavExportButton({ resume, fileName }: ExportProps) {
    async function handleExport() {
        const blob = await pdf(<ResumePDF resume={resume} />).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName || resume.name.replace(/\s+/g, "_")}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
        >
            <Download className="h-3.5 w-3.5" />
            Export PDF
        </button>
    );
}

export function NavCopyButton({ resume }: CopyProps) {
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        navigator.clipboard.writeText(JSON.stringify(resume, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
        >
            {copied ? (
                <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                </>
            ) : (
                <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy JSON
                </>
            )}
        </button>
    );
}
