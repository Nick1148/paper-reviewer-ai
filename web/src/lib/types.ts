export interface ArxivCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  nameKo: string;
  descriptionSimple: string;
  icon: string;
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
}

export interface GlossaryTerm {
  term: string;
  fullName: string;
  explanation: string;
}

export interface PaperExplanation {
  id: string;
  title: string;
  titleKo: string;
  tldr: string;
  summary: string;
  keyFindings: string[];
  whyItMatters: string;
  technicalDetail: string;
  category: string;
  arxivUrl: string;
  publishedDate: string;
  authors: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  beginnerSummary: string;
  glossary: GlossaryTerm[];
}

export interface GlossaryEntry {
  term: string;
  fullName: string;
  nameKo: string;
  category: string;
  shortDesc: string;
  analogy: string;
}
