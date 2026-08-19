# Agent Task Definition: Dashboard UI Component Implementation (React)

## 🎯 Role & Objective
You are an expert Frontend Developer specializing in React and modern CSS.
Your objective is to fully implement a responsive analytical dashboard component based on the provided UI design reference (`Tb_view.png`).

---

## 🎨 Palette & Visual Tokens

Extract and strictly apply the following visual style tokens:

* **Primary Dark Blue (Circles/Cards):** `#1E2A66`
* **Footer Dark Navy (Bottom Bar):** `#0A1128`
* **Accent Yellow (Button/Project Bar):** `#FFDF00`
* **Muted Grey-Blue (Percentage Badge):** `#8C9BB4`
* **Highlight Red (Arbitrages):** `#E52222`
* **Highlight Green (Completed Projects):** `#00C853`
* **Typography:** Modern Sans-Serif (`Inter`, `Roboto`, or `system-ui`)
* **Layout Constraints:** Maintain high-fidelity layout alignment, proportions, and border radiuses as seen in the mockup.

---

## 🧩 Component Architecture Requirements

Divide the implementation into modular, reusable functional components:

1. `Dashboard.jsx` (Main Container)
2. `TopPanel.jsx` (White card container with 3-dot header)
3. `MetricCircle.jsx` (Reusable circular indicator for 45% & AXE items)
4. `ProjectStatusRow.jsx` (Reusable bar for project progress)
5. `SummaryBar.jsx` (Bottom dark info banner)

---

## 📐 Detailed Layout & Specifications

### 1. Main Canvas & Structural Container (`TopPanel`)
- White rounded container (`border-radius: 16px`) with light subtle shadow.
- **Top-Left Header:** 3 stacked vertical dots (`⋮` icon or SVG indicator).

### 2. Left Column: Core KPI Hub & Action
- **Main Metric Circle:** 
  - Large `#1E2A66` circle.
  - Text inside: `45 %` (large font, bold) and `Horizon 2026` (sub-label).
- **Sub-Metric Circles (AXE Cluster):**
  - Three smaller `#1E2A66` circles positioned as a cluster/tree structure (`AXE 1`, `AXE 2`, `AXE 3`).
  - Text inside each: `20 %` (bold) and `AXE X` (sub-label).
- **Action Button:**
  - Placed directly below the main metric circle.
  - Full rounded pill shape (`border-radius: 24px`), `#FFDF00` background.
  - Text: `GENERER UN RAPPORT` (Dark blue font, centered, bold, hover effect).

### 3. Right Column: Project Progress List
Render a vertical stack of project status bars (`ProjectStatusRow`). Each row consists of:
- **Left Badge:** `#8C9BB4` background, white text displaying the percentage (`70%`, `20%`, etc.).
- **Right Tag:** `#FFDF00` background, bold dark text displaying the project name.

#### Mock Data Array for Projects:
```json
[
  { "label": "GIM SCHEMA PAIEMENT", "value": "70%" },
  { "label": "GIM TRILOGIE", "value": "70%" },
  { "label": "GIM SOUVERA", "value": "70%" },
  { "label": "GIM TECHNOPOLE", "value": "20%" },
  { "label": "GIMPAY", "value": "70%" },
  { "label": "GIM EXCELLENCE", "value": "65%" },
  { "label": "SIMULATION GAMIFI", "value": "80%" },
  { "label": "GIMPULSE", "value": "50%" },
  { "label": "GIM TRANSFORM", "value": "70%" }
]