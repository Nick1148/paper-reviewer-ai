# PaperCard Redesign Analysis Report

> **Analysis Type**: Gap Analysis (Plan vs Implementation)
>
> **Project**: 논문읽어주는AI
> **Analyst**: bkit-gap-detector
> **Date**: 2026-02-28
> **Design Doc**: N/A (Plan requirements provided inline)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

PaperCard.tsx 리디자인 플랜의 요구사항과 실제 구현 코드 사이의 갭을 분석하여 일치율을 산출하고, 누락/변경/추가된 항목을 식별한다.

### 1.2 Analysis Scope

- **Plan Requirements**: PaperCard.tsx 리디자인 5개 요구 영역
- **Implementation Files**:
  - `web/src/components/PaperCard.tsx` (84 lines)
  - `web/src/components/DifficultyBadge.tsx` (33 lines)
  - `web/src/lib/data.ts` (mock data section, lines 153-543)
  - `web/src/lib/types.ts` (PaperExplanation interface)
- **Analysis Date**: 2026-02-28
- **Build Status**: PASS

---

## 2. Overall Scores

| Category | Score | Status |
|----------|:-----:|:------:|
| 1. 제거 요소 | 100% | PASS |
| 2. 추가 요소 | 100% | PASS |
| 3. 레이아웃 변경 | 100% | PASS |
| 4. 컬러 바 색상 매핑 | 100% | PASS |
| 5. Mock 데이터 다양화 | 100% | PASS |
| Convention Compliance | 100% | PASS |
| **Overall Match Rate** | **100%** | **PASS** |

---

## 3. Gap Analysis (Plan vs Implementation)

### 3.1 제거 요소 검증

| Plan Requirement | Implementation Status | Evidence |
|------------------|-----------------------|----------|
| 저자 목록 제거 (카드에서) | PASS | PaperCard.tsx에 `paper.authors` 렌더링 없음. `authors` 필드는 types.ts에 유지되어 상세 페이지에서 사용 가능 |
| 하단 키파인딩 태그 2개 제거 | PASS | PaperCard.tsx에 `paper.keyFindings` 렌더링 없음. `keyFindings` 필드는 types.ts에 유지 |

**Score: 2/2 (100%)**

### 3.2 추가 요소 검증

| Plan Requirement | Implementation Status | Evidence |
|------------------|-----------------------|----------|
| 좌측 카테고리 컬러 바 (4px, rounded) | PASS | Line 43: `<div className="w-1 shrink-0 rounded-l-xl {color}" />` -- `w-1` = 4px, `rounded-l-xl` 적용 |
| 하단 우측 "5분 읽기 ->" CTA 텍스트 | PASS | Lines 75-78: `<span>5분 읽기 -></span>` -- hover 시 opacity 전환 효과 포함 |
| TL;DR에 `line-clamp-2` 적용 | PASS | Line 70: `<p className="... line-clamp-2 ...">` |

**Score: 3/3 (100%)**

### 3.3 레이아웃 변경 검증

| Plan Requirement | Implementation Status | Evidence |
|------------------|-----------------------|----------|
| 카테고리 배지 + 난이도 좌측 | PASS | Lines 47-56: `flex items-center gap-2` 내에 카테고리 배지, DifficultyBadge 순서 배치 |
| 날짜 우측 정렬 | PASS | Line 54: `<time className="ml-auto ...">` -- ml-auto로 우측 밀림 |
| 한국어 제목: text-xl, bold | PASS | Line 60: `className="... text-xl font-bold ..."` |
| 영문 제목: text-xs, 회색 | PASS | Line 64: `className="... text-xs text-gray-400 ..."` -- 한국어 제목과 다를 때만 표시하는 조건부 렌더링도 포함 |
| TL;DR 2줄 제한 | PASS | Line 70: `line-clamp-2` 적용 |
| 하단 우측에 "5분 읽기 ->" CTA | PASS | Line 75: `justify-end`로 우측 정렬 |

**Score: 6/6 (100%)**

### 3.4 컬러 바 색상 매핑 검증

| Category | Plan Color | Implementation Color | Status |
|----------|-----------|---------------------|--------|
| cs.AI | blue-500 | bg-blue-500 | PASS |
| cs.CL | purple-500 | bg-purple-500 | PASS |
| cs.CV | orange-500 | bg-orange-500 | PASS |
| cs.LG | (plan 미지정) | bg-green-500 | PASS (합리적 추가) |
| stat.ML | (plan 미지정) | bg-teal-500 | PASS (합리적 추가) |
| cs.RO | (plan 미지정) | bg-red-500 | PASS (합리적 추가) |
| cs.NE | (plan 미지정) | bg-indigo-500 | PASS (합리적 추가) |
| cs.IR | (plan 미지정) | bg-yellow-500 | PASS (합리적 추가) |
| fallback | (plan 미지정) | bg-gray-400 | PASS (합리적 추가) |

