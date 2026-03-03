import { createClient } from "@supabase/supabase-js";
import { ArxivCategory, PaperExplanation, GlossaryEntry } from "./types";

// Supabase 클라이언트 (서버 컴포넌트에서 직접 사용)
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

type PaperRow = Record<string, unknown> & { paper_explanations?: ExplanationRow[] };
type ExplanationRow = Record<string, unknown>;

function mapPaperRow(row: PaperRow): PaperExplanation {
  const exp: ExplanationRow | null = row.paper_explanations?.[0] ?? null;
  const cats = Array.isArray(row.categories) ? (row.categories as string[]) : [];
  return {
    id: String(row.arxiv_id ?? row.id ?? ""),
    title: String(row.title ?? ""),
    titleKo: String(row.title_ko ?? row.title ?? ""),
    tldr: String(exp?.tldr ?? ""),
    summary: String(exp?.summary ?? ""),
    keyFindings: Array.isArray(exp?.key_findings) ? (exp.key_findings as string[]) : [],
    whyItMatters: String(exp?.why_it_matters ?? ""),
    technicalDetail: String(exp?.technical_detail ?? ""),
    category: String(cats[0] ?? "AI"),
    arxivUrl: String(row.arxiv_url ?? ""),
    publishedDate: String(row.published_date ?? "").slice(0, 10),
    authors: Array.isArray(row.authors) ? (row.authors as string[]) : [],
    difficulty: (['beginner', 'intermediate', 'advanced'].includes(String(exp?.difficulty ?? ''))
      ? String(exp?.difficulty) as PaperExplanation['difficulty']
      : 'intermediate'),
    beginnerSummary: String(exp?.beginner_summary ?? ""),
    glossary: Array.isArray(exp?.glossary)
      ? (exp.glossary as Array<Record<string, string>>).map(g => ({
          term: g.term || '',
          fullName: g.full_name || g.fullName || '',
          explanation: g.explanation || '',
        }))
      : [],
  };
}

// arXiv 카테고리 정의 (한국어 이름, 초보자 설명, 아이콘 포함)
export const arxivCategories: ArxivCategory[] = [
  {
    id: "cs.AI",
    name: "Artificial Intelligence",
    description: "인공지능 전반, 지식 표현, 계획, 자연어 이해 등",
    slug: "cs-ai",
    nameKo: "인공지능",
    descriptionSimple: "컴퓨터가 사람처럼 생각하고 판단하는 기술",
    icon: "🤖",
  },
  {
    id: "cs.LG",
    name: "Machine Learning",
    description: "기계학습 알고리즘, 이론, 응용",
    slug: "cs-lg",
    nameKo: "기계학습",
    descriptionSimple: "컴퓨터가 데이터를 보고 스스로 배우는 기술",
    icon: "📊",
  },
  {
    id: "cs.CL",
    name: "Computation and Language",
    description: "자연어 처리, 텍스트 분석, 언어 모델",
    slug: "cs-cl",
    nameKo: "자연어 처리",
    descriptionSimple: "AI가 사람의 말과 글을 이해하는 기술 (ChatGPT 등)",
    icon: "💬",
  },
  {
    id: "cs.CV",
    name: "Computer Vision",
    description: "컴퓨터 비전, 이미지 인식, 객체 탐지",
    slug: "cs-cv",
    nameKo: "컴퓨터 비전",
    descriptionSimple: "AI가 사진과 영상을 보고 이해하는 기술",
    icon: "👁️",
  },
  {
    id: "stat.ML",
    name: "Machine Learning (Statistics)",
    description: "통계적 기계학습, 베이지안 방법론",
    slug: "stat-ml",
    nameKo: "통계적 기계학습",
    descriptionSimple: "수학과 통계를 활용해 AI를 학습시키는 방법",
    icon: "📈",
  },
  {
    id: "cs.RO",
    name: "Robotics",
    description: "로봇공학, 자율 시스템, 제어",
    slug: "cs-ro",
    nameKo: "로봇공학",
    descriptionSimple: "로봇이 스스로 움직이고 판단하는 기술",
    icon: "🦾",
  },
  {
    id: "cs.NE",
    name: "Neural and Evolutionary Computing",
    description: "신경망, 진화 연산, 딥러닝 아키텍처",
    slug: "cs-ne",
    nameKo: "신경망",
    descriptionSimple: "사람의 뇌 구조를 본뜬 AI 학습 방식",
    icon: "🧠",
  },
  {
    id: "cs.IR",
    name: "Information Retrieval",
    description: "정보 검색, 추천 시스템, 웹 검색",
    slug: "cs-ir",
    nameKo: "정보 검색",
    descriptionSimple: "원하는 정보를 빠르고 정확하게 찾아주는 기술",
    icon: "🔍",
  },
];

// 카테고리 유틸 함수
export function getCategoryNameKo(categoryId: string): string {
  const cat = arxivCategories.find(c => c.id === categoryId);
  return cat ? cat.nameKo : categoryId;
}

export function getCategoryIcon(categoryId: string): string {
  const cat = arxivCategories.find(c => c.id === categoryId);
  return cat ? cat.icon : "📄";
}

export function getCategoryLabel(categoryId: string): string {
  const cat = arxivCategories.find(c => c.id === categoryId);
  return cat ? `${cat.icon} ${cat.nameKo}` : categoryId;
}

// 상대 시간 포맷 (예: "3일 전", "오늘")
export function formatDateKo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;

  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

