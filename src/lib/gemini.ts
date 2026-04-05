import { GoogleGenAI, Type } from "@google/genai";
import { SHAMANIC_KNOWLEDGE } from "../constants";

const getApiKey = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('GEMINI_API_KEY') || "";
  }
  return "";
};

function getAIClient() {
  const key = getApiKey();
  if (!key) throw new Error("API_KEY_NOT_FOUND");
  return new GoogleGenAI({ apiKey: key });
}

// Safety categories and thresholds as string types compatible with the SDK
const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT" as any, threshold: "BLOCK_ONLY_HIGH" as any },
  { category: "HARM_CATEGORY_HATE_SPEECH" as any, threshold: "BLOCK_ONLY_HIGH" as any },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT" as any, threshold: "BLOCK_ONLY_HIGH" as any },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT" as any, threshold: "BLOCK_ONLY_HIGH" as any }
];

export interface InterpretationResult {
  intent: string;
  selectedSymbols: string[];
  selectedColors: string[];
  deity: string;
  ritualPurpose: string;
  ritualSpace: string;
  composition: string;
  explanation: string;
  englishPrompt: string;
}

export async function interpretUserIntent(userInput: string): Promise<InterpretationResult> {
  const response = await getAIClient().models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `
      사용자의 의도를 '한국 전통 무속(Muism) 전용' 상징 체계로 해석해줘.
      중요: 불교(부처, 사찰, 스님)와 무속은 엄격히 구분되어야 함. 무속 고유의 원형과 설화(바리공주, 성주신 등)에 집중할 것.
      입력: "${userInput}"

      지식 기반:
      - 색채: ${JSON.stringify(SHAMANIC_KNOWLEDGE.colors)}
      - 문양: ${JSON.stringify(SHAMANIC_KNOWLEDGE.patterns)}
      - 무구: ${JSON.stringify(SHAMANIC_KNOWLEDGE.mugu)}
      - 신격: ${JSON.stringify(SHAMANIC_KNOWLEDGE.deities)}
      - 제의 목적: ${JSON.stringify(SHAMANIC_KNOWLEDGE.ritual_purposes)}
      - 제의 공간: ${JSON.stringify(SHAMANIC_KNOWLEDGE.ritual_spaces)}
      - 금기 사항: ${JSON.stringify(SHAMANIC_KNOWLEDGE.taboos)}

      해석 원칙:
      1. 장식용 판타지가 아닌, 실제 무당의 굿판이나 무신도에서 볼 법한 정통 무속 미학을 유지할 것.
      2. 사후 세계 언급 시 '극락' 대신 무속의 '서천꽃밭'이나 '조상의 품'으로 해석할 것.
      3. 금기 사항을 엄격히 준수할 것 (불교 사찰, 불상, 타 종교 상징 절대 금지).

      다음 JSON 형식으로 응답해줘:
      {
        "intent": "의도 카테고리",
        "selectedSymbols": ["선택된 문양/무구 ID 리스트"],
        "selectedColors": ["선택된 색채 ID 리스트"],
        "deity": "선립된 신격 이름과 의미 (무속 고유 신명 우선)",
        "ritualPurpose": "선정된 제의 목적 이름과 의미",
        "ritualSpace": "선정된 제의 공간 이름과 의미 (굿청, 성황당 등)",
        "composition": "장면 구성 방식 (무속적 역동성 강조)",
        "explanation": "이 이미지가 왜 이렇게 구성되었는지에 대한 한국어 설명",
        "englishPrompt": "Detailed English prompt emphasizing authentic Korean Shamanic aesthetics. Focus on Musindo style, Osaek-cheon ribbons, and Mu-bok robes."
      }
    `,
    config: {
      responseMimeType: "application/json",
      safetySettings: SAFETY_SETTINGS,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          intent: { type: Type.STRING },
          selectedSymbols: { type: Type.ARRAY, items: { type: Type.STRING } },
          selectedColors: { type: Type.ARRAY, items: { type: Type.STRING } },
          deity: { type: Type.STRING },
          ritualPurpose: { type: Type.STRING },
          ritualSpace: { type: Type.STRING },
          composition: { type: Type.STRING },
          explanation: { type: Type.STRING },
          englishPrompt: { type: Type.STRING }
        },
        required: ["intent", "selectedSymbols", "selectedColors", "deity", "ritualPurpose", "ritualSpace", "composition", "explanation", "englishPrompt"]
      }
    }
  });

  if (response.candidates?.[0]?.finishReason === "SAFETY") {
    throw new Error("SAFETY_BLOCK: 무속 콘텐츠가 안전 필터에 의해 차단되었습니다.");
  }

  const text = response.text;
  if (!text) {
    throw new Error("Empty response from AI");
  }

  try {
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse AI response as JSON:", text);
    throw new Error("Invalid AI response format");
  }
}

