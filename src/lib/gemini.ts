import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const client = new GoogleGenAI({ apiKey });

async function callGemini(prompt: string): Promise<string> {
  const interaction = await client.interactions.create({
    model: "gemini-3-flash-preview",
    input: prompt,
  });
  if (interaction.outputs && interaction.outputs.length > 0) {
    const lastOutput = interaction.outputs[interaction.outputs.length - 1];
    if (lastOutput.type === "text" && lastOutput.text) {
      return lastOutput.text.trim().replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
    }
  }
  throw new Error("No text output from Gemini");
}

function safeParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
      .replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(cleaned);
  }
}

export async function getPositioning(job: string) {
  const prompt = `
    당신은 세계적인 직무 분석가이자 AI 전략 컨설턴트입니다.
    사용자가 입력한 직업: "${job}"

    사용자의 직무를 심층 분석하여 다음 구조의 JSON 형식으로만 응답하세요. 
    모든 텍스트 필드는 반드시 한국어(ko)와 영어(en) 버전을 모두 포함해야 합니다.

    {
      "job_title": { "ko": "표준 직무명", "en": "Standardized Job Title" },
      "definition": { "ko": "직무에 대한 전문적이고 명확한 정의 (2-3문장)", "en": "Professional and clear definition of the job (2-3 sentences)" },
      "positioning_summary": { "ko": "AI 시대의 전략적 위치와 가치 요약", "en": "Summary of strategic position and value in the AI era" },
      "career_advice": [
        { "ko": "역량을 유지하기 위한 구체적인 학습 방향", "en": "Specific learning direction to maintain competitiveness" }
      ],
      "categories": {
        "automation": [
          {
            "title": { "ko": "작업명", "en": "Task Name" },
            "reason": { "ko": "자동화 대상인 기술적/경제적 이유", "en": "Technical/Economic reason why this task is targeted for automation" },
            "automation_prompt": { "ko": "구체적인 프롬프트", "en": "Detailed prompt" }
          }
        ],
        "ai_enhanced": [
          {
            "title": { "ko": "작업명", "en": "Task Name" },
            "scenario": { "ko": "AI 도구를 통한 효율성 극대화 시나리오", "en": "Detailed description of how AI tools maximize efficiency" },
            "tool_recommendation": { "ko": "추천 AI 도구", "en": "Representative AI tool" }
          }
        ],
        "creative": [
          {
            "title": { "ko": "작업명", "en": "Task Name" },
            "human_value": { "ko": "인간의 판단과 창의성이 적용되는 지점", "en": "Points where unique human judgment and creativity are applied" }
          }
        ]
      }
    }

    **Important Guidelines:**
    1. Generate exactly 5 detailed items for each category (automation, ai_enhanced, creative).
    2. Generate exactly 3 detailed and high-impact items for "career_advice".
    3. The "automation_prompt" must be unique for each task and detailed enough to be executed immediately in both languages.
    4. Ensure both "ko" and "en" fields are accurately translated and culturally appropriate.
    5. RESPOND ONLY WITH THE JSON OBJECT. DO NOT INCLUDE ANY MARKDOWN BACKTICKS OR INTRODUCTORY TEXT.
  `;

  try {
    const interaction = await client.interactions.create({
      model: "gemini-3-flash-preview",
      input: prompt,
    });

    if (interaction.outputs && interaction.outputs.length > 0) {
      const lastOutput = interaction.outputs[interaction.outputs.length - 1];
      if (lastOutput.type === 'text' && lastOutput.text) {
        let text = lastOutput.text.trim();

        // Remove markdown block if present
        text = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");

        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1) {
          const jsonString = text.substring(firstBrace, lastBrace + 1);
          try {
            return JSON.parse(jsonString);
          } catch (parseError) {
            console.warn("Initial JSON parse failed, attempting aggressive cleanup...", parseError);

            // Aggressive cleanup: remove control characters, trailing commas, and fix potentially unescaped newlines in strings
            const cleanedJson = jsonString
              .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
              .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
              .replace(/\n/g, "\\n") // Escape potential unescaped newlines within strings (risky, but often what fails)
              // Restore structural newlines that we just escaped (this is a heuristic)
              .replace(/\\n\s*{\\n/g, "\n{\n")
              .replace(/\\n\s*}\\n/g, "\n}\n")
              .replace(/\\n\s*\[\\n/g, "\n[\n")
              .replace(/\\n\s*\]\\n/g, "\n]\n");

            try {
              return JSON.parse(cleanedJson);
            } catch (secondError) {
              // Final fallback: try to extract only valid JSON using a more basic approach if cleanup fails
              console.error("Aggressive cleanup also failed. Raw response snippet:", text.substring(0, 100));
              throw secondError;
            }
          }
        }
      }
    }
    throw new Error("Could not find a valid JSON object in the AI response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function generateEbookContent(
  job: string,
  item: { title: { ko: string; en: string }; human_value: { ko: string; en: string } }
) {
  const prompt = `당신은 전문 커리어 개발 작가입니다.
직무: "${job}"
핵심 역량: "${item.title.ko}" / "${item.title.en}"
인간적 가치: "${item.human_value.ko}"

위 역량을 주제로 전자책 샘플(3챕터)을 작성하세요.
각 챕터 content는 \\n\\n으로 구분된 3개 단락, 각 단락 100자 이상이어야 합니다.

다음 JSON 형식으로만 응답하세요:
{
  "title": { "ko": "${item.title.ko}: 인간 고유 역량 가이드", "en": "${item.title.en}: Human Competency Guide" },
  "subtitle": { "ko": "${job}의 대체 불가능한 핵심 역량", "en": "Irreplaceable Core Competency for ${job}" },
  "chapters": [
    { "title": { "ko": "제1장 제목", "en": "Chapter 1 Title" }, "content": { "ko": "단락1\\n\\n단락2\\n\\n단락3", "en": "Para1\\n\\nPara2\\n\\nPara3" }, "page_range": "1-15" },
    { "title": { "ko": "제2장 제목", "en": "Chapter 2 Title" }, "content": { "ko": "...", "en": "..." }, "page_range": "16-30" },
    { "title": { "ko": "제3장 제목", "en": "Chapter 3 Title" }, "content": { "ko": "...", "en": "..." }, "page_range": "31-45" }
  ],
  "total_pages": 45,
  "preview_note": { "ko": "이것은 샘플 미리보기입니다. 전체 버전에서 더 깊은 통찰을 얻으세요.", "en": "This is a sample preview. Get deeper insights from the full version." }
}
RESPOND ONLY WITH THE JSON OBJECT. NO MARKDOWN. NO EXTRA TEXT.`;

  const text = await callGemini(prompt);
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1) throw new Error("Invalid ebook JSON");
  return safeParseJson(text.substring(first, last + 1));
}