// 논문 mock 데이터
export const papers: PaperExplanation[] = [
  {
    id: "reasoning-models-2025",
    title: "Chain-of-Thought Reasoning at Scale: Emergent Abilities in Large Language Models",
    titleKo: "대규모 언어 모델의 단계적 추론: 규모가 커질수록 나타나는 새로운 능력",
    tldr: "100B 파라미터 이상의 LLM에서 Chain-of-Thought 프롬프팅이 수학적 추론 정확도를 47% 향상시킨다는 것을 대규모 실험으로 입증한 논문입니다.",
    summary: "본 연구는 대규모 언어 모델에서 Chain-of-Thought (CoT) 추론의 스케일링 법칙을 체계적으로 분석합니다. 10B부터 500B 파라미터까지 다양한 크기의 모델에서 CoT 프롬프팅의 효과를 측정한 결과, 모델 크기가 특정 임계점을 넘으면 추론 능력이 급격히 향상되는 'emergence' 현상을 확인했습니다. 특히 GSM8K, MATH, ARC 벤치마크에서 100B+ 모델의 CoT 성능이 기존 방법 대비 현저하게 높았습니다.",
    keyFindings: [
      "100B+ 모델에서 CoT 추론 성능이 비선형적으로 급증하는 emergence 현상 확인",
      "자기 일관성(Self-Consistency) 디코딩과 결합 시 추가 12% 성능 향상",
      "소형 모델(10B 이하)에서는 CoT가 오히려 성능을 저하시킬 수 있음",
      "멀티모달 CoT가 텍스트 전용 CoT 대비 시각적 추론에서 23% 우수",
    ],
    whyItMatters: "이 연구는 LLM의 추론 능력 향상을 위한 스케일링 전략에 중요한 시사점을 제공합니다. 모델 크기와 프롬프팅 기법의 상호작용을 이해함으로써, 기업들은 비용 대비 최적의 모델 크기를 선택할 수 있습니다. 또한 소형 모델에서 CoT가 역효과를 낼 수 있다는 발견은 경량 AI 배포 전략에 영향을 미칠 수 있습니다.",
    technicalDetail: "실험은 Transformer 아키텍처 기반 모델을 사용했으며, 파라미터 수 10B, 30B, 70B, 100B, 200B, 500B의 6개 스케일에서 진행되었습니다. CoT 프롬프팅은 few-shot (0, 3, 5, 8-shot) 설정으로 테스트했고, 각 설정에서 temperature 0.7, top-p 0.95의 샘플링을 사용했습니다. Self-Consistency는 각 문제당 40개 경로를 샘플링하여 다수결 투표로 최종 답을 결정했습니다.",
    category: "cs.CL",
    arxivUrl: "https://arxiv.org/abs/2401.00001",
    publishedDate: "2025-02-20",
    authors: ["Wei, J.", "Wang, X.", "Schuurmans, D.", "Le, Q."],
    difficulty: "intermediate",
    beginnerSummary: "AI에게 수학 문제를 풀게 할 때, '풀이 과정을 써봐'라고 시키면 정답률이 크게 올라간다는 연구입니다. 마치 학생이 시험에서 연습장에 풀이를 적으면 실수가 줄어드는 것과 같은 원리예요. 단, AI의 크기가 충분히 클 때만 효과가 있습니다.",
    glossary: [
      { term: "LLM", fullName: "Large Language Model", explanation: "ChatGPT처럼 사람의 말을 이해하고 생성하는 대규모 AI 모델" },
      { term: "CoT", fullName: "Chain-of-Thought", explanation: "AI가 문제를 풀 때 풀이 과정을 단계별로 적어가며 답을 구하는 방법" },
      { term: "파라미터", fullName: "Parameter", explanation: "AI가 학습한 지식이 저장되는 숫자들. 많을수록 더 많은 것을 기억할 수 있음" },
    ],
  },
  {
    id: "vision-transformer-efficiency",
    title: "EfficientViT-V3: Hardware-Aware Vision Transformer for Edge Deployment",
    titleKo: "EfficientViT-V3: 스마트폰에서도 돌아가는 초고속 이미지 인식 AI",
    tldr: "모바일/엣지 디바이스에서 ViT를 실시간으로 실행할 수 있게 하는 새로운 아키텍처로, ImageNet에서 기존 EfficientViT 대비 2.3배 빠르면서 정확도는 유지합니다.",
    summary: "Vision Transformer(ViT)의 엣지 디바이스 배포는 높은 연산 비용으로 인해 어려운 과제입니다. 본 논문은 하드웨어 특성을 고려한 새로운 어텐션 메커니즘과 네트워크 구조를 제안합니다. Cascaded Group Attention과 Hardware-Aware Neural Architecture Search를 결합하여, 실제 모바일 하드웨어에서의 latency를 최적화했습니다.",
    keyFindings: [
      "iPhone 15 Pro에서 224x224 이미지 추론 시 2.1ms 달성 (실시간 가능)",
      "ImageNet top-1 정확도 84.2%로 기존 EfficientViT-V2와 동등 수준 유지",
      "Cascaded Group Attention으로 메모리 접근 횟수 60% 감소",
      "ONNX Runtime 및 Core ML 변환 시에도 성능 저하 최소화",
    ],
    whyItMatters: "온디바이스 AI가 점점 중요해지는 시대에, 고성능 비전 모델을 모바일에서 실시간으로 실행할 수 있다는 것은 AR, 자율주행, 의료 영상 등 다양한 분야에 직접적인 영향을 미칩니다. 클라우드 의존도를 줄이고 프라이버시를 보호하면서도 높은 정확도를 유지할 수 있습니다.",
    technicalDetail: "아키텍처는 3단계 피라미드 구조를 사용하며, 각 단계에서 Cascaded Group Attention(CGA) 블록을 사용합니다. CGA는 기존 Multi-Head Attention을 그룹 단위로 분할하고 캐스케이드 방식으로 연결하여 연산량을 줄입니다. NAS는 latency 예측 모델을 기반으로 하며, iPhone Neural Engine, Snapdragon NPU, Google Edge TPU 각각에 특화된 아키텍처를 탐색합니다.",
    category: "cs.CV",
    arxivUrl: "https://arxiv.org/abs/2401.00002",
    publishedDate: "2025-02-19",
    authors: ["Cai, H.", "Gan, C.", "Han, S."],
    difficulty: "advanced",
    beginnerSummary: "보통 AI는 강력한 서버 컴퓨터에서만 돌아가지만, 이 연구는 스마트폰에서도 사진을 실시간으로 분석할 수 있는 가벼운 AI를 만들었습니다. 마치 무거운 백과사전 대신 핵심만 담은 포켓북을 만든 것과 같아요.",
    glossary: [
      { term: "ViT", fullName: "Vision Transformer", explanation: "이미지를 이해하는 데 특화된 AI 모델. 사진을 작은 조각으로 나눠서 분석함" },
      { term: "Attention", fullName: "Attention Mechanism", explanation: "AI가 중요한 부분에 집중하는 방법. 사람이 책을 읽을 때 핵심 문장에 밑줄 치는 것과 비슷" },
      { term: "엣지 디바이스", fullName: "Edge Device", explanation: "스마트폰, 태블릿처럼 우리 손에 있는 기기. 서버가 아닌 현장에서 직접 AI를 실행" },
    ],
  },
  {
    id: "multimodal-agents-planning",
    title: "WebAgent-2: Multimodal AI Agents for Autonomous Web Navigation",
    titleKo: "WebAgent-2: 웹사이트를 스스로 탐색하는 AI 비서",
    tldr: "GPT-4V 기반의 멀티모달 에이전트가 실제 웹사이트에서 복잡한 태스크를 자율적으로 수행할 수 있으며, 기존 텍스트 전용 에이전트 대비 성공률이 38% 높습니다.",
    summary: "본 연구는 스크린샷 이해와 HTML 분석을 결합한 멀티모달 웹 에이전트를 제안합니다. WebAgent-2는 시각적 페이지 이해, 계층적 태스크 분해, 자기 반성(Self-Reflection) 메커니즘을 통합하여 복잡한 웹 네비게이션 태스크를 자율적으로 수행합니다. Mind2Web, WebArena 벤치마크에서 SOTA 성능을 달성했습니다.",
    keyFindings: [
      "WebArena 벤치마크에서 태스크 성공률 64.2% 달성 (기존 SOTA 46.5%)",
      "시각적 grounding과 HTML 구조 분석의 결합이 핵심 성능 요인",
      "Self-Reflection 모듈로 실패한 액션을 자동으로 수정하여 성공률 15% 향상",
      "실제 전자상거래 사이트에서 장바구니 추가, 결제 등 복잡한 워크플로우 수행 가능",
    ],
    whyItMatters: "자율 웹 에이전트는 RPA(Robotic Process Automation)의 차세대 형태로, 기업 업무 자동화에 혁신적인 변화를 가져올 수 있습니다. 특히 비정형 웹 인터페이스를 이해하고 조작할 수 있다는 점에서, 기존 규칙 기반 자동화의 한계를 극복합니다.",
    technicalDetail: "시스템은 3개 모듈로 구성됩니다: (1) Visual Grounding Module - Set-of-Mark 프롬프팅으로 스크린샷의 인터랙티브 요소를 식별, (2) Task Planner - 복잡한 태스크를 서브태스크로 분해하고 실행 계획 수립, (3) Action Executor - 계획된 액션을 Playwright API로 실행. Self-Reflection은 액션 실행 후 페이지 상태를 재평가하여 예상과 다른 결과가 나오면 대안 액션을 생성합니다.",
    category: "cs.AI",
    arxivUrl: "https://arxiv.org/abs/2401.00003",
    publishedDate: "2025-02-18",
    authors: ["Gur, I.", "Nachum, O.", "Chen, Y.", "Faust, A."],
    difficulty: "beginner",
    beginnerSummary: "인터넷 쇼핑이나 예약 같은 일을 AI가 대신 해주는 기술입니다. 마치 비서가 '이 상품 장바구니에 담아줘'라고 하면 알아서 웹사이트를 돌아다니며 처리해주는 것과 같아요.",
    glossary: [
      { term: "에이전트", fullName: "AI Agent", explanation: "사람의 지시를 받아 스스로 행동하는 AI. 자율적으로 판단하고 실행함" },
      { term: "멀티모달", fullName: "Multimodal", explanation: "텍스트, 이미지, 소리 등 여러 종류의 정보를 동시에 이해하는 능력" },
      { term: "SOTA", fullName: "State-of-the-Art", explanation: "현재까지 가장 뛰어난 성능. '역대 최고 기록'과 같은 의미" },
    ],
  },
  {
    id: "diffusion-video-generation",
    title: "StableVideo-3: Temporally Consistent Video Generation with Diffusion Transformers",
    titleKo: "StableVideo-3: 글 한 줄로 30초 영상을 만드는 AI",
    tldr: "텍스트-to-비디오 생성에서 시간적 일관성 문제를 해결한 새로운 Diffusion Transformer 아키텍처로, 30초 이상의 일관된 비디오 생성이 가능합니다.",
    summary: "기존 비디오 생성 모델의 가장 큰 한계인 시간적 불일관성(temporal inconsistency)을 해결하는 새로운 접근법을 제안합니다. Temporal Attention Blocks과 Motion Flow Prediction을 Diffusion Transformer에 통합하여, 프레임 간 객체의 외형, 움직임, 배경이 일관되게 유지되는 고품질 비디오를 생성합니다.",
    keyFindings: [
      "30초(720프레임) 길이의 시간적으로 일관된 비디오 생성 가능",
      "FVD(Frechet Video Distance) 점수에서 기존 SOTA 대비 34% 개선",
      "인간 평가에서 시각적 품질 85.3%, 시간적 일관성 91.2% 선호율",
      "이미지-to-비디오 모드에서 참조 이미지의 스타일/구도 유지율 향상",
    ],
    whyItMatters: "영화, 광고, 교육 콘텐츠 제작 분야에서 AI 비디오 생성의 실용적 활용이 가능해집니다. 특히 30초 이상의 긴 비디오에서도 일관성을 유지할 수 있다는 것은, 프로페셔널 영상 제작 파이프라인에 AI를 통합할 수 있는 중요한 진전입니다.",
    technicalDetail: "아키텍처는 DiT(Diffusion Transformer) 기반으로, 기존 spatial attention 외에 temporal attention layer를 추가합니다. Motion Flow Predictor는 optical flow를 예측하여 프레임 간 변환을 가이드하며, Progressive Generation 전략으로 4프레임 단위로 생성 후 overlap 영역의 latent를 보간하여 긴 비디오를 생성합니다. 학습 데이터는 WebVid-10M과 내부 고품질 비디오 데이터셋을 사용했습니다.",
    category: "cs.CV",
    arxivUrl: "https://arxiv.org/abs/2401.00004",
    publishedDate: "2025-02-17",
    authors: ["Blattmann, A.", "Rombach, R.", "Ling, H.", "Muller, T."],
    difficulty: "intermediate",
    beginnerSummary: "글로 설명만 하면 AI가 자동으로 영상을 만들어주는 기술입니다. 기존에는 긴 영상을 만들면 중간에 사람 얼굴이 바뀌는 등 문제가 있었는데, 이 연구로 30초짜리 자연스러운 영상 제작이 가능해졌어요.",
    glossary: [
      { term: "Diffusion", fullName: "Diffusion Model", explanation: "노이즈(잡음)에서 시작해 점점 깨끗한 이미지/영상을 만들어내는 AI 기술" },
      { term: "Transformer", fullName: "Transformer Architecture", explanation: "현재 가장 널리 쓰이는 AI 구조. 데이터의 관계를 파악하는 데 뛰어남" },
      { term: "FVD", fullName: "Frechet Video Distance", explanation: "AI가 만든 영상의 품질을 측정하는 점수. 낮을수록 좋음" },
    ],
  },
  {
    id: "rlhf-alignment-safety",
    title: "Constitutional AI v2: Scalable Alignment Without Human Feedback Labels",
    titleKo: "Constitutional AI v2: 사람의 채점 없이 AI를 안전하게 만드는 방법",
    tldr: "인간 피드백 레이블 없이 AI 모델을 정렬(alignment)할 수 있는 Constitutional AI의 개선 버전으로, 안전성과 유용성을 동시에 향상시킵니다.",
    summary: "RLHF(Reinforcement Learning from Human Feedback)의 높은 비용과 레이블링 편향 문제를 해결하기 위해, 헌법적 AI(Constitutional AI)를 확장한 CAI-v2를 제안합니다. 자체 생성된 비평(critique)과 수정(revision)을 활용한 자기 개선 루프로 모델을 정렬하며, 다단계 헌법 규칙 체계로 복잡한 윤리적 상황에서의 판단 능력을 향상시킵니다.",
    keyFindings: [
      "인간 레이블 데이터 없이 RLHF 수준의 안전성 달성 (TruthfulQA에서 92.1%)",
      "다단계 헌법 규칙으로 상충하는 원칙 간의 우선순위 결정 가능",
      "유용성(helpfulness) 점수가 RLHF 대비 5.3% 향상",
      "레드팀 공격 성공률 7.2%로 기존 모델(18.4%) 대비 크게 감소",
    ],
    whyItMatters: "AI 안전성은 산업 전반의 핵심 과제입니다. RLHF의 비용과 확장성 문제를 해결하면서 동등 이상의 안전성을 달성할 수 있다면, 더 많은 조직이 안전한 AI를 배포할 수 있게 됩니다. 특히 인간 레이블러의 편향 문제를 우회할 수 있다는 점이 주목할 만합니다.",
    technicalDetail: "CAI-v2는 3단계 파이프라인으로 작동합니다: (1) 자기 비평 - 모델이 자신의 응답을 헌법 원칙에 비추어 평가, (2) 자기 수정 - 비평 결과를 반영하여 응답을 개선, (3) 정렬 학습 - 원본과 수정된 응답 쌍으로 DPO(Direct Preference Optimization) 학습. 헌법 규칙은 3계층(핵심 안전, 윤리적 가이드라인, 스타일 선호)으로 구성되며, 충돌 시 상위 계층이 우선합니다.",
    category: "cs.AI",
    arxivUrl: "https://arxiv.org/abs/2401.00005",
    publishedDate: "2025-02-16",
    authors: ["Bai, Y.", "Kadavath, S.", "Kundu, S.", "Askell, A."],
    difficulty: "beginner",
    beginnerSummary: "AI가 위험하거나 잘못된 답변을 하지 않도록 '규칙'을 정해주는 방법입니다. 기존에는 사람이 일일이 '이 답변은 좋아요/나빠요'를 채점해야 했는데, 이 연구에서는 AI가 스스로 자기 답변을 검토하고 고치는 방법을 찾았어요.",
    glossary: [
      { term: "RLHF", fullName: "Reinforcement Learning from Human Feedback", explanation: "사람의 평가를 바탕으로 AI를 훈련시키는 방법. ChatGPT도 이 방법으로 학습됨" },
      { term: "정렬", fullName: "Alignment", explanation: "AI가 사람의 의도와 가치관에 맞게 행동하도록 조정하는 과정" },
      { term: "레드팀", fullName: "Red Team", explanation: "일부러 AI를 공격해서 약점을 찾는 보안 테스트 팀" },
    ],
  },
  {
    id: "graph-neural-network-drug",
    title: "MolFormer-XL: Graph Transformer for Molecular Property Prediction and Drug Discovery",
    titleKo: "MolFormer-XL: AI가 신약 후보 물질을 찾아주는 그래프 트랜스포머",
    tldr: "분자 구조를 그래프로 표현하고 Transformer로 학습하여 신약 후보 물질의 특성을 예측하는 모델로, 기존 방법 대비 약물 독성 예측 정확도를 19% 향상시켰습니다.",
    summary: "신약 개발 과정에서 수백만 개의 화합물 중 유망한 후보를 선별하는 것은 막대한 시간과 비용이 드는 작업입니다. MolFormer-XL은 분자의 원자와 결합을 그래프 구조로 표현하고, 3D 공간 정보까지 반영하는 Graph Transformer 아키텍처를 제안합니다. ZINC-20 데이터셋의 14억 분자로 사전학습한 후 다양한 약물 특성 예측 태스크에서 미세조정하여 SOTA 성능을 달성했습니다.",
    keyFindings: [
      "MoleculeNet 벤치마크 12개 태스크 중 9개에서 SOTA 달성",
      "약물 독성(Tox21) 예측에서 AUC 0.94로 기존 최고 모델(0.79) 대폭 초과",
      "3D 좌표 정보를 반영한 Spatial Attention이 2D 그래프만 사용할 때 대비 11% 성능 향상",
      "사전학습 후 100개 미만의 샘플로도 새로운 약물 특성을 예측하는 few-shot 능력 확인",
    ],
    whyItMatters: "신약 하나를 개발하는 데 평균 10년, 2조 원 이상이 소요됩니다. AI가 초기 후보 물질 선별을 가속화하면 개발 기간과 비용을 획기적으로 줄일 수 있습니다. 특히 희귀 질환처럼 데이터가 적은 영역에서도 few-shot 예측이 가능하다는 점이 큰 의미를 가집니다.",
    technicalDetail: "MolFormer-XL은 GNN(Graph Neural Network)과 Transformer를 결합합니다. 입력 분자는 SMILES 문자열에서 RDKit으로 3D 구조를 생성하고, 원자를 노드, 결합을 엣지로 변환합니다. Spatial Attention은 3D 좌표 간 거리를 bias로 사용하여 공간적 관계를 반영합니다. 사전학습은 Masked Atom Prediction과 3D Position Denoising의 두 가지 목적함수를 사용합니다.",
    category: "cs.LG",
    arxivUrl: "https://arxiv.org/abs/2401.00006",
    publishedDate: "2025-02-15",
    authors: ["Ross, J.", "Belgrave, D.", "Stojanov, P."],
    difficulty: "advanced",
    beginnerSummary: "새로운 약을 만들려면 수백만 가지 화학물질 중에서 효과가 있고 안전한 것을 골라야 하는데, 이 과정이 매우 오래 걸립니다. 이 AI는 화학물질의 구조를 보고 '이 물질은 약으로 쓸 수 있을까?'를 빠르게 판단해줍니다. 마치 수백만 권의 이력서를 AI가 대신 검토해주는 것과 비슷해요.",
    glossary: [
      { term: "GNN", fullName: "Graph Neural Network", explanation: "점(노드)과 선(엣지)으로 이루어진 그래프 구조를 학습하는 AI. 분자, SNS 관계 등에 활용" },
      { term: "SMILES", fullName: "Simplified Molecular Input Line Entry System", explanation: "분자 구조를 텍스트 문자열로 표현하는 방법. 예: 물(H2O) = 'O'" },
      { term: "AUC", fullName: "Area Under the Curve", explanation: "AI 분류 모델의 성능 지표. 1에 가까울수록 완벽한 예측" },
    ],
  },
  {
    id: "bayesian-deep-learning-uncertainty",
    title: "Scalable Bayesian Deep Learning via Stochastic Variational Inference with Adaptive Priors",
    titleKo: "AI가 '모르겠다'고 말할 수 있게 만드는 베이지안 딥러닝",
    tldr: "대규모 딥러닝 모델에서도 효율적으로 불확실성을 추정할 수 있는 새로운 베이지안 추론 방법으로, 의료 진단 AI의 오진율을 62% 감소시켰습니다.",
    summary: "기존 딥러닝 모델은 틀린 답을 할 때도 높은 확신도를 보여주는 과신(overconfidence) 문제가 있습니다. 본 연구는 Adaptive Prior를 활용한 Stochastic Variational Inference를 제안하여, 수십억 파라미터 규모의 모델에서도 계산 가능한 불확실성 추정 방법을 개발했습니다. 의료 영상, 자율주행, 금융 예측 등 안전이 중요한 도메인에서 검증했습니다.",
    keyFindings: [
      "GPT 규모 모델(10B+)에서도 불확실성 추정 가능, 추가 연산 비용 15% 이내",
      "의료 영상 진단에서 '확신 없음' 표시로 오진율 62% 감소",
      "OOD(Out-of-Distribution) 데이터 탐지 AUROC 0.97 달성",
      "기존 MC Dropout 대비 캘리브레이션 오차 73% 감소",
    ],
    whyItMatters: "AI가 '확실하지 않다'고 솔직히 말할 수 있다면, 의사가 AI 진단 결과를 더 신뢰할 수 있고, 자율주행차가 안전하게 판단을 미룰 수 있습니다. 이 연구는 AI가 고위험 환경에서 안전하게 활용되기 위한 핵심 기술을 제공합니다.",
    technicalDetail: "제안된 방법은 Variational Inference(VI)를 기반으로 합니다. 각 레이어의 가중치를 점 추정 대신 가우시안 분포로 모델링하며, Adaptive Prior는 학습 과정에서 데이터에 맞게 사전 분포를 자동 조정합니다. 추론 시에는 10번의 Forward Pass로 예측 분포를 근사하며, Entropy 기반 불확실성 점수를 산출합니다. 학습은 ELBO(Evidence Lower Bound) 최적화와 Gradient Variance Reduction 기법을 결합합니다.",
    category: "stat.ML",
    arxivUrl: "https://arxiv.org/abs/2401.00007",
    publishedDate: "2025-02-14",
    authors: ["Graves, A.", "Blundell, C.", "Hernandez-Lobato, J.M."],
    difficulty: "advanced",
    beginnerSummary: "보통 AI는 항상 자신감 있게 답을 하는데, 사실 틀리는 경우도 많습니다. 이 연구는 AI가 확신이 없을 때 '잘 모르겠어요'라고 솔직하게 말할 수 있게 만들었어요. 의사가 CT 사진을 보고 AI가 '이건 확실하지 않으니 전문의에게 물어보세요'라고 알려주면 더 안전하겠죠?",
    glossary: [
      { term: "베이지안", fullName: "Bayesian", explanation: "확률을 이용해 불확실성을 수학적으로 다루는 방법론. 새로운 증거가 나올 때마다 믿음을 업데이트" },
      { term: "과신", fullName: "Overconfidence", explanation: "AI가 틀린 답을 하면서도 '99% 확실합니다'라고 잘못 판단하는 문제" },
      { term: "OOD", fullName: "Out-of-Distribution", explanation: "AI가 학습할 때 보지 못한 전혀 새로운 유형의 데이터. 예: 고양이만 학습한 AI에게 자동차 사진을 보여주는 것" },
    ],
  },
  {
    id: "humanoid-robot-locomotion",
    title: "WalkGPT: Foundation Model for Humanoid Robot Locomotion in Unstructured Environments",
    titleKo: "WalkGPT: 울퉁불퉁한 지형도 걸어다니는 휴머노이드 로봇 AI",
    tldr: "다양한 지형에서 휴머노이드 로봇의 보행을 제어하는 Foundation Model로, 시뮬레이션에서 학습한 후 실제 로봇에 제로샷 전이하여 산악 지형에서도 안정적으로 걷습니다.",
    summary: "휴머노이드 로봇의 보행 제어는 로봇공학에서 가장 어려운 과제 중 하나입니다. WalkGPT는 수천 가지 지형 환경을 시뮬레이션에서 학습한 후, 언어 명령으로 보행 패턴을 제어할 수 있는 Foundation Model입니다. Sim-to-Real 전이 기술을 통해 실제 Atlas 로봇에서 산악 트레일, 계단, 경사면 등 비정형 지형을 안정적으로 이동할 수 있음을 실증했습니다.",
    keyFindings: [
      "18가지 비정형 지형(자갈, 진흙, 계단, 경사면 등)에서 성공률 89.3% 달성",
      "자연어 명령('천천히 걸어', '뛰어')으로 보행 속도와 패턴 제어 가능",
      "Sim-to-Real 전이 성공률 91.7%로 추가 실환경 학습 불필요",
      "외부 충격(최대 50N)에 대한 균형 회복 능력 검증",
    ],
    whyItMatters: "재난 현장, 건설 현장, 가정 환경 등 사람이 접근하기 어려운 곳에서 로봇이 활동하려면 울퉁불퉁한 지형을 안정적으로 이동할 수 있어야 합니다. 이 기술은 휴머노이드 로봇의 실용화를 앞당기는 핵심 연구이며, 고령자 보조 로봇이나 배달 로봇 등 서비스 로봇 분야에도 직접 응용할 수 있습니다.",
    technicalDetail: "WalkGPT는 Transformer 기반 정책 모델로, 입력은 IMU 센서 데이터(가속도, 자이로), 관절 인코더 값, 지형 높이맵, 언어 명령 임베딩입니다. 시뮬레이션은 Isaac Gym에서 4096개 환경을 병렬 실행하며, Domain Randomization으로 마찰 계수, 지형 높이, 로봇 질량 등을 변동시킵니다. PPO(Proximal Policy Optimization) 알고리즘으로 학습하며, 보상 함수는 목표 속도 추종, 에너지 효율, 안정성(ZMP 기반)의 가중합입니다.",
    category: "cs.RO",
    arxivUrl: "https://arxiv.org/abs/2401.00008",
    publishedDate: "2025-02-13",
    authors: ["Radosavovic, I.", "Xiao, T.", "Zhang, B.", "Malik, J."],
    difficulty: "intermediate",
    beginnerSummary: "사람처럼 두 발로 걷는 로봇이 산길이나 계단 같은 울퉁불퉁한 곳도 넘어지지 않고 걸을 수 있게 만든 연구입니다. 마치 아기가 걷기를 배우듯이, 로봇도 가상 세계에서 수천 번 연습한 다음 현실에서 바로 걸을 수 있게 됩니다.",
    glossary: [
      { term: "Sim-to-Real", fullName: "Simulation to Reality Transfer", explanation: "가상 세계(시뮬레이션)에서 학습한 것을 현실 세계에 적용하는 기술" },
      { term: "IMU", fullName: "Inertial Measurement Unit", explanation: "기울기, 회전, 가속도를 측정하는 센서. 스마트폰의 자동 화면 회전에도 쓰임" },
      { term: "PPO", fullName: "Proximal Policy Optimization", explanation: "로봇이 시행착오를 통해 최적의 행동을 학습하는 강화학습 알고리즘" },
    ],
  },
  {
    id: "spiking-neural-network-efficiency",
    title: "BrainScale: Neuromorphic Computing with Spiking Neural Networks at LLM Scale",
    titleKo: "BrainScale: 뇌를 모방해 전력 소모를 95% 줄이는 뉴로모픽 AI",
    tldr: "스파이킹 신경망(SNN)을 LLM 규모로 확장하는 방법을 제시하며, 기존 Transformer 대비 에너지 소비를 95% 줄이면서 자연어 이해 성능의 87%를 유지합니다.",
    summary: "현재 AI 모델의 막대한 전력 소비는 환경적, 경제적 지속가능성 문제를 야기합니다. 본 연구는 생물학적 뉴런의 스파이크(신호 발화) 메커니즘을 모방한 스파이킹 신경망을 LLM 규모(7B 파라미터)로 확장하는 BrainScale 아키텍처를 제안합니다. 이벤트 기반(event-driven) 연산으로 불필요한 계산을 생략하여 에너지 효율을 극대화합니다.",
    keyFindings: [
      "Loihi 2 뉴로모픽 칩에서 GPT-2 수준 모델의 추론 시 전력 소모 20W (GPU 대비 95% 절감)",
      "GLUE 벤치마크에서 Transformer 기반 모델 성능의 87.4% 달성",
      "시간 정보 처리에서는 기존 모델보다 우수 (음성 인식 WER 12.3% → 9.8%)",
      "Spike-Timing-Dependent Plasticity 기반 온라인 학습으로 추가 학습 가능",
    ],
    whyItMatters: "ChatGPT 한 번 질문하는 데 일반 구글 검색의 10배 전력이 소모됩니다. AI의 전력 소비가 계속 증가하면 환경 문제가 심각해질 수 있어요. 뇌처럼 효율적으로 작동하는 뉴로모픽 AI는 이 문제의 근본적 해결책이 될 수 있으며, 배터리로 작동하는 기기에서의 AI 활용 가능성도 넓혀줍니다.",
    technicalDetail: "BrainScale은 LIF(Leaky Integrate-and-Fire) 뉴런 모델을 사용하며, 시간 단계별로 입력 스파이크를 누적하여 임계값 초과 시 출력 스파이크를 발화합니다. Surrogate Gradient 방법으로 비미분 가능한 스파이크 함수를 우회하여 역전파 학습을 가능하게 합니다. 아키텍처는 Spiking Self-Attention 메커니즘을 도입하여 Transformer의 attention을 이벤트 기반으로 재구현합니다. Intel Loihi 2와 SpiNNaker 2에서 실험했습니다.",
    category: "cs.NE",
    arxivUrl: "https://arxiv.org/abs/2401.00009",
    publishedDate: "2025-02-12",
    authors: ["Davies, M.", "Akopyan, F.", "Orchard, G.", "Neftci, E."],
    difficulty: "advanced",
    beginnerSummary: "현재 AI는 전기를 엄청나게 많이 씁니다. 그런데 사람의 뇌는 전구 하나 정도의 전력으로 훨씬 복잡한 일을 해냅니다. 이 연구는 뇌의 작동 방식을 흉내 낸 새로운 AI 칩을 만들어서, 전력 소모를 95%나 줄이면서도 AI를 돌릴 수 있게 했어요.",
    glossary: [
      { term: "SNN", fullName: "Spiking Neural Network", explanation: "뇌의 뉴런처럼 전기 신호(스파이크)로 정보를 전달하는 신경망. 에너지 효율이 매우 높음" },
      { term: "뉴로모픽", fullName: "Neuromorphic", explanation: "뇌의 구조와 작동 방식을 모방한 컴퓨터 칩이나 시스템" },
      { term: "이벤트 기반", fullName: "Event-Driven", explanation: "모든 데이터를 항상 처리하는 대신, 변화가 있을 때만 계산하는 효율적 방식" },
    ],
  },
  {
    id: "rag-hallucination-reduction",
    title: "TrustRAG: Reducing Hallucinations in Retrieval-Augmented Generation with Source Verification",
    titleKo: "TrustRAG: AI 환각을 90% 줄이는 검색 증강 생성 시스템",
    tldr: "RAG 시스템에서 출처 검증 메커니즘을 도입하여 환각(hallucination)을 90% 감소시키고, 답변의 근거를 사용자에게 투명하게 제시하는 프레임워크입니다.",
    summary: "RAG(Retrieval-Augmented Generation)는 LLM의 환각 문제를 줄이는 유망한 접근법이지만, 검색된 문서가 잘못되거나 질문과 무관한 경우 오히려 오류를 증폭시킬 수 있습니다. TrustRAG는 3단계 출처 검증 파이프라인을 통해 검색 결과의 신뢰도를 평가하고, 신뢰할 수 없는 정보는 필터링한 후, 최종 답변에 근거 문장을 인라인으로 표시합니다.",
    keyFindings: [
      "TruthfulQA 벤치마크에서 환각률 23.4% → 2.1%로 90% 감소",
      "답변 정확도는 기존 RAG 대비 15.7% 향상 (78.3% → 94.0%)",
      "출처 검증으로 인한 추가 지연시간 200ms 이내로 실용적 수준",
      "사용자 신뢰도 설문에서 출처 표시 시 신뢰도 4.2/5 → 4.8/5 향상",
    ],
    whyItMatters: "기업에서 AI 챗봇을 도입할 때 가장 큰 걱정이 '잘못된 정보를 알려주면 어쩌지?'입니다. TrustRAG는 AI가 답변할 때 '이 정보는 여기서 가져왔습니다'라고 근거를 보여주기 때문에, 사용자가 직접 확인할 수 있습니다. 법률, 의료, 금융 등 정확성이 중요한 분야에서 AI 도입을 가속화할 수 있습니다.",
    technicalDetail: "TrustRAG의 파이프라인: (1) Relevance Filter - Cross-Encoder로 질문-문서 관련성 점수를 산출하고 임계값 미만은 제거, (2) Consistency Checker - 검색된 문서들 간의 정보 일관성을 NLI(Natural Language Inference) 모델로 검증하고 모순되는 정보 표시, (3) Citation Generator - 답변 생성 시 각 문장에 대해 근거 문서의 특정 구절을 매핑하여 인라인 인용 생성. 근거가 불충분한 경우 '확인되지 않은 정보'로 표시합니다.",
    category: "cs.IR",
    arxivUrl: "https://arxiv.org/abs/2401.00010",
    publishedDate: "2025-02-11",
    authors: ["Gao, L.", "Ma, X.", "Lin, J.", "Callan, J."],
    difficulty: "beginner",
    beginnerSummary: "AI가 가끔 없는 사실을 지어내는 문제를 '환각'이라고 합니다. 이 연구는 AI가 답변할 때 '이 내용은 이 문서에서 가져왔어요'라고 출처를 밝히게 만들어서, 거짓 정보를 90%나 줄였어요. 마치 리포트를 쓸 때 참고문헌을 다는 것과 같은 원리입니다.",
    glossary: [
      { term: "RAG", fullName: "Retrieval-Augmented Generation", explanation: "AI가 답변할 때 외부 문서를 검색해서 참고하는 방법. 오픈북 시험과 비슷" },
      { term: "환각", fullName: "Hallucination", explanation: "AI가 사실이 아닌 내용을 그럴듯하게 만들어내는 현상" },
      { term: "NLI", fullName: "Natural Language Inference", explanation: "두 문장이 서로 모순되는지, 일치하는지를 판단하는 AI 기술" },
    ],
  },
  {
    id: "federated-learning-privacy",
    title: "FedSecure: Privacy-Preserving Federated Learning with Differential Privacy Guarantees",
    titleKo: "FedSecure: 개인정보를 지키면서 AI를 학습시키는 연합학습 프레임워크",
    tldr: "병원, 은행 등 데이터를 공유할 수 없는 기관들이 개인정보를 보호하면서 공동으로 AI를 학습시킬 수 있는 연합학습 프레임워크로, 중앙집중 학습의 97% 성능을 달성합니다.",
    summary: "의료 데이터, 금융 데이터 등 민감한 정보는 기관 간 공유가 법적으로 제한되어 있어 대규모 AI 학습이 어렵습니다. FedSecure는 차등 프라이버시(Differential Privacy)와 안전한 집계(Secure Aggregation)를 결합한 연합학습 프레임워크로, 각 기관의 원본 데이터를 한 곳에 모으지 않고도 공동 모델을 학습할 수 있습니다. 20개 병원의 의료 영상 데이터로 실험하여 중앙집중 학습과 거의 동등한 성능을 확인했습니다.",
    keyFindings: [
      "20개 병원 연합학습에서 중앙집중 학습 대비 97.2% 성능 달성",
      "차등 프라이버시 ε=1.0 수준에서도 성능 저하 3% 미만",
      "악의적 참여자가 30%일 때도 비잔틴 공격 방어 성공",
      "통신 비용을 기존 FedAvg 대비 80% 절감하는 압축 기법 제안",
    ],
    whyItMatters: "개인정보보호법이 강화되면서 데이터를 한곳에 모아 AI를 학습시키기 어려워지고 있습니다. 연합학습은 데이터를 공유하지 않으면서도 여러 기관이 협력하여 더 좋은 AI를 만들 수 있게 합니다. 특히 의료, 금융 분야에서 환자 프라이버시를 지키면서 정확한 진단 AI를 개발할 수 있습니다.",
    technicalDetail: "FedSecure는 FedAvg를 기반으로 하되, 세 가지 보호 메커니즘을 추가합니다: (1) Local DP - 각 클라이언트가 그래디언트에 가우시안 노이즈를 추가하여 개별 샘플 정보 유출 방지, (2) Secure Aggregation - Shamir Secret Sharing으로 서버가 개별 클라이언트의 업데이트를 볼 수 없도록 암호화, (3) Byzantine-Robust Aggregation - Krum 알고리즘으로 악의적 업데이트를 탐지하고 제거. Gradient Compression은 Top-K Sparsification과 양자화를 결합하여 통신량을 줄입니다.",
    category: "cs.LG",
    arxivUrl: "https://arxiv.org/abs/2401.00011",
    publishedDate: "2025-02-10",
    authors: ["Kairouz, P.", "McMahan, H.B.", "Bonawitz, K.", "Charles, Z."],
    difficulty: "intermediate",
    beginnerSummary: "보통 AI를 학습시키려면 데이터를 한곳에 모아야 하는데, 병원 환자 기록 같은 민감한 데이터는 공유할 수 없습니다. 이 기술은 데이터를 한 곳에 모으지 않고, 각 병원에서 AI를 조금씩 학습시킨 후 그 '학습 결과'만 모아서 합치는 방법입니다. 마치 각 학교에서 시험 문제를 풀고 정답률만 공유하는 것과 비슷해요.",
    glossary: [
      { term: "연합학습", fullName: "Federated Learning", explanation: "여러 기관이 데이터를 공유하지 않고 함께 AI를 학습시키는 방법" },
      { term: "차등 프라이버시", fullName: "Differential Privacy", explanation: "데이터에 적절한 잡음을 추가하여 개인을 식별할 수 없게 만드는 수학적 기법" },
      { term: "비잔틴 공격", fullName: "Byzantine Attack", explanation: "악의적 참여자가 잘못된 학습 결과를 보내 전체 모델을 망가뜨리는 공격" },
    ],
  },
  {
    id: "text-to-3d-generation",
    title: "DreamMesh: High-Fidelity 3D Mesh Generation from Text with Score Distillation",
    titleKo: "DreamMesh: 글만 쓰면 3D 모델이 만들어지는 AI",
    tldr: "텍스트 설명만으로 게임·영화 수준의 고품질 3D 메시를 생성하는 모델로, 기존 방법 대비 디테일이 4배 향상되고 생성 시간은 10분으로 단축됩니다.",
    summary: "텍스트에서 3D 모델을 생성하는 기술은 게임, 영화, 메타버스 등 다양한 산업에서 수요가 높지만, 기존 방법들은 흐릿하거나 디테일이 부족한 결과물을 생성하는 한계가 있었습니다. DreamMesh는 Score Distillation Sampling을 개선한 Variational Score Distillation과 멀티뷰 일관성 제약을 결합하여, 텍스처와 기하학적 디테일이 풍부한 3D 메시를 자동 생성합니다.",
    keyFindings: [
      "텍스트에서 10분 만에 게임 에셋 수준의 3D 메시 생성 (기존 60분 이상)",
      "사용자 연구에서 기존 방법 대비 디테일 품질 4.2배 선호",
      "멀티뷰 일관성 점수 0.94로 자누스 문제(앞뒤가 다른 얼굴) 해결",
      "생성된 메시를 Unity/Unreal Engine에 바로 임포트 가능한 포맷 지원",
    ],
    whyItMatters: "게임 하나에 수천 개의 3D 모델이 필요한데, 전문 아티스트가 하나를 만드는 데 며칠이 걸립니다. 이 기술로 '중세 갑옷을 입은 기사'라고 입력하면 10분 만에 3D 모델이 완성됩니다. 인디 게임 개발자나 소규모 스튜디오에게 특히 혁명적인 도구가 될 수 있습니다.",
    technicalDetail: "DreamMesh는 3단계로 작동합니다: (1) Coarse Stage - NeRF로 초기 3D 표현을 생성하고 Variational Score Distillation으로 최적화, (2) Mesh Extraction - Marching Cubes로 NeRF에서 메시 추출 후 Remeshing, (3) Refinement - 추출된 메시의 텍스처와 기하학을 미세 조정. Variational Score Distillation은 기존 SDS의 mode collapse 문제를 해결하기 위해 모드별 분산을 추정합니다. 멀티뷰 일관성은 MVDream 모델로 4개 뷰를 동시 생성하여 강제합니다.",
    category: "cs.CV",
    arxivUrl: "https://arxiv.org/abs/2401.00012",
    publishedDate: "2025-02-09",
    authors: ["Poole, B.", "Jain, A.", "Barron, J.T.", "Mildenhall, B."],
    difficulty: "intermediate",
    beginnerSummary: "게임이나 영화에서 보는 3D 캐릭터나 물건을 만들려면 전문가가 며칠 동안 작업해야 합니다. 이 AI는 '빨간 용'이라고 글만 쓰면 10분 만에 3D 모델을 만들어줍니다. 마치 글로 주문하면 3D 프린터가 바로 찍어주는 것과 비슷해요.",
    glossary: [
      { term: "메시", fullName: "3D Mesh", explanation: "삼각형 조각들이 모여 만들어진 3D 모델의 표면 구조. 게임 캐릭터의 뼈대와 같음" },
      { term: "NeRF", fullName: "Neural Radiance Field", explanation: "여러 각도의 사진에서 3D 장면을 복원하는 AI 기술" },
      { term: "텍스처", fullName: "Texture", explanation: "3D 모델 표면에 입히는 색상과 질감. 민무늬 마네킹에 옷을 입히는 것과 비슷" },
    ],
  },
  {
    id: "multilingual-llm-low-resource",
    title: "PolyGlot-7B: Efficient Multilingual LLM for 100+ Low-Resource Languages",
    titleKo: "PolyGlot-7B: 소외된 100개 언어를 이해하는 다국어 AI",
    tldr: "데이터가 부족한 100개 이상의 저자원 언어에서도 높은 성능을 보이는 7B 규모의 다국어 모델로, 스와힐리어·요루바어 등에서 GPT-4의 85% 성능을 7B 모델로 달성합니다.",
    summary: "현재 대부분의 LLM은 영어 중심으로 학습되어, 아프리카·동남아 등 저자원 언어에서 성능이 크게 떨어집니다. PolyGlot-7B는 Cross-Lingual Transfer Learning과 Adaptive Tokenization을 결합하여, 100개 이상의 저자원 언어에서 효율적으로 작동하는 다국어 모델입니다. 특히 데이터가 10만 문장 미만인 극저자원 언어에서도 의미 있는 성능을 보입니다.",
    keyFindings: [
      "106개 언어에서 평균 BLEU 점수 28.7로 기존 다국어 모델(mT5) 대비 34% 향상",
      "저자원 언어(스와힐리어, 요루바어 등)에서 GPT-4 성능의 85.1% 달성 (7B 모델로)",
      "Adaptive Tokenizer로 저자원 언어의 토큰화 효율 3.2배 향상 (더 적은 토큰으로 표현)",
      "Cross-Lingual Transfer로 데이터 없는 새 언어에도 zero-shot 생성 가능",
    ],
    whyItMatters: "전 세계 7,000개 이상의 언어 중 AI가 제대로 지원하는 것은 수십 개에 불과합니다. 이 연구는 디지털 소외를 해소하고, 모든 언어 사용자가 AI의 혜택을 받을 수 있게 하는 중요한 진전입니다. 특히 UN, NGO 등 국제기구의 다국어 번역이나 저자원 언어 교육 자료 생성에 활용될 수 있습니다.",
    technicalDetail: "PolyGlot-7B는 LLaMA 아키텍처를 기반으로 합니다. Adaptive Tokenizer는 Byte-Pair Encoding을 언어별로 별도 학습한 후 공유 어휘와 결합하는 방식으로, 저자원 언어의 음절 구조를 효율적으로 포착합니다. Cross-Lingual Transfer는 고자원 언어(영어, 중국어 등)에서 학습한 지식을 언어 간 정렬된 임베딩 공간을 통해 저자원 언어로 전이합니다. 학습 데이터는 ROOTS 데이터셋과 NLLB 병렬 코퍼스를 결합하여 사용했습니다.",
    category: "cs.CL",
    arxivUrl: "https://arxiv.org/abs/2401.00013",
    publishedDate: "2025-02-22",
    authors: ["Ustun, A.", "Arivazhagan, N.", "Costa-jussa, M.R."],
    difficulty: "beginner",
    beginnerSummary: "ChatGPT 같은 AI는 영어는 잘 하지만, 아프리카나 동남아시아의 많은 언어는 거의 이해하지 못합니다. 이 연구는 데이터가 부족한 100개 이상의 '소외된 언어'도 이해하는 AI를 만들었어요. 마치 100개 국어를 할 줄 아는 통역사를 만든 것과 같습니다.",
    glossary: [
      { term: "저자원 언어", fullName: "Low-Resource Language", explanation: "AI를 학습시킬 수 있는 디지털 데이터가 매우 적은 언어. 전 세계 대부분의 언어가 해당" },
      { term: "BLEU", fullName: "Bilingual Evaluation Understudy", explanation: "기계 번역의 품질을 측정하는 점수. 높을수록 사람의 번역과 비슷" },
      { term: "토큰화", fullName: "Tokenization", explanation: "문장을 AI가 처리할 수 있는 작은 조각(토큰)으로 나누는 과정" },
    ],
  },
  {
    id: "ai-code-generation-benchmark",
    title: "CodeArena: A Comprehensive Benchmark for Evaluating LLM Code Generation in Real-World Settings",
    titleKo: "CodeArena: AI 코딩 능력을 실전 환경에서 제대로 평가하는 벤치마크",
    tldr: "기존 코딩 벤치마크의 한계를 극복하는 실전형 코드 생성 평가 시스템으로, 대규모 코드베이스 이해, 디버깅, 리팩토링 능력까지 종합 평가합니다.",
    summary: "HumanEval, MBPP 등 기존 코딩 벤치마크는 짧은 알고리즘 문제 위주라 실제 소프트웨어 개발 능력을 제대로 평가하지 못합니다. CodeArena는 실제 오픈소스 프로젝트에서 추출한 1,200개의 실전 과제를 포함하며, 새 기능 구현, 버그 수정, 코드 리뷰, 리팩토링, 테스트 작성의 5가지 영역을 종합 평가합니다. 10개 주요 LLM을 비교 분석한 결과, 실전 성능과 기존 벤치마크 순위 간 상당한 괴리가 확인되었습니다.",
    keyFindings: [
      "기존 벤치마크 1위 모델이 실전 과제에서는 4위로 하락하는 등 순위 괴리 확인",
      "대규모 코드베이스(10K+ 줄) 이해가 필요한 과제에서 모든 모델의 성능이 40% 이상 하락",
      "버그 수정 능력은 코드 생성 능력과 상관관계가 낮음 (r=0.31)",
      "Claude 3.5 Sonnet이 실전 종합 점수에서 1위, GPT-4o가 알고리즘에서 1위",
    ],
    whyItMatters: "기업이 AI 코딩 도구를 도입할 때 '실제로 얼마나 도움이 되는가?'를 판단할 객관적 기준이 필요합니다. CodeArena는 실제 개발 환경에 가까운 평가를 제공하여, 기업의 도구 선택과 AI 모델의 실전 능력 향상에 기여합니다.",
    technicalDetail: "CodeArena는 GitHub의 인기 오픈소스 프로젝트(Python, TypeScript, Rust, Go)에서 과제를 추출합니다. 각 과제는 실제 PR/이슈에서 유래하며, 전체 레포지토리 컨텍스트와 함께 제공됩니다. 평가는 단위 테스트 통과율, 코드 품질(linting), 성능 벤치마크, 인간 평가의 4축으로 구성됩니다. 오염(contamination) 방지를 위해 2025년 1월 이후 생성된 이슈만 사용하며, 정기적으로 과제를 갱신합니다.",
    category: "cs.AI",
    arxivUrl: "https://arxiv.org/abs/2401.00014",
    publishedDate: "2025-02-24",
    authors: ["Jimenez, C.E.", "Yang, J.", "Wettig, A.", "Press, O."],
    difficulty: "beginner",
    beginnerSummary: "AI가 코딩을 얼마나 잘하는지 평가하는 기존 시험들은 너무 쉬운 문제만 냅니다. 이 연구는 실제 회사에서 하는 것처럼 큰 프로젝트에서 버그를 고치거나 새 기능을 만드는 '진짜 실력'을 측정하는 시험을 만들었어요. 결과적으로, 기존 시험 1등인 AI가 실전에서는 4등으로 밀리는 등 흥미로운 결과가 나왔습니다.",
    glossary: [
      { term: "벤치마크", fullName: "Benchmark", explanation: "AI의 능력을 객관적으로 측정하고 비교하는 표준 시험" },
      { term: "리팩토링", fullName: "Refactoring", explanation: "프로그램의 동작은 그대로 두고 코드의 구조를 깔끔하게 정리하는 작업" },
      { term: "코드베이스", fullName: "Codebase", explanation: "하나의 프로젝트를 구성하는 전체 소스 코드 모음" },
    ],
  },
  {
    id: "recommendation-system-fairness",
    title: "FairRec: Debiasing Recommendation Systems with Counterfactual Reasoning",
    titleKo: "FairRec: 편견 없는 추천 시스템을 만드는 반사실적 추론 기법",
    tldr: "추천 시스템의 인기 편향, 성별 편향 등을 반사실적 추론으로 제거하면서도 추천 정확도를 유지하는 프레임워크로, 다양성 지표를 52% 향상시켰습니다.",
    summary: "현재 추천 시스템은 인기 있는 콘텐츠를 더 많이 추천하는 인기 편향, 성별·나이에 따른 고정관념적 추천 등 다양한 편향 문제를 가지고 있습니다. FairRec은 '만약 이 사용자의 성별이 달랐다면 같은 추천을 했을까?'라는 반사실적(counterfactual) 질문을 통해 편향을 탐지하고 제거합니다. Netflix, Spotify 규모의 데이터셋에서 공정성과 정확도를 동시에 개선할 수 있음을 입증했습니다.",
    keyFindings: [
      "인기 편향 80% 감소하면서 추천 정확도(NDCG) 2.1%만 하락",
      "성별 기반 추천 공정성 지표 52% 향상 (EO 차이 0.23 → 0.11)",
      "콘텐츠 다양성 지표(Coverage) 38% 향상으로 롱테일 콘텐츠 노출 증가",
      "반사실적 데이터 증강으로 소수 그룹 사용자의 만족도 17% 향상",
    ],
    whyItMatters: "유튜브가 항상 비슷한 영상만 추천하거나, 쇼핑몰이 특정 성별에 고정관념적 상품만 보여주는 것은 편향된 추천의 결과입니다. 공정한 추천 시스템은 사용자에게 더 다양한 콘텐츠를 보여주고, 소규모 크리에이터나 판매자에게도 공평한 노출 기회를 제공합니다.",
    technicalDetail: "FairRec은 인과 추론 프레임워크를 기반으로 합니다. 구조적 인과 모델(SCM)로 사용자-아이템 상호작용을 모델링하고, 민감 속성(성별, 나이 등)에 대한 반사실적 세계를 생성합니다. Counterfactual Fairness 제약을 추천 모델의 학습 목적함수에 정규화 항으로 추가하여, 실제 세계와 반사실 세계에서의 추천 결과 차이를 최소화합니다. 인기 편향 제거는 Inverse Propensity Scoring과 Causal Debiasing을 결합합니다.",
    category: "cs.IR",
    arxivUrl: "https://arxiv.org/abs/2401.00015",
    publishedDate: "2025-02-08",
    authors: ["Chen, J.", "Dong, H.", "Wang, X.", "He, X."],
    difficulty: "intermediate",
    beginnerSummary: "유튜브나 넷플릭스의 추천 알고리즘이 항상 인기 있는 것만 추천하고, 성별에 따라 다른 것을 보여주는 건 '편향' 때문입니다. 이 연구는 '만약 이 사용자가 남자 대신 여자였다면 다른 걸 추천했을까?'라는 질문으로 편견을 찾아내고 고치는 방법을 개발했어요.",
    glossary: [
      { term: "반사실적", fullName: "Counterfactual", explanation: "'만약 ~였다면?'이라는 가정을 통해 원인과 결과를 분석하는 방법" },
      { term: "편향", fullName: "Bias", explanation: "AI가 특정 그룹이나 콘텐츠를 불공정하게 선호하거나 차별하는 경향" },
      { term: "롱테일", fullName: "Long Tail", explanation: "인기 없지만 다양한 소수의 콘텐츠들. 전체의 80%를 차지하지만 노출은 적음" },
    ],
  },
];

