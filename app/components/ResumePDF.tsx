import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Resume } from "@/types/resume";

const s = StyleSheet.create({
    page: {
        fontSize: 10,
        paddingTop: 48,
        paddingBottom: 48,
        paddingHorizontal: 52,
        color: "#18181b",
        backgroundColor: "#ffffff",
    },

    // Header
    header: {
        marginBottom: 20,
        paddingBottom: 14,
        borderBottomWidth: 1.5,
        borderBottomColor: "#6366f1",
    },
    name: {
        fontSize: 24,
        fontWeight: 700,
        color: "#18181b",
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    contactRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 4,
    },
    contactText: { fontSize: 9, color: "#71717a" },
    dot: { fontSize: 9, color: "#d4d4d8", marginHorizontal: 3 },

    // Section
    section: { marginBottom: 16 },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 7.5,
        fontWeight: 700,
        color: "#6366f1",
        textTransform: "uppercase",
        letterSpacing: 2,
    },
    sectionLine: {
        flex: 1,
        borderBottomWidth: 0.75,
        borderBottomColor: "#e0e7ff",
        marginBottom: 1,
    },

    // Summary
    summaryText: {
        fontSize: 9.5,
        color: "#3f3f46",
        lineHeight: 1.7,
    },

    // Skills
    skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
    skillTag: {
        fontSize: 8,
        color: "#4338ca",
        backgroundColor: "#eef2ff",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },

    // Achievements
    achievementRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 7,
        paddingLeft: 4,
    },
    achievementDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: "#6366f1",
        marginTop: 3,
    },
    achievementTitle: {
        fontSize: 9.5,
        fontWeight: 600,
        color: "#18181b",
        marginBottom: 1,
    },
    achievementDesc: { fontSize: 9, color: "#52525b", lineHeight: 1.5 },

    // Experience
    expEntry: {
        marginBottom: 14,
        paddingBottom: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: "#f4f4f5",
    },
    expLastEntry: { marginBottom: 0 },
    expHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 3,
    },
    expTitle: { fontSize: 10.5, fontWeight: 700, color: "#18181b" },
    expCompany: { fontSize: 9, color: "#71717a", marginTop: 1 },
    expDateBadge: {
        backgroundColor: "#f4f4f5",
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 4,
    },
    expDate: { fontSize: 8.5, color: "#71717a" },
    bulletRow: { flexDirection: "row", gap: 7, marginTop: 4 },
    bulletDot: {
        width: 3.5,
        height: 3.5,
        borderRadius: 2,
        backgroundColor: "#a5b4fc",
        marginTop: 4.5,
    },
    bulletText: {
        fontSize: 9,
        color: "#3f3f46",
        lineHeight: 1.6,
        flex: 1,
    },

    // Education
    eduEntry: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    eduInstitution: { fontSize: 10, fontWeight: 600, color: "#18181b" },
    eduDegree: { fontSize: 9, color: "#71717a", marginTop: 1 },
    eduDateBadge: {
        backgroundColor: "#f4f4f5",
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 4,
    },
    eduDate: { fontSize: 8.5, color: "#71717a" },

    // Projects
    projEntry: { marginBottom: 12 },
    projHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
    },
    projName: { fontSize: 10, fontWeight: 600, color: "#18181b" },
    projUrl: { fontSize: 8, color: "#a5b4fc" },
    projDesc: {
        fontSize: 9,
        color: "#71717a",
        marginBottom: 4,
        lineHeight: 1.5,
    },
});

// Reusable section header with indigo line
function SectionHeader({ title }: { title: string }) {
    return (
        <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>{title}</Text>
            <View style={s.sectionLine} />
        </View>
    );
}

interface Props {
    resume: Resume;
}