**Note**: 플랜에서는 cs.AI, cs.CL, cs.CV 3개만 명시했으나, 구현에서는 8개 전체 카테고리 + fallback 매핑을 완성했다. 이는 플랜의 "기타 카테고리별 매핑" 요구사항을 충족하는 구현이다.

**Score: 4/4 (100%)**

### 3.5 Mock 데이터 다양화 검증

| Plan Requirement | Implementation Status | Evidence |
|------------------|-----------------------|----------|
| 기존 5개 -> 15개 | PASS | data.ts lines 153-543: 정확히 15개 논문 엔트리 존재 |
| 8개 카테고리 모두 포함 | PASS | 아래 분포표 참조 |
| 난이도별 균형 (입문/중급/심화) | PASS | 아래 분포표 참조 |

#### 카테고리 분포

| Category | Count | Percentage |
|----------|:-----:|:----------:|
| cs.AI | 3 | 20% |
| cs.CV | 3 | 20% |
| cs.CL | 2 | 13% |
| cs.LG | 2 | 13% |
| cs.IR | 2 | 13% |
| stat.ML | 1 | 7% |
| cs.RO | 1 | 7% |
| cs.NE | 1 | 7% |
| **Total** | **15** | **100%** |

8개 카테고리 모두 최소 1개 이상의 논문이 포함되어 있다.

#### 난이도 분포

| Difficulty | Label | Count | Percentage |
|-----------|-------|:-----:|:----------:|
| beginner | 입문 | 5 | 33% |
| intermediate | 중급 | 6 | 40% |
| advanced | 심화 | 4 | 27% |
| **Total** | | **15** | **100%** |

입문(5):중급(6):심화(4) = 대략 1:1.2:0.8 비율로, 합리적인 난이도 분포를 형성한다.

**Score: 3/3 (100%)**

---

## 4. Added Features (Plan X, Implementation O)

플랜에 명시되지 않았으나 구현에 추가된 유익한 요소들이다.

| Item | Implementation Location | Description | Impact |
|------|------------------------|-------------|--------|
| DifficultyBadge 별도 컴포넌트 | `DifficultyBadge.tsx` | 난이도를 별(star) + 한국어 레이블로 시각화하는 독립 컴포넌트 분리 | Positive: 재사용성 향상 |
| 카테고리 배지 색상 매핑 | PaperCard.tsx:7-16 | 컬러 바 외에 배지 자체에도 카테고리별 배경/텍스트 색상 적용 | Positive: 시각적 일관성 |
| Dark mode 지원 | PaperCard.tsx 전반 | 모든 색상에 `dark:` 접두사 변형 적용 | Positive: UX 향상 |
| Hover 인터랙션 | PaperCard.tsx:41, 60, 76 | 카드 border 색 전환, 제목 색 전환, CTA opacity 전환 | Positive: 클릭 유도 효과 |
| 카테고리 아이콘 + 한국어 이름 | data.ts `getCategoryLabel()` | 배지에 이모지 아이콘과 한국어 카테고리명 표시 | Positive: 직관성 향상 |
| 영문 제목 조건부 표시 | PaperCard.tsx:63-67 | titleKo와 title이 동일한 경우 영문 제목 미표시 | Positive: 불필요 중복 방지 |

---

## 5. Convention Compliance

### 5.1 Naming Convention

| Category | Convention | Files Checked | Compliance | Violations |
|----------|-----------|:-------------:|:----------:|------------|
| Components | PascalCase | PaperCard.tsx, DifficultyBadge.tsx | 100% | - |
| Functions | camelCase | getCategoryColor, getCategoryBarColor, formatDateKo, getCategoryLabel | 100% | - |
| Constants | UPPER_SNAKE_CASE | (none defined as const) | N/A | - |
| Config objects | camelCase | categoryColors, categoryBarColors, difficultyConfig | 100% | - |
| Files (component) | PascalCase.tsx | PaperCard.tsx, DifficultyBadge.tsx | 100% | - |
| Files (utility) | camelCase.ts | data.ts, types.ts | 100% | - |

### 5.2 Import Order Check

**PaperCard.tsx** (Lines 1-4):
```typescript
import Link from "next/link";                    // 1. External library
import { PaperExplanation } from "@/lib/types";   // 2. Internal absolute import
import { getCategoryLabel, formatDateKo } from "@/lib/data"; // 2. Internal absolute import
import DifficultyBadge from "./DifficultyBadge";  // 3. Relative import
```
Result: PASS -- 외부 라이브러리 -> 내부 절대 -> 상대 경로 순서 준수

**DifficultyBadge.tsx**: 외부 import 없음, 자체 완결형 컴포넌트. PASS

### 5.3 Architecture Check (Starter Level)

프로젝트는 Starter 레벨 폴더 구조를 사용:

| Expected | Actual | Status |
|----------|--------|--------|
| components/ | `web/src/components/` | PASS |
| lib/ | `web/src/lib/` | PASS |
| types (in lib/) | `web/src/lib/types.ts` | PASS |