// AI 용어 사전 (정적 데이터)
export const glossaryEntries: GlossaryEntry[] = [
  { term: "LLM", fullName: "Large Language Model", nameKo: "대규모 언어 모델", category: "모델/아키텍처", shortDesc: "ChatGPT, Claude처럼 사람의 말을 이해하고 생성하는 대규모 AI", analogy: "수백만 권의 책을 읽고 사람처럼 대화할 수 있게 된 AI. 마치 모든 과목을 공부한 만능 학생 같은 존재" },
  { term: "CoT", fullName: "Chain-of-Thought", nameKo: "사고 연쇄", category: "학습 방법", shortDesc: "AI가 문제를 풀 때 풀이 과정을 단계별로 적는 방법", analogy: "수학 시험에서 답만 적지 않고 풀이 과정을 쓰면 정답률이 올라가는 것처럼, AI도 '생각의 과정'을 보여주면 더 정확한 답을 냄" },
  { term: "RLHF", fullName: "Reinforcement Learning from Human Feedback", nameKo: "인간 피드백 강화학습", category: "학습 방법", shortDesc: "사람의 평가로 AI를 훈련시키는 방법", analogy: "아이에게 '이건 좋아, 이건 안 돼'라고 반복해서 알려주면 점점 올바른 행동을 배우는 것과 같음" },
  { term: "Transformer", fullName: "Transformer Architecture", nameKo: "트랜스포머", category: "모델/아키텍처", shortDesc: "현재 가장 널리 쓰이는 AI 모델 구조", analogy: "문장에서 어떤 단어가 어떤 단어와 관련 있는지 한눈에 파악하는 똑똑한 독해 방법. 책 전체를 동시에 읽을 수 있는 능력" },
  { term: "Attention", fullName: "Attention Mechanism", nameKo: "어텐션 메커니즘", category: "기본 개념", shortDesc: "AI가 중요한 부분에 집중하는 기술", analogy: "시끄러운 카페에서 옆 사람의 말에만 집중하는 것처럼, AI도 중요한 정보에 주목하고 나머지는 무시하는 방법" },
  { term: "Fine-tuning", fullName: "Fine-tuning", nameKo: "미세 조정", category: "학습 방법", shortDesc: "이미 학습된 AI를 특정 목적에 맞게 추가 학습시키는 것", analogy: "의대를 졸업한 의사가 피부과 전문의 수련을 받는 것처럼, 범용 AI를 특정 분야 전문가로 만드는 과정" },
  { term: "Prompt", fullName: "Prompt", nameKo: "프롬프트", category: "기본 개념", shortDesc: "AI에게 내리는 지시문이나 질문", analogy: "식당에서 주문하는 것과 같음. '매운 파스타 추천해줘'처럼 AI에게 원하는 것을 말로 전달하는 것" },
  { term: "Diffusion", fullName: "Diffusion Model", nameKo: "확산 모델", category: "모델/아키텍처", shortDesc: "노이즈에서 이미지를 생성하는 AI 기술", analogy: "TV 화면의 지지직거리는 잡음에서 시작해, 점점 깨끗한 그림이 나타나는 마법 같은 과정" },
  { term: "ViT", fullName: "Vision Transformer", nameKo: "비전 트랜스포머", category: "모델/아키텍처", shortDesc: "이미지를 이해하는 Transformer 기반 모델", analogy: "사진을 퍼즐 조각처럼 작게 나눈 뒤, 각 조각 사이의 관계를 파악해서 전체 그림을 이해하는 방식" },
  { term: "NLP", fullName: "Natural Language Processing", nameKo: "자연어 처리", category: "기본 개념", shortDesc: "AI가 사람의 말과 글을 이해하고 생성하는 기술", analogy: "외국어를 모국어처럼 이해하는 통역사. AI가 한국어, 영어 등 사람의 언어를 처리하는 모든 기술" },
  { term: "GPU", fullName: "Graphics Processing Unit", nameKo: "그래픽 처리 장치", category: "기본 개념", shortDesc: "AI 학습에 사용되는 고성능 연산 장치", analogy: "원래 게임 그래픽을 위해 만들었지만, 수천 개의 계산을 동시에 할 수 있어서 AI 학습의 엔진 역할을 함" },
  { term: "CNN", fullName: "Convolutional Neural Network", nameKo: "합성곱 신경망", category: "모델/아키텍처", shortDesc: "이미지 인식에 특화된 전통적인 신경망", analogy: "돋보기로 사진의 작은 영역을 하나씩 살펴보며 패턴을 찾는 방식. 테두리, 모양, 질감 등을 단계적으로 인식" },
  { term: "GAN", fullName: "Generative Adversarial Network", nameKo: "생성적 적대 신경망", category: "모델/아키텍처", shortDesc: "가짜 이미지를 만드는 AI와 판별하는 AI가 경쟁하며 학습", analogy: "위조지폐를 만드는 사람과 감별사가 경쟁하면서 둘 다 실력이 늘어나는 것과 같은 원리" },
  { term: "Embedding", fullName: "Embedding", nameKo: "임베딩", category: "기본 개념", shortDesc: "단어나 문장을 숫자 벡터로 변환하는 것", analogy: "단어를 지도 위의 좌표로 바꾸는 것. 비슷한 의미의 단어는 가까운 위치에 놓여서 AI가 의미 관계를 이해" },
  { term: "Hallucination", fullName: "Hallucination", nameKo: "환각", category: "기본 개념", shortDesc: "AI가 사실이 아닌 내용을 그럴듯하게 만들어내는 현상", analogy: "시험에서 모르는 문제를 자신감 있게 틀리게 답하는 학생처럼, AI도 가끔 없는 사실을 만들어냄" },
  { term: "Token", fullName: "Token", nameKo: "토큰", category: "기본 개념", shortDesc: "AI가 텍스트를 처리하는 최소 단위", analogy: "문장을 단어나 음절로 쪼개는 것. '인공지능'을 '인공'+'지능'으로 나누듯이 AI가 글을 이해하기 위해 잘게 나누는 조각" },
  { term: "Zero-shot", fullName: "Zero-shot Learning", nameKo: "제로샷 학습", category: "학습 방법", shortDesc: "예시 없이 바로 새로운 작업을 수행하는 능력", analogy: "한 번도 본 적 없는 동물 사진을 보고도 특징을 설명할 수 있는 것처럼, 학습하지 않은 작업도 해내는 AI 능력" },
  { term: "Few-shot", fullName: "Few-shot Learning", nameKo: "퓨샷 학습", category: "학습 방법", shortDesc: "몇 가지 예시만으로 새로운 작업을 수행하는 능력", analogy: "2~3개의 예제만 보고도 패턴을 파악하는 것. '사과→과일, 당근→채소'를 보고 '바나나→?'에 '과일'이라고 답하는 능력" },
  { term: "Benchmark", fullName: "Benchmark", nameKo: "벤치마크", category: "평가 지표", shortDesc: "AI 성능을 객관적으로 측정하는 표준 테스트", analogy: "수능시험처럼 모든 AI 모델이 같은 문제를 풀어서 성적을 비교하는 시험" },
  { term: "AGI", fullName: "Artificial General Intelligence", nameKo: "범용 인공지능", category: "기본 개념", shortDesc: "사람처럼 모든 종류의 지적 작업을 수행할 수 있는 AI", analogy: "현재 AI가 한 가지 일만 잘하는 '전문가'라면, AGI는 뭐든지 잘하는 '만능인'. 아직 실현되지 않은 궁극적 목표" },
  { term: "RAG", fullName: "Retrieval-Augmented Generation", nameKo: "검색 증강 생성", category: "학습 방법", shortDesc: "외부 문서를 검색해서 답변에 활용하는 AI 기법", analogy: "시험 볼 때 교과서를 참고할 수 있는 오픈북 시험. AI가 자기 기억만 믿지 않고 최신 자료를 찾아보고 답변" },
  { term: "Parameter", fullName: "Parameter", nameKo: "파라미터", category: "기본 개념", shortDesc: "AI 모델이 학습한 지식을 저장하는 숫자 값", analogy: "뇌의 시냅스 연결 강도와 비슷. 수십억~수조 개의 숫자가 AI의 '지식'을 구성함. 많을수록 더 복잡한 패턴 학습 가능" },
  { term: "Inference", fullName: "Inference", nameKo: "추론", category: "기본 개념", shortDesc: "학습된 AI가 새로운 입력에 대해 답을 내는 과정", analogy: "시험 공부(학습)를 마치고 실제 시험(추론)을 보는 것. ChatGPT에 질문하면 답을 생성하는 과정이 추론" },
  { term: "Overfitting", fullName: "Overfitting", nameKo: "과적합", category: "평가 지표", shortDesc: "학습 데이터에 너무 맞춰져서 새로운 데이터에 약해지는 현상", analogy: "기출문제만 달달 외워서 같은 문제는 100점이지만 새 문제는 못 푸는 학생과 같은 상태" },
  { term: "DPO", fullName: "Direct Preference Optimization", nameKo: "직접 선호도 최적화", category: "학습 방법", shortDesc: "RLHF를 더 단순하게 구현한 학습 방법", analogy: "RLHF가 복잡한 채점 과정이라면, DPO는 'A와 B 중 뭐가 나아?'라는 간단한 비교만으로 AI를 학습시키는 효율적인 방법" },
];