export async function generateShamanicImage(
  prompt: string, 
  aspectRatio: string = "1:1", 
  mode: 'vision' | 'talisman' = 'vision',
  artStyle: string = 'musindo',
  resolution: '512px' | '1K' | '2K' | '4K' = '1K'
): Promise<string> {
  const supportedRatios: Record<string, string> = {
    "1:1": "1:1",
    "16:9": "16:9",
    "9:16": "9:16",
    "2:3": "3:4",
    "3:2": "4:3"
  };

  const ratio = supportedRatios[aspectRatio] || "1:1";

  const artStylePrompts: Record<string, string> = {
    'musindo': 'Traditional Korean Shamanic Deity painting (Musindo). Bold black brush outlines, flat perspective, vibrant Obangsaek colors, and a strong sense of divine icon worship.',
    'seokchae': 'High-end authentic Shamanic art using Traditional Mineral Pigments (Seokchae). Deep, heavy textures of cinnabar red and indigo, multiple layers of natural pigments, authoritative and solemn atmosphere.',
    'pillyeok': 'Shamanic art focused on Energetic Brushwork (Pillyeok). Powerful, fluid, and mystical ink lines that capture the raw "Gi" (spiritual energy) of the deity. Dynamic and spiritually charged.',
    'minhwa': 'Korean Shamanic Folk Art (Minhwa) style. Humorous, narrative, and warm textures on old mulberry paper, depicting deities in a more storytelling and approachable way.',
    'modern': 'Modern Shamanic Digital Art. Cinematic lighting, glowing Osaek-cheon ribbons, swirling spiritual energy, and high-definition Korean cultural motifs while preserving sacred iconography.'
  };

  const selectedArtStyle = artStylePrompts[artStyle] || artStylePrompts['musindo'];

  const systemPrompt = mode === 'vision' 
    ? `An exquisite, high-end ${selectedArtStyle}. ${prompt}. 
       Visual Quality: High-resolution 8k professional shamanic ritual art. 
       Core Aesthetic: Traditional Korean mineral pigments (Seokchae) effect. Use rich, deep cinnabar red (Jusa), deep indigo, and charcoal blacks. 
       Fine Details: Intricate gold leaf (Geumbak) accents on sacred patterns. Masterful energetic brush strokes with visible ink textures (Pillyeok). 
       Key Visuals: Detailed shamanic ritual tools (Obanggi flags, bells, fans), precise traditional robes (Mu-bok), and sacred spaces like Seonang-dang with vibrant ritual ribbons.
       Composition: Symmetrical, centered divine figures with powerful presence. Add atmospheric depth with mystical fog, traditional clouds, and spiritual auras.
       CRITICAL: Strictly Korean Shamanism (Muism) origins. NO Buddhism, NO Pagodas, No Monks, NO Japanese Torii, No Chinese styles.
       Atmosphere: Majestic, spiritually charged, and highly sophisticated.`
    : `An authentic, premium Korean Shamanic Talisman (Bujeok). ${prompt}.
       Visual Style: Deep dark-red cinnabar (Jusa) ink with visible brush textures on aged, fibrous yellow mulberry paper. 
       Content: Stylized, mysterious abstract shamanic symbols and masterful calligraphic lines.
       Composition: Centered, vertical, authoritative talisman layout.
       Texture: Authentic paper texture, slightly bleeding ink from brush weight.
       CRITICAL: No readable text. Only abstract spiritual symbols.`;

  const response = await getAIClient().models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: {
      parts: [
        {
          text: `${systemPrompt} Referrer policy: no-referrer.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: ratio as any,
        imageSize: resolution
      },
      safetySettings: SAFETY_SETTINGS
    }
  });

  if (response.candidates?.[0]?.finishReason === "SAFETY") {
    throw new Error("SAFETY_BLOCK: 이미지 생성 프롬프트가 안전 필터에 의해 차단되었습니다.");
  }

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Image generation failed");
}