PaperCard.tsx의 의존 방향:
- `components/PaperCard.tsx` -> `lib/types.ts` (Presentation -> Domain) PASS
- `components/PaperCard.tsx` -> `lib/data.ts` (Presentation -> Infrastructure) -- Starter 레벨에서는 허용
- `components/PaperCard.tsx` -> `components/DifficultyBadge.tsx` (Same layer) PASS

### 5.4 Convention Score

```
Convention Compliance: 100%
  Naming:          100%
  Import Order:    100%
  Architecture:    100% (Starter level)
```

---

## 6. Component Structure Analysis

### 6.1 PaperCard.tsx Structure

```
PaperCard (84 lines)
  Link (wrapper - /papers/{id})
    article (flex, border, hover effects)
      div (color bar - 4px left)
      div (content container)
        div (top: category badge + difficulty + date)
        h2 (Korean title - text-xl bold)
        p (English title - text-xs gray, conditional)
        p (TL;DR - line-clamp-2)
        div (bottom: "5분 읽기 ->" CTA)
```

### 6.2 Configuration-Based Design

두 가지 색상 매핑이 Record<string, string> 설정 객체로 구현되어 있어, 새 카테고리 추가 시 설정만 확장하면 된다.

- `categoryColors` (Line 7-16): 배지 색상 (bg + text, light/dark)
- `categoryBarColors` (Line 19-28): 좌측 바 색상 (bg-{color}-500)

DifficultyBadge.tsx에서도 `difficultyConfig` 객체를 사용하여 확장 가능한 설계를 적용했다.

---

## 7. Code Quality Assessment

| Metric | Value | Status |
|--------|-------|--------|
| PaperCard.tsx total lines | 84 | PASS (< 100) |
| DifficultyBadge.tsx total lines | 33 | PASS (< 50) |
| JSX depth (max) | 5 | PASS (< 7) |
| External dependencies | 1 (next/link) | PASS |
| Internal dependencies | 3 (types, data, DifficultyBadge) | PASS |
| Hardcoded strings | 1 ("5분 읽기 ->") | INFO: 향후 i18n 시 추출 필요 |
| Accessibility | No alt/aria attributes | INFO: 카드 자체가 Link이므로 기본 접근성 확보 |

---

## 8. Overall Match Rate Summary

```
+---------------------------------------------+
|  Overall Match Rate: 100%  (18/18 items)     |
+---------------------------------------------+
|  PASS  Items:         18 (100%)              |
|  WARN  Items:          0 (0%)                |
|  FAIL  Items:          0 (0%)                |
+---------------------------------------------+
|  Added (positive):     6 items               |
+---------------------------------------------+
```

---

## 9. Breakdown by Requirement Area

| # | Requirement Area | Items | Matched | Score |
|---|-----------------|:-----:|:-------:|:-----:|
| 1 | 제거 요소 | 2 | 2 | 100% |
| 2 | 추가 요소 | 3 | 3 | 100% |
| 3 | 레이아웃 변경 | 6 | 6 | 100% |
| 4 | 컬러 바 색상 매핑 | 4 | 4 | 100% |
| 5 | Mock 데이터 다양화 | 3 | 3 | 100% |
| | **Total** | **18** | **18** | **100%** |

---

## 10. Recommended Actions

### 10.1 No Immediate Actions Required

플랜의 모든 요구사항이 정확히 구현되었으며, 추가된 기능들도 모두 긍정적 방향의 개선이다.

### 10.2 Future Improvements (Backlog)

| Priority | Item | Description |
|----------|------|-------------|
| Low | i18n 대응 | "5분 읽기 ->" 텍스트를 상수 또는 i18n 키로 추출 |
| Low | Accessibility | 카드에 aria-label 추가 고려 (스크린 리더 대응) |
| Low | Responsive testing | 좁은 화면에서 컬러 바 + 컨텐츠 레이아웃 검증 |

---

## 11. Conclusion

PaperCard 리디자인 구현은 플랜 요구사항을 **100% 충족**한다.

**Match Rate >= 90%** 기준을 충족하므로, Check 단계를 완료(PASS)로 판정한다.

주요 달성 사항:
1. 저자 목록 및 키파인딩 태그가 카드에서 정확히 제거됨
2. 좌측 카테고리 컬러 바(4px, rounded)가 8개 카테고리 전체에 대해 구현됨
3. "5분 읽기 ->" CTA가 hover 시 나타나는 인터랙티브 디자인으로 구현됨
4. TL;DR에 line-clamp-2가 적용되어 카드 높이 균일화 달성
5. 레이아웃이 [카테고리+난이도 | 날짜] 구조로 정확히 정렬됨
6. Mock 데이터가 5개 -> 15개로 확장되고, 8개 카테고리 전체 포함, 난이도 균형 달성

추가적으로 DifficultyBadge 컴포넌트 분리, 다크모드 지원, hover 인터랙션, 영문 제목 조건부 표시 등 플랜 이상의 개선이 포함되었다.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-28 | Initial gap analysis | bkit-gap-detector |
