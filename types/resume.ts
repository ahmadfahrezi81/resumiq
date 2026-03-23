export interface ResumeExperience {
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
}

export interface ResumeEducation {
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
}

export interface ResumeProject {
    name: string;
    description: string;
    bullets: string[];
    url?: string;
}

export interface ResumeAchievement {
    title: string;
    description: string;
}

export interface Resume {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    summary: string;
    skills: string[];
    achievements?: ResumeAchievement[];
    experience: ResumeExperience[];
    education: ResumeEducation[];
    projects?: ResumeProject[];
}