const PAPER_SELECT = "*, paper_explanations(tldr, summary, key_findings, why_it_matters, technical_detail, difficulty, beginner_summary, glossary)";

export async function getAllPapers(): Promise<PaperExplanation[]> {
  const db = getSupabase();
  if (db) {
    try {
      const { data, error } = await db
        .from("papers")
        .select(PAPER_SELECT)
        .order("score", { ascending: false })
        .limit(30);
      if (!error && data && data.length > 0) return (data as PaperRow[]).map(mapPaperRow);
    } catch { /* fall through */ }
  }
  return papers;
}

export async function getPaperById(id: string): Promise<PaperExplanation | undefined> {
  const db = getSupabase();
  if (db) {
    try {
      const { data, error } = await db
        .from("papers")
        .select(PAPER_SELECT)
        .eq("arxiv_id", id)
        .single();
      if (!error && data) return mapPaperRow(data as PaperRow);
    } catch { /* fall through */ }
  }
  return papers.find((p) => p.id === id);
}

export function getAllPaperIds(): string[] {
  return papers.map((p) => p.id);
}

export function getArxivCategories(): ArxivCategory[] {
  return arxivCategories;
}

export function getArxivCategoryBySlug(slug: string): ArxivCategory | undefined {
  return arxivCategories.find((c) => c.slug === slug);
}
