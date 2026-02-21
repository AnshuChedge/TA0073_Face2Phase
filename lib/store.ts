export type InterviewMode = "interview" | "group-discussion"
export type Difficulty = "easy" | "medium" | "hard"
export type CompanyType = "product" | "service"

export interface AppState {
  mode: InterviewMode | null
  difficulty: Difficulty | null
  companyType: CompanyType | null
  resumeText: string | null
  resumeFileName: string | null
}

export const defaultState: AppState = {
  mode: null,
  difficulty: null,
  companyType: null,
  resumeText: null,
  resumeFileName: null,
}

// Interview questions based on difficulty and company type
export function getQuestions(
  difficulty: Difficulty,
  companyType: CompanyType,
  resumeText: string | null
): string[] {
  const baseQuestions: Record<Difficulty, Record<CompanyType, string[]>> = {
    easy: {
      product: [
        "Tell me about yourself and your background.",
        "Why are you interested in working at a product-based company?",
        "What is your favorite product and why?",
        "Describe a project you have worked on recently.",
        "How do you handle feedback from your team?",
      ],
      service: [
        "Tell me about yourself and your experience.",
        "Why do you want to work in the IT services industry?",
        "How do you prioritize tasks when working on multiple projects?",
        "Describe your experience working with clients.",
        "What does good customer service mean to you?",
      ],
    },
    medium: {
      product: [
        "Walk me through a complex technical project you have led.",
        "How would you design a URL shortening service?",
        "Tell me about a time you disagreed with your manager. How did you handle it?",
        "Explain the difference between SQL and NoSQL databases. When would you use each?",
        "How do you approach debugging a production issue?",
        "Describe your experience with agile methodologies.",
      ],
      service: [
        "How do you manage scope creep in client projects?",
        "Describe a time you had to deliver a project under a tight deadline.",
        "How do you ensure quality in your deliverables?",
        "Explain your experience with requirement gathering and documentation.",
        "Tell me about a time you turned around a dissatisfied client.",
        "How do you balance technical debt with new feature development?",
      ],
    },
    hard: {
      product: [
        "Design a distributed cache system that handles millions of requests per second.",
        "You discover a critical security vulnerability 2 hours before a major release. Walk me through your decision-making process.",
        "How would you architect a real-time collaboration tool like Google Docs?",
        "Tell me about the most technically challenging problem you have ever solved.",
        "A senior engineer on your team consistently delivers late. How do you address this?",
        "Explain CAP theorem and how it influences your system design decisions.",
        "How would you improve the performance of a system that is experiencing 10x traffic growth?",
      ],
      service: [
        "A client wants to change the entire project scope mid-sprint with no budget increase. How do you handle this?",
        "Design a microservices architecture for a banking application.",
        "How do you handle conflicting requirements from multiple stakeholders?",
        "Describe a situation where you had to make a critical technical decision under pressure.",
        "A production system is down and the client is losing revenue. Walk me through your incident response.",
        "How would you migrate a legacy monolith to a cloud-native architecture?",
        "Your team is burned out and morale is low. What steps do you take?",
      ],
    },
  }

  const questions = [...baseQuestions[difficulty][companyType]]

  if (resumeText) {
    const resumeQuestions = [
      "Based on your resume, can you elaborate on your most recent role?",
      "I see some interesting projects on your resume. Which one are you most proud of and why?",
      "Your resume mentions several technologies. Which one do you consider your strongest?",
    ]
    questions.splice(2, 0, ...resumeQuestions.slice(0, 2))
  }

  return questions
}

// Group discussion topics
export function getGDTopics(difficulty: Difficulty): { topic: string; perspectives: string[] }[] {
  const topics: Record<Difficulty, { topic: string; perspectives: string[] }[]> = {
    easy: [
      {
        topic: "Should remote work become the permanent standard for all companies?",
        perspectives: [
          "Remote work increases productivity and saves commute time.",
          "In-office work is essential for team bonding and mentorship.",
          "A hybrid model is the best compromise for most organizations.",
        ],
      },
    ],
    medium: [
      {
        topic: "Is artificial intelligence a threat or an opportunity for the job market?",
        perspectives: [
          "AI will create more jobs than it eliminates by enabling new industries.",
          "AI will displace millions of workers, especially in routine tasks.",
          "The impact depends entirely on how governments and companies manage the transition.",
          "AI should be seen as a tool that augments human capabilities, not replaces them.",
        ],
      },
    ],
    hard: [
      {
        topic: "Should big tech companies be broken up to prevent monopolistic practices?",
        perspectives: [
          "Large tech companies stifle competition and should be regulated more strictly.",
          "Breaking up tech giants would harm innovation and the global competitiveness of the economy.",
          "Instead of breaking them up, we need stronger antitrust enforcement and data privacy laws.",
          "The free market should decide — if consumers are happy, there is no problem.",
          "Tech monopolies are fundamentally different from traditional monopolies and need new frameworks.",
        ],
      },
    ],
  }
  return topics[difficulty]
}
