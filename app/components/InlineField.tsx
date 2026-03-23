"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
    value: string;
    onChange: (val: string) => void;
    multiline?: boolean;
    className?: string;
    placeholder?: string;
}

export default function InlineField({
    value,
    onChange,
    multiline = false,
    className = "",
    placeholder = "Click to edit...",
}: Props) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

    useEffect(() => {
        if (editing) ref.current?.focus();
    }, [editing]);

    // Auto-resize textarea height
    useEffect(() => {
        if (multiline && ref.current) {
            ref.current.style.height = "auto";
            ref.current.style.height = ref.current.scrollHeight + "px";
        }
    }, [draft, editing, multiline]);

    function handleBlur() {
        setEditing(false);
        onChange(draft);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (!multiline && e.key === "Enter") {
            e.preventDefault();
            ref.current?.blur();
        }
        if (e.key === "Escape") {
            setDraft(value); // revert on escape
            setEditing(false);
        }
    }

    if (editing) {
        const sharedProps = {
            ref,
            value: draft,
            onChange: (
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => setDraft(e.target.value),
            onBlur: handleBlur,
            onKeyDown: handleKeyDown,
            placeholder,
            className: `w-full bg-blue-100 border border-blue-400 rounded px-1 py-0.5 outline-none text-inherit font-inherit resize-none ${className}`,
        };

        return multiline ? (
            <textarea
                {...sharedProps}
                rows={1}
                style={{ overflow: "hidden" }}
            />
        ) : (
            <input {...sharedProps} type="text" />
        );
    }

    return (
        <span
            onClick={() => {
                setDraft(value);
                setEditing(true);
            }}
            title="Click to edit"
            className={`cursor-text rounded px-1 py-0.5 hover:bg-zinc-100 transition-colors ${
                value ? "" : "text-zinc-400 italic"
            } ${className}`}
        >
            {value || placeholder}
        </span>
    );
}
