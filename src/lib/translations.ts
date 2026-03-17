export const translations = {
  ko: {
    badge: "AI 기반 직무 인텔리전스",
    title: "POSITIONING",
    subtitle: "표준 직무 분석을 넘어, AI 시대를 선도하는 나만의 포지셔닝 전략을 수립하세요.",
    inputPlaceholder: "직무를 입력하세요 (예: UI/UX 디자이너, 마케팅 매니저)",
    searchButton: "분석 시작",
    analyzing: "분석 중...",
    loading: {
      step1: "직무 데이터를 다각도로 수집하고 있습니다...",
      step2: "AI 기술의 파급력을 정밀하게 시뮬레이션 중입니다...",
      step3: "작업별 경쟁력 우위를 전략적으로 분류하고 있습니다...",
      step4: "당신만을 위한 독창적인 커리어 가이드를 조판 중입니다...",
      final: "곧 최적의 포지셔닝 전략이 공개됩니다..."
    },
    coreAdvice: "핵심 조언",
    automation: {
      title: "Automation",
      desc: "비효율을 제거할 기회",
    },
    aiEnhanced: {
      title: "AI Enhanced",
      desc: "상황별 성과 극대화",
    },
    creative: {
      title: "Creative",
      desc: "인간만의 고유한 영역",
    },
    toast: {
      copied: "프롬프트가 복사되었습니다.",
      instruction: "Ctrl+V를 눌러 입력해 사용하시오.",
    },
    philosophical: {
      tag: "생각해볼 점",
      quote: "AI는 당신의 일을 대신할 수 있지만, 당신의 삶을 대신 살아주지는 않습니다.",
      bullet1: "단 하나의 프롬프트만으로 보고서 한 편을 완성할 수 있습니다.",
      bullet2: "자동화 하나로 반복 업무의 굴레에서 벗어날 수 있습니다.",
      bullet3: "AI에게 물으면 단 몇 초 만에 원하는 답이 돌아옵니다.",
      convenience: "그러나 편리함은 어디까지나 수단에 불과합니다.",
      warning: "도구를 쥔 손이 더 이상 단련되지 않는다면, 머지않아 도구가 그 손을 이끌게 될 것입니다.",
      history1: "인류가 처음 불꽃을 손에 쥐었을 때 —",
      history2: "구텐베르크의 인쇄기가 세상에 나왔을 때 —",
      history3: "인터넷이 모든 것을 뒤바꾸었을 때 —",
      survival: "끝까지 살아남은 이들은 언제나 깨어 있었고, 배움을 놓지 않았습니다.",
      final1: "AI는 오늘의 문제를 풀어줍니다.",
      final2: "하지만 내일의 당신은",
      final3: "지금 이 순간 무엇을 배우느냐로 만들어집니다.",
      cta: "오늘 — 단 한 걸음 더 나아가 봅시다."
    },
  },
  en: {
    badge: "AI-Powered Career Intelligence",
    title: "POSITIONING",
    subtitle: "Go beyond standard job analysis. Build your unique positioning strategy lead the AI era.",
    inputPlaceholder: "Enter a job title (e.g., UI/UX Designer, Marketing Manager)",
    searchButton: "Start Analysis",
    analyzing: "Analyzing...",
    loading: {
      step1: "Collecting comprehensive job data...",
      step2: "Simulating AI's impact with precision...",
      step3: "Strategically categorizing task advantages...",
      step4: "Typesetting your unique transition guide...",
      final: "Finalizing your optimal positioning strategy..."
    },
    coreAdvice: "Core Advice",
    automation: {
      title: "Automation",
      desc: "Opportunities to eliminate inefficiency",
    },
    aiEnhanced: {
      title: "AI Enhanced",
      desc: "Maximizing performance by scenario",
    },
    creative: {
      title: "Creative",
      desc: "Unique human domains",
    },
    toast: {
      copied: "Prompt copied to clipboard.",
      instruction: "Press Ctrl+V to paste and use.",
    },
    philosophical: {
      tag: "A Final Thought",
      quote: "AI can handle your work, but it will never take responsibility for your life.",
      bullet1: "You can write a report with a single prompt.",
      bullet2: "Eliminate repetitive tasks through automation.",
      bullet3: "Get answers in seconds with AI.",
      convenience: "But convenience is just a tool.",
      warning: "If the hand holding the tool stops growing, eventually, the tool will hold you.",
      history1: "When humanity discovered fire —",
      history2: "When the printing press arrived —",
      history3: "When the internet changed everything —",
      survival: "The ones who survived were those who never stopped learning.",
      final1: "AI can solve today's problems.",
      final2: "But the person you become tomorrow",
      final3: "is built by what you learn today.",
      cta: "Let's grow one step further — today.",
    },
  },
};

export type Language = keyof typeof translations;
