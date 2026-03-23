"use client";

import { useState, useEffect } from "react";
import { Resume } from "@/types/resume";
import InlineField from "./InlineField";
import { Loader2, Trash2, Plus, X } from "lucide-react";

interface Props {
    resume: Resume | null;
    isLoading: boolean;
    onResumeChange: (resume: Resume) => void;
}

type SelectionKey = string | null;

export default function ResumeEditor({
    resume,
    isLoading,
    onResumeChange,
}: Props) {
    const [doc, setDoc] = useState<Resume | null>(null);
    const [selected, setSelected] = useState<SelectionKey>(null);

    useEffect(() => {
        if (resume) setDoc(resume);
    }, [resume]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-entry]")) {
                setSelected(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (doc) onResumeChange(doc);
    }, [doc]);

    function select(key: string, e: React.MouseEvent) {
        e.stopPropagation();
        setSelected((prev) => (prev === key ? null : key));
    }

    function isSelected(key: string) {
        return selected === key;
    }

    function updateField<K extends keyof Resume>(key: K, value: Resume[K]) {
        setDoc((prev) => {
            if (!prev) return prev;
            return { ...prev, [key]: value };
        });
    }

    function updateExperienceBullet(
        expIndex: number,
        bulletIndex: number,
        value: string,
    ) {
        setDoc((prev) => {
            if (!prev) return prev;
            const experience = prev.experience.map((exp, i) => {
                if (i !== expIndex) return exp;
                const bullets = exp.bullets.map((b, j) =>
                    j === bulletIndex ? value : b,
                );
                return { ...exp, bullets };
            });
            return { ...prev, experience };
        });
    }

    function updateExperienceField(
        expIndex: number,
        field: string,
        value: string,
    ) {
        setDoc((prev) => {
            if (!prev) return prev;
            const experience = prev.experience.map((exp, i) =>
                i === expIndex ? { ...exp, [field]: value } : exp,
            );
            return { ...prev, experience };
        });
    }

    function removeExperience(index: number) {
        setSelected(null);
        setDoc((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                experience: prev.experience.filter((_, i) => i !== index),
            };
        });
    }

    function addExperience() {
        setDoc((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                experience: [
                    ...prev.experience,
                    {
                        company: "Company",
                        title: "Title",
                        location: "Location",
                        startDate: "20XX",
                        endDate: "Present",
                        bullets: ["Add a bullet point"],
                    },
                ],
            };
        });
    }

    function removeBullet(expIndex: number, bulletIndex: number) {
        setDoc((prev) => {
            if (!prev) return prev;
            const experience = prev.experience.map((exp, i) => {
                if (i !== expIndex) return exp;
                return {
                    ...exp,
                    bullets: exp.bullets.filter((_, j) => j !== bulletIndex),
                };
            });
            return { ...prev, experience };
        });
    }

    function addBullet(expIndex: number) {
        setDoc((prev) => {
            if (!prev) return prev;
            const experience = prev.experience.map((exp, i) => {
                if (i !== expIndex) return exp;
                return {
                    ...exp,
                    bullets: [...exp.bullets, "Add bullet point"],
                };
            });
            return { ...prev, experience };
        });
    }

    function removeEducation(index: number) {
        setSelected(null);
        setDoc((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                education: prev.education.filter((_, i) => i !== index),
            };
        });
    }

    function addEducation() {
        setDoc((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                education: [
                    ...prev.education,
                    {
                        institution: "Institution",
                        degree: "Degree",
                        field: "Field",
                        graduationDate: "20XX",
                    },
                ],
            };
        });
    }

    function removeSkill(index: number) {
        setDoc((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                skills: prev.skills.filter((_, i) => i !== index),
            };
        });
    }

    function addSkill() {
        setDoc((prev) => {
            if (!prev) return prev;
            return { ...prev, skills: [...prev.skills, "New Skill"] };
        });
    }

    function removeAchievement(index: number) {
        setSelected(null);
        setDoc((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                achievements: prev.achievements?.filter((_, i) => i !== index),
            };
        });
    }

    function addAchievement() {
        setDoc((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                achievements: [
                    ...(prev.achievements ?? []),
                    {
                        title: "Achievement Title",
                        description: "Describe the achievement",
                    },
                ],
            };
        });
    }

    function updateAchievement(
        index: number,
        field: "title" | "description",
        value: string,
    ) {
        setDoc((prev) => {
            if (!prev) return prev;
            const achievements = prev.achievements?.map((a, i) =>
                i === index ? { ...a, [field]: value } : a,
            );
            return { ...prev, achievements };
        });
    }

    function removeProject(index: number) {
        setSelected(null);
        setDoc((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                projects: prev.projects?.filter((_, i) => i !== index),
            };
        });
    }

    function addProject() {
        setDoc((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                projects: [
                    ...(prev.projects ?? []),
                    {
                        name: "Project Name",
                        description: "Project description",
                        bullets: ["Add a bullet point"],
                        url: "",
                    },
                ],
            };
        });
    }

    function removeProjectBullet(projectIndex: number, bulletIndex: number) {
        setDoc((prev) => {
            if (!prev) return prev;
            const projects = prev.projects?.map((p, i) => {
                if (i !== projectIndex) return p;
                return {
                    ...p,
                    bullets: p.bullets.filter((_, j) => j !== bulletIndex),
                };
            });
            return { ...prev, projects };
        });
    }

    function addProjectBullet(projectIndex: number) {
        setDoc((prev) => {
            if (!prev) return prev;
            const projects = prev.projects?.map((p, i) => {
                if (i !== projectIndex) return p;
                return { ...p, bullets: [...p.bullets, "Add bullet point"] };
            });
            return { ...prev, projects };
        });
    }

    if (!doc && !isLoading) {
        return (
            <div className="flex h-full items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 bg-white">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="text-4xl">📄</div>
                    <p className="text-sm font-medium text-zinc-500">
                        Your tailored resume will appear here
                    </p>
                    <p className="text-xs text-zinc-400">
                        Upload a resume and paste a job description to get
                        started
                    </p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center rounded-3xl bg-white">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                    <p className="text-sm text-zinc-500">
                        Tailoring your resume...
                    </p>
                </div>
            </div>
        );
    }

    if (!doc) return null;

    return (
        <div className="h-full overflow-y-auto rounded-3xl bg-white shadow-sm">
            <div className="mx-auto max-w-[980px] px-6 py-12">
                <div className="flex gap-4">
                    <div className="w-[794px] shrink-0 px-14">
                        {/* Header */}
                        <div className="mb-6 border-b border-zinc-200 pb-6">
                            <h1 className="text-3xl font-bold tracking-tight text-indigo-500">
                                <InlineField
                                    value={doc.name}
                                    onChange={(v) => updateField("name", v)}
                                    className="text-3xl font-bold"
                                />
                            </h1>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
                                <InlineField
                                    value={doc.email}
                                    onChange={(v) => updateField("email", v)}
                                />
                                <span>·</span>
                                <InlineField
                                    value={doc.phone}
                                    onChange={(v) => updateField("phone", v)}
                                />
                                <span>·</span>
                                <InlineField
                                    value={doc.location}
                                    onChange={(v) => updateField("location", v)}
                                />
                                {doc.linkedin && (
                                    <>
                                        <span>·</span>
                                        <InlineField
                                            value={doc.linkedin}
                                            onChange={(v) =>
                                                updateField("linkedin", v)
                                            }
                                        />
                                    </>
                                )}
                                {doc.github && (
                                    <>
                                        <span>·</span>
                                        <InlineField
                                            value={doc.github}
                                            onChange={(v) =>
                                                updateField("github", v)
                                            }
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Summary */}
                        <section className="mb-6">
                            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                                Summary
                            </h2>
                            <p className="text-sm leading-relaxed text-zinc-700">
                                <InlineField
                                    value={doc.summary}
                                    onChange={(v) => updateField("summary", v)}
                                    multiline
                                    className="text-sm leading-relaxed"
                                />
                            </p>
                        </section>

                        {/* Skills */}
                        <section className="mb-6">
                            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                                Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {doc.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        data-entry
                                        onClick={(e) => select(`skill-${i}`, e)}
                                        className={`relative flex cursor-pointer items-center gap-1 rounded-lg border px-3 py-1 text-xs font-medium transition ${
                                            isSelected(`skill-${i}`)
                                                ? "border-blue-300 bg-blue-50 text-blue-700 ring-2 ring-blue-200"
                                                : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300"
                                        }`}
                                    >
                                        <InlineField
                                            value={skill}
                                            onChange={(v) => {
                                                const skills = doc.skills.map(
                                                    (s, j) => (j === i ? v : s),
                                                );
                                                updateField("skills", skills);
                                            }}
                                            className="text-xs"
                                        />
                                        {isSelected(`skill-${i}`) && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeSkill(i);
                                                }}
                                                className="ml-1 flex items-center rounded text-blue-400 transition hover:text-red-400"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </span>
                                ))}
                                <button
                                    onClick={addSkill}
                                    className="flex items-center gap-1 rounded-lg border border-dashed border-zinc-300 px-3 py-1 text-xs text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-600"
                                >
                                    <Plus className="h-3 w-3" />
                                    Add skill
                                </button>
                            </div>
                        </section>

                        {/* Experience */}
                        <section className="mb-6">
                            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                                Experience
                            </h2>
                            <div className="flex flex-col gap-6">
                                {doc.experience.map((exp, i) => (
                                    <div
                                        key={i}
                                        data-entry
                                        onClick={(e) => select(`exp-${i}`, e)}
                                        className={`relative flex cursor-pointer rounded-xl p-3 -mx-3 transition ${isSelected(`exp-${i}`) ? "bg-blue-50 ring-2 ring-blue-200" : "hover:bg-zinc-50"}`}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-zinc-900">
                                                        <InlineField
                                                            value={exp.title}
                                                            onChange={(v) =>
                                                                updateExperienceField(
                                                                    i,
                                                                    "title",
                                                                    v,
                                                                )
                                                            }
                                                            className="font-semibold"
                                                        />
                                                    </h3>
                                                    <p className="text-sm text-zinc-500">
                                                        <InlineField
                                                            value={exp.company}
                                                            onChange={(v) =>
                                                                updateExperienceField(
                                                                    i,
                                                                    "company",
                                                                    v,
                                                                )
                                                            }
                                                        />
                                                        {" · "}
                                                        <InlineField
                                                            value={exp.location}
                                                            onChange={(v) =>
                                                                updateExperienceField(
                                                                    i,
                                                                    "location",
                                                                    v,
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                </div>
                                                <p className="shrink-0 text-xs text-zinc-400">
                                                    <InlineField
                                                        value={`${exp.startDate} – ${exp.endDate}`}
                                                        onChange={(v) => {
                                                            const [start, end] =
                                                                v
                                                                    .split("–")
                                                                    .map((s) =>
                                                                        s.trim(),
                                                                    );
                                                            updateExperienceField(
                                                                i,
                                                                "startDate",
                                                                start,
                                                            );
                                                            updateExperienceField(
                                                                i,
                                                                "endDate",
                                                                end ?? "",
                                                            );
                                                        }}
                                                        className="text-sm"
                                                    />
                                                </p>
                                            </div>
                                            <ul className="mt-2 flex flex-col gap-1">
                                                {exp.bullets.map(
                                                    (bullet, j) => (
                                                        <li
                                                            key={j}
                                                            className="flex gap-2 text-sm text-zinc-700"
                                                        >
                                                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                                                            <InlineField
                                                                value={bullet}
                                                                onChange={(v) =>
                                                                    updateExperienceBullet(
                                                                        i,
                                                                        j,
                                                                        v,
                                                                    )
                                                                }
                                                                multiline
                                                                className="text-sm leading-relaxed flex-1"
                                                            />
                                                            {isSelected(
                                                                `exp-${i}`,
                                                            ) && (
                                                                <button
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        removeBullet(
                                                                            i,
                                                                            j,
                                                                        );
                                                                    }}
                                                                    className="mt-1 shrink-0 rounded p-0.5 text-zinc-300 transition hover:text-red-400"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                            {isSelected(`exp-${i}`) && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addBullet(i);
                                                    }}
                                                    className="mt-2 flex items-center gap-1 text-xs text-blue-400 transition hover:text-blue-600"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                    Add bullet
                                                </button>
                                            )}
                                        </div>
                                        {isSelected(`exp-${i}`) && (
                                            <div className="absolute -right-12 top-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeExperience(i);
                                                    }}
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-100 bg-white text-red-400 shadow-sm transition hover:bg-red-50 hover:text-red-500"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={addExperience}
                                    className="flex items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-3 text-sm text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-600"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add experience
                                </button>
                            </div>
                        </section>

                        {/* Education */}
                        <section className="mb-6">
                            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                                Education
                            </h2>
                            <div className="flex flex-col gap-3">
                                {doc.education.map((edu, i) => (
                                    <div
                                        key={i}
                                        data-entry
                                        onClick={(e) => select(`edu-${i}`, e)}
                                        className={`relative flex cursor-pointer rounded-xl p-3 -mx-3 transition ${isSelected(`edu-${i}`) ? "bg-blue-50 ring-2 ring-blue-200" : "hover:bg-zinc-50"}`}
                                    >
                                        <div className="flex-1 flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-semibold text-zinc-900">
                                                    <InlineField
                                                        value={edu.institution}
                                                        onChange={(v) => {
                                                            const education =
                                                                doc.education.map(
                                                                    (e, j) =>
                                                                        j === i
                                                                            ? {
                                                                                  ...e,
                                                                                  institution:
                                                                                      v,
                                                                              }
                                                                            : e,
                                                                );
                                                            updateField(
                                                                "education",
                                                                education,
                                                            );
                                                        }}
                                                        className="font-semibold"
                                                    />
                                                </h3>
                                                <p className="text-sm text-zinc-500">
                                                    <InlineField
                                                        value={`${edu.degree} · ${edu.field}`}
                                                        onChange={(v) => {
                                                            const [
                                                                degree,
                                                                field,
                                                            ] = v
                                                                .split("·")
                                                                .map((s) =>
                                                                    s.trim(),
                                                                );
                                                            const education =
                                                                doc.education.map(
                                                                    (e, j) =>
                                                                        j === i
                                                                            ? {
                                                                                  ...e,
                                                                                  degree,
                                                                                  field:
                                                                                      field ??
                                                                                      "",
                                                                              }
                                                                            : e,
                                                                );
                                                            updateField(
                                                                "education",
                                                                education,
                                                            );
                                                        }}
                                                    />
                                                </p>
                                            </div>
                                            <p className="text-xs text-zinc-400">
                                                <InlineField
                                                    value={edu.graduationDate}
                                                    onChange={(v) => {
                                                        const education =
                                                            doc.education.map(
                                                                (e, j) =>
                                                                    j === i
                                                                        ? {
                                                                              ...e,
                                                                              graduationDate:
                                                                                  v,
                                                                          }
                                                                        : e,
                                                            );
                                                        updateField(
                                                            "education",
                                                            education,
                                                        );
                                                    }}
                                                    className="text-sm"
                                                />
                                            </p>
                                        </div>
                                        {isSelected(`edu-${i}`) && (
                                            <div className="absolute -right-12 top-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeEducation(i);
                                                    }}
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-100 bg-white text-red-400 shadow-sm transition hover:bg-red-50 hover:text-red-500"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={addEducation}
                                    className="flex items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-3 text-sm text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-600"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add education
                                </button>
                            </div>
                        </section>

                        {/* Achievements */}
                        {doc.achievements && doc.achievements.length > 0 && (
                            <section className="mb-6">
                                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                                    Key Achievements
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {doc.achievements.map((achievement, i) => (
                                        <div
                                            key={i}
                                            data-entry
                                            onClick={(e) =>
                                                select(`ach-${i}`, e)
                                            }
                                            className={`relative flex cursor-pointer rounded-xl p-3 -mx-3 transition ${isSelected(`ach-${i}`) ? "bg-blue-50 ring-2 ring-blue-200" : "hover:bg-zinc-50"}`}
                                        >
                                            <div className="flex-1 flex gap-3">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-semibold text-zinc-900">
                                                        <InlineField
                                                            value={
                                                                achievement.title
                                                            }
                                                            onChange={(v) =>
                                                                updateAchievement(
                                                                    i,
                                                                    "title",
                                                                    v,
                                                                )
                                                            }
                                                            className="font-semibold text-sm"
                                                        />
                                                    </span>
                                                    <span className="text-sm text-zinc-600">
                                                        <InlineField
                                                            value={
                                                                achievement.description
                                                            }
                                                            onChange={(v) =>
                                                                updateAchievement(
                                                                    i,
                                                                    "description",
                                                                    v,
                                                                )
                                                            }
                                                            multiline
                                                            className="text-sm"
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                            {isSelected(`ach-${i}`) && (
                                                <div className="absolute -right-12 top-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeAchievement(
                                                                i,
                                                            );
                                                        }}
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-100 bg-white text-red-400 shadow-sm transition hover:bg-red-50 hover:text-red-500"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={addAchievement}
                                        className="flex items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-3 text-sm text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-600"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add achievement
                                    </button>
                                </div>
                            </section>
                        )}

                        {/* Projects */}
                        <section className="mb-6">
                            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                                Projects
                            </h2>
                            <div className="flex flex-col gap-4">
                                {(doc.projects ?? []).map((project, i) => (
                                    <div
                                        key={i}
                                        data-entry
                                        onClick={(e) => select(`proj-${i}`, e)}
                                        className={`relative flex cursor-pointer rounded-xl p-3 -mx-3 transition ${isSelected(`proj-${i}`) ? "bg-blue-50 ring-2 ring-blue-200" : "hover:bg-zinc-50"}`}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <h3 className="text-sm font-semibold text-zinc-900">
                                                    <InlineField
                                                        value={project.name}
                                                        onChange={(v) => {
                                                            const projects =
                                                                doc.projects!.map(
                                                                    (p, j) =>
                                                                        j === i
                                                                            ? {
                                                                                  ...p,
                                                                                  name: v,
                                                                              }
                                                                            : p,
                                                                );
                                                            updateField(
                                                                "projects",
                                                                projects,
                                                            );
                                                        }}
                                                        className="font-semibold"
                                                    />
                                                </h3>
                                                {project.url !== undefined && (
                                                    <span className="text-xs text-zinc-400">
                                                        <InlineField
                                                            value={
                                                                project.url ??
                                                                ""
                                                            }
                                                            onChange={(v) => {
                                                                const projects =
                                                                    doc.projects!.map(
                                                                        (
                                                                            p,
                                                                            j,
                                                                        ) =>
                                                                            j ===
                                                                            i
                                                                                ? {
                                                                                      ...p,
                                                                                      url: v,
                                                                                  }
                                                                                : p,
                                                                    );
                                                                updateField(
                                                                    "projects",
                                                                    projects,
                                                                );
                                                            }}
                                                            className="text-xs"
                                                            placeholder="Add URL"
                                                        />
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-zinc-500">
                                                <InlineField
                                                    value={project.description}
                                                    onChange={(v) => {
                                                        const projects =
                                                            doc.projects!.map(
                                                                (p, j) =>
                                                                    j === i
                                                                        ? {
                                                                              ...p,
                                                                              description:
                                                                                  v,
                                                                          }
                                                                        : p,
                                                            );
                                                        updateField(
                                                            "projects",
                                                            projects,
                                                        );
                                                    }}
                                                    multiline
                                                />
                                            </p>
                                            <ul className="mt-1 flex flex-col gap-1">
                                                {project.bullets.map(
                                                    (bullet, j) => (
                                                        <li
                                                            key={j}
                                                            className="flex gap-2 text-sm text-zinc-700"
                                                        >
                                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                                                            <InlineField
                                                                value={bullet}
                                                                onChange={(
                                                                    v,
                                                                ) => {
                                                                    const projects =
                                                                        doc.projects!.map(
                                                                            (
                                                                                p,
                                                                                pi,
                                                                            ) => {
                                                                                if (
                                                                                    pi !==
                                                                                    i
                                                                                )
                                                                                    return p;
                                                                                const bullets =
                                                                                    p.bullets.map(
                                                                                        (
                                                                                            b,
                                                                                            bi,
                                                                                        ) =>
                                                                                            bi ===
                                                                                            j
                                                                                                ? v
                                                                                                : b,
                                                                                    );
                                                                                return {
                                                                                    ...p,
                                                                                    bullets,
                                                                                };
                                                                            },
                                                                        );
                                                                    updateField(
                                                                        "projects",
                                                                        projects,
                                                                    );
                                                                }}
                                                                multiline
                                                                className="text-sm leading-relaxed flex-1"
                                                            />
                                                            {isSelected(
                                                                `proj-${i}`,
                                                            ) && (
                                                                <button
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        removeProjectBullet(
                                                                            i,
                                                                            j,
                                                                        );
                                                                    }}
                                                                    className="mt-1 shrink-0 rounded p-0.5 text-zinc-300 transition hover:text-red-400"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                            {isSelected(`proj-${i}`) && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addProjectBullet(i);
                                                    }}
                                                    className="mt-2 flex items-center gap-1 text-xs text-blue-400 transition hover:text-blue-600"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                    Add bullet
                                                </button>
                                            )}
                                        </div>
                                        {isSelected(`proj-${i}`) && (
                                            <div className="absolute -right-12 top-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeProject(i);
                                                    }}
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-100 bg-white text-red-400 shadow-sm transition hover:bg-red-50 hover:text-red-500"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={addProject}
                                    className="flex items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 py-3 text-sm text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-600"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add project
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Right margin spacer */}
                    <div className="w-16 shrink-0" />
                </div>
            </div>
        </div>
    );
}
