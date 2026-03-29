import { InterpretationResult } from "./gemini";
import { SHAMANIC_KNOWLEDGE } from "../constants";

export function generateShamanicHtml(
  input: string,
  imageUrl: string,
  result: InterpretationResult,
  options: { artStyle: string; intensity: number; visualStyle: string }
): string {
  const getSymbolDetails = (id: string) => {
    const flattenedDeities = SHAMANIC_KNOWLEDGE.deities.flatMap(d => d.items);
    return [
      ...SHAMANIC_KNOWLEDGE.patterns, 
      ...SHAMANIC_KNOWLEDGE.mugu, 
      ...flattenedDeities,
      ...SHAMANIC_KNOWLEDGE.ritual_purposes,
      ...SHAMANIC_KNOWLEDGE.ritual_spaces
    ].find(s => s.id === id);
  };

  const artStyleNames: Record<string, string> = {
    'musindo': '무신도 (Deity Painting)',
    'minhwa': '민화 (Folk Art)',
    'bulhwa': '불화 (Buddhist Painting)',
    'modern': '현대적 재해석 (Modern)'
  };

  const visualStyleNames: Record<string, string> = {
    'human': '인간형 (Humanoid)',
    'symbol': '상징형 (Symbolic)',
    'space': '공간형 (Spatial)'
  };

  const getColorDetails = (id: string) => {
    return SHAMANIC_KNOWLEDGE.colors.find(c => c.id === id);
  };

  const symbolsHtml = result.selectedSymbols
    .map(id => {
      const s = getSymbolDetails(id);
      return s ? `
        <div class="symbol-card">
          <h3>${s.name}</h3>
          <p>${s.meaning}</p>
          <small>${(s as any).description || ''}</small>
        </div>
      ` : '';
    })
    .join('');

  const colorsHtml = result.selectedColors
    .map(id => {
      const c = getColorDetails(id);
      return c ? `
        <div class="color-item">
          <div class="color-swatch" style="background-color: ${c.hex}"></div>
          <span>${c.name}</span>
        </div>
      ` : '';
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>의도기원 리포트 - ${result.intent}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,700;1,300&family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #0a0502;
            --accent: #ff4e00;
            --text: #ffffff;
            --glass: rgba(255, 255, 255, 0.05);
            --border: rgba(255, 255, 255, 0.1);
        }
        body {
            background-color: var(--bg);
            color: var(--text);
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 40px 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        header {
            text-align: center;
            margin-bottom: 60px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 40px;
        }
        h1 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 3rem;
            margin: 0;
            background: linear-gradient(to right, #ff4e00, #ffcc00);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .subtitle {
            text-transform: uppercase;
            letter-spacing: 0.3em;
            font-size: 0.8rem;
            opacity: 0.5;
            margin-top: 10px;
        }
        .main-image {
            width: 100%;
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            margin-bottom: 40px;
            border: 1px solid var(--border);
        }
        .section {
            background: var(--glass);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 40px;
            margin-bottom: 40px;
        }
        h2 {
            font-family: 'Cormorant Garamond', serif;
            font-size: 1.8rem;
            margin-top: 0;
            color: var(--accent);
            border-bottom: 1px solid var(--border);
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .intent-badge {
            display: inline-block;
            padding: 5px 15px;
            background: rgba(255, 78, 0, 0.2);
            border: 1px solid var(--accent);
            border-radius: 100px;
            font-size: 0.8rem;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .explanation {
            font-style: italic;
            font-size: 1.1rem;
            color: rgba(255,255,255,0.8);
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
        }
        .symbol-card {
            background: rgba(255,255,255,0.03);
            padding: 20px;
            border-radius: 16px;
            border: 1px solid var(--border);
        }
        .symbol-card h3 {
            margin: 0 0 10px 0;
            font-size: 1rem;
            color: #fff;
        }
        .symbol-card p {
            margin: 0;
            font-size: 0.85rem;
            opacity: 0.7;
        }
        .color-list {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        .color-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .color-swatch {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 1px solid var(--border);
        }
        footer {
            text-align: center;
            margin-top: 60px;
            opacity: 0.3;
            font-size: 0.7rem;
            letter-spacing: 0.2em;
        }
        @media (max-width: 600px) {
            h1 { font-size: 2rem; }
            .section { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>MUISM VISION V1.0</h1>
            <div class="subtitle">의도기원 (意圖祈願) 리포트</div>
        </header>

        <div class="section">
            <div class="intent-badge">${result.intent}</div>
            <p><strong>사용자 의도:</strong> "${input}"</p>
            <div class="grid" style="margin-top: 20px;">
                <div class="symbol-card">
                    <h3>선정 신격</h3>
                    <p>${result.deity}</p>
                </div>
                <div class="symbol-card">
                    <h3>제의 목적</h3>
                    <p>${result.ritualPurpose}</p>
                </div>
                <div class="symbol-card">
                    <h3>제의 공간</h3>
                    <p>${result.ritualSpace}</p>
                </div>
                <div class="symbol-card">
                    <h3>예술 양식</h3>
                    <p>${artStyleNames[options.artStyle] || options.artStyle}</p>
                </div>
                <div class="symbol-card">
                    <h3>시각 스타일</h3>
                    <p>${visualStyleNames[options.visualStyle] || options.visualStyle}</p>
                </div>
                <div class="symbol-card">
                    <h3>전통 고증도</h3>
                    <p>${options.intensity}%</p>
                </div>
            </div>
            <div class="explanation" style="margin-top: 20px;">"${result.explanation}"</div>
        </div>

        <img src="${imageUrl}" class="main-image" alt="Generated Shamanic Vision">

        <div class="section">
            <h2>상징 해석 (Symbolism)</h2>
            <div class="grid">
                ${symbolsHtml}
            </div>
        </div>

        <div class="section">
            <h2>색채 체계 (Color Palette)</h2>
            <div class="color-list">
                ${colorsHtml}
            </div>
        </div>

        <div class="section">
            <h2>제의적 리포트 (Ritual Report)</h2>
            <p>${result.composition}</p>
        </div>

        <footer>
            © 2026 MUISM VISION V1.0 · Generated via Shamanic AI Studio
        </footer>
    </div>
</body>
</html>
  `;
}