export default function ResumePDF({ resume: r }: Props) {
    return (
        <Document>
            <Page size="A4" style={s.page}>
                {/* Header */}
                <View style={s.header}>
                    <Text style={s.name}>{r.name}</Text>
                    <View style={s.contactRow}>
                        <Text style={s.contactText}>{r.email}</Text>
                        <Text style={s.dot}>·</Text>
                        <Text style={s.contactText}>{r.phone}</Text>
                        <Text style={s.dot}>·</Text>
                        <Text style={s.contactText}>{r.location}</Text>
                        {r.linkedin && (
                            <>
                                <Text style={s.dot}>·</Text>
                                <Text style={s.contactText}>{r.linkedin}</Text>
                            </>
                        )}
                        {r.github && (
                            <>
                                <Text style={s.dot}>·</Text>
                                <Text style={s.contactText}>{r.github}</Text>
                            </>
                        )}
                    </View>
                </View>

                {/* Summary */}
                <View style={s.section}>
                    <SectionHeader title="Summary" />
                    <Text style={s.summaryText}>{r.summary}</Text>
                </View>

                {/* Key Achievements */}
                {r.achievements && r.achievements.length > 0 && (
                    <View style={s.section}>
                        <SectionHeader title="Key Achievements" />
                        {r.achievements.map((a, i) => (
                            <View key={i} style={s.achievementRow}>
                                <View style={s.achievementDot} />
                                <View style={{ flex: 1 }}>
                                    <Text style={s.achievementTitle}>
                                        {a.title}
                                    </Text>
                                    <Text style={s.achievementDesc}>
                                        {a.description}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                <View style={s.section}>
                    <SectionHeader title="Skills" />
                    <View style={s.skillsRow}>
                        {r.skills.map((skill, i) => (
                            <Text key={i} style={s.skillTag}>
                                {skill}
                            </Text>
                        ))}
                    </View>
                </View>

                {/* Experience */}
                <View style={s.section}>
                    <SectionHeader title="Experience" />
                    {r.experience.map((exp, i) => (
                        <View
                            key={i}
                            style={
                                i === r.experience.length - 1
                                    ? s.expLastEntry
                                    : s.expEntry
                            }
                        >
                            <View style={s.expHeader}>
                                <View style={{ flex: 1 }}>
                                    <Text style={s.expTitle}>{exp.title}</Text>
                                    <Text style={s.expCompany}>
                                        {exp.company} · {exp.location}
                                    </Text>
                                </View>
                                <View style={s.expDateBadge}>
                                    <Text style={s.expDate}>
                                        {exp.startDate} – {exp.endDate}
                                    </Text>
                                </View>
                            </View>
                            {exp.bullets.map((bullet, j) => (
                                <View key={j} style={s.bulletRow}>
                                    <View style={s.bulletDot} />
                                    <Text style={s.bulletText}>{bullet}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Education */}
                <View style={s.section}>
                    <SectionHeader title="Education" />
                    {r.education.map((edu, i) => (
                        <View key={i} style={s.eduEntry}>
                            <View style={{ flex: 1 }}>
                                <Text style={s.eduInstitution}>
                                    {edu.institution}
                                </Text>
                                <Text style={s.eduDegree}>
                                    {edu.degree} · {edu.field}
                                </Text>
                            </View>
                            <View style={s.eduDateBadge}>
                                <Text style={s.eduDate}>
                                    {edu.graduationDate}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Projects */}
                {r.projects && r.projects.length > 0 && (
                    <View style={s.section}>
                        <SectionHeader title="Projects" />
                        {r.projects.map((proj, i) => (
                            <View key={i} style={s.projEntry}>
                                <View style={s.projHeader}>
                                    <Text style={s.projName}>{proj.name}</Text>
                                    {proj.url && (
                                        <Text style={s.projUrl}>
                                            {proj.url}
                                        </Text>
                                    )}
                                </View>
                                <Text style={s.projDesc}>
                                    {proj.description}
                                </Text>
                                {proj.bullets.map((bullet, j) => (
                                    <View key={j} style={s.bulletRow}>
                                        <View style={s.bulletDot} />
                                        <Text style={s.bulletText}>
                                            {bullet}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
}