export async function generateWorkflowSteps(
  job: string,
  item: { title: { ko: string; en: string }; scenario: { ko: string; en: string }; tool_recommendation: { ko: string; en: string } }
) {
  const prompt = `당신은 AI 협업 워크플로 전문가입니다.
직무: "${job}"
작업: "${item.title.ko}" / "${item.title.en}"
시나리오: "${item.scenario.ko}"
추천 도구: "${item.tool_recommendation.ko}"

이 작업에서 LLM/AI 에이전트와 협업하는 6단계 실행 워크플로를 생성하세요.
각 단계는 구체적이고 즉시 실행 가능해야 합니다. 번호 없이 설명만 포함하세요.

다음 JSON 배열 형식으로만 응답하세요:
[
  { "ko": "단계 설명", "en": "Step description" },
  { "ko": "...", "en": "..." },
  { "ko": "...", "en": "..." },
  { "ko": "...", "en": "..." },
  { "ko": "...", "en": "..." },
  { "ko": "...", "en": "..." }
]
RESPOND ONLY WITH THE JSON ARRAY. NO MARKDOWN. NO EXTRA TEXT.`;

  const text = await callGemini(prompt);
  const first = text.indexOf("[");
  const last = text.lastIndexOf("]");
  if (first === -1 || last === -1) throw new Error("Invalid workflow JSON");
  return safeParseJson(text.substring(first, last + 1));
}

export async function getPartialPositioning(job: string, category: 'automation' | 'ai_enhanced' | 'creative') {
  const categoryNames = {
    automation: 'Automation',
    ai_enhanced: 'AI Enhanced',
    creative: 'Creative'
  };

  const categoryStructures = {
    automation: `{ "title": { "ko": "작업명", "en": "Task Name" }, "reason": { "ko": "자동화 이유", "en": "Automation Reason" }, "automation_prompt": { "ko": "프롬프트", "en": "Prompt" } }`,
    ai_enhanced: `{ "title": { "ko": "작업명", "en": "Task Name" }, "scenario": { "ko": "시나리오", "en": "Scenario" }, "tool_recommendation": { "ko": "도구", "en": "Tool" } }`,
    creative: `{ "title": { "ko": "작업명", "en": "Task Name" }, "human_value": { "ko": "인간의 가치", "en": "Human Value" } }`
  };

  const prompt = `
    당신은 세계적인 직무 분석가입니다.
    대상 직무: "${job}"
    새로 분석할 카테고리: "${categoryNames[category]}"

    이 직무의 "${categoryNames[category]}" 섹션만 다시 분석하여 다음 구조의 JSON 배열로만 응답하세요.
    반드시 5개의 새로운 항목을 생성해야 하며, 한국어(ko)와 영어(en) 버전을 모두 포함해야 합니다.

    반환 형식:
    [
      ${categoryStructures[category]},
      ... (총 5개)
    ]

    **Important Guidelines:**
    1. Generate exactly 5 NEW items.
    2. RESPOND ONLY WITH THE JSON ARRAY. DO NOT INCLUDE MARKDOWN BACKTICKS OR TEXT.
  `;

  try {
    const interaction = await client.interactions.create({
      model: "gemini-3-flash-preview",
      input: prompt,
    });

    if (interaction.outputs && interaction.outputs.length > 0) {
      const lastOutput = interaction.outputs[interaction.outputs.length - 1];
      if (lastOutput.type === 'text' && lastOutput.text) {
        let text = lastOutput.text.trim();
        text = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
        const firstBracket = text.indexOf('[');
        const lastBracket = text.lastIndexOf(']');

        if (firstBracket !== -1 && lastBracket !== -1) {
          const jsonString = text.substring(firstBracket, lastBracket + 1);
          try {
            return JSON.parse(jsonString);
          } catch (e) {
            console.warn("Partial JSON parse failed, attempting cleanup...", e);
            const cleaned = jsonString
              .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
              .replace(/,\s*([}\]])/g, '$1')
              .replace(/\n/g, "\\n")
              .replace(/\\n\s*{\\n/g, "\n{\n")
              .replace(/\\n\s*}\\n/g, "\n}\n")
              .replace(/\\n\s*\[\\n/g, "\n[\n")
              .replace(/\\n\s*\]\\n/g, "\n]\n");
            return JSON.parse(cleaned);
          }
        }
      }
    }
    throw new Error("Failed to parse partial AI response");
  } catch (error) {
    console.error(`Gemini Partial Refresh Error (${category}):`, error);
    throw error;
  }
}
