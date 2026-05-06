enum AnalysisStages {
  NEW = "NEW",
  REQUIRES_CLARIFICATION = "REQUIRES_CLARIFICATION",
  REQUIRES_CONFIRMATION = "REQUIRES_CONFIRMATION",
  INITIAL_ANALYSIS_COMPLETE = "INITIAL_ANALYSIS_COMPLETE",
  LOGGED = "LOGGED",
}

const relevantSkills: string[] = ["Problem decomposition", "Solution design", "Code implementation", "Debugging", "Refactoring", "Code review", "Systems analysis", "Integration engineering", "Failure analysis", "Observability", "Reliability engineering", "API design", "API governance", "API integration", "API security", "API lifecycle management", "Infrastructure understanding", "Deployment engineering", "Configuration management", "Environment management", "Pipeline engineering", "Release management", "Build optimisation", "Secure coding", "Vulnerability management", "Threat modelling", "Access control", "Compliance engineering", "Data modelling", "Query optimisation", "Data migration", "Data integrity", "Test design", "Automated testing", "Quality assurance", "Performance analysis", "Optimisation", "Scalability engineering", "Stakeholder management", "Technical communication", "Requirement clarification", "Cross-team collaboration", "Task ownership", "Prioritisation", "Risk management", "Time management", "Technical documentation", "Knowledge sharing", "Incident response", "Root cause analysis", "Operational support", "User impact analysis", "Business alignment", "Self-directed learning", "Feedback integration", "Skill gap analysis", "Leadership", "Mentoring", "Teamwork", "Adaptability", "Decision making", "Conflict resolution", "Negotiation", "Presentation skills", "Active listening", "Relationship building", "Emotional intelligence", "Accountability", "Initiative", "Professional judgement", "Strategic thinking", "Influencing", "Resilience", "Attention to detail", "Critical thinking", "Customer focus"];

export { AnalysisStages, relevantSkills };
