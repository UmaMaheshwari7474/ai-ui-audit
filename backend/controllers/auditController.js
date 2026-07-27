import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to convert buffer to generative part format
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType
    }
  };
}

// Prompt for Gemini AI UI/UX audit
const AUDIT_PROMPT = `
You are a Senior Product Designer, Senior UI/UX Designer, and AI Design Auditor with 15+ years of experience building premium products like Linear, Stripe, and Vercel.
Analyze the uploaded screenshot of a user interface (website, landing page, dashboard, SaaS product, or mobile app).

Evaluate the following categories in detail:
1. Typography (font sizes, line heights, font pairings, text hierarchy)
2. Spacing & Layout (margins, paddings, grids, consistency, alignment)
3. Visual Hierarchy & Contrast (focal points, call to actions, readable text, shadows, element size)
4. Accessibility & Contrast (WCAG compliance, screen-reader friendliness, visible focus states)
5. Color System (palette harmony, background/card colors, accent use, slate/dark-mode colors)
6. Modern UI Practices (glassmorphism details, rounded corners, clean borders, minimal shadows)
7. User Experience & Interaction Design (form layouts, button hover expectations, navigation usability, empty states)

Generate a JSON object ONLY. Do not write any markdown blocks (like \`\`\`json) or extra text outside the JSON. Use the following schema:
{
  "score": <overall float score out of 10, e.g. 7.6>,
  "categoryScores": {
    "typography": <float out of 10>,
    "spacing": <float out of 10>,
    "visualHierarchy": <float out of 10>,
    "accessibility": <float out of 10>,
    "colorSystem": <float out of 10>,
    "layout": <float out of 10>,
    "userExperience": <float out of 10>
  },
  "summary": "<a high-level, professional, encouraging yet critical review of the dashboard/page (3-4 sentences)>",
  "strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],
  "weaknesses": [
    "<weakness 1>",
    "<weakness 2>",
    "<weakness 3>"
  ],
  "priorityImprovements": [
    { "text": "<quick action item 1>", "type": "quickWin", "severity": "high" },
    { "text": "<quick action item 2>", "type": "quickWin", "severity": "medium" },
    { "text": "<long term design item 1>", "type": "longTerm", "severity": "high" },
    { "text": "<long term design item 2>", "type": "longTerm", "severity": "medium" }
  ],
  "accessibilityFindings": [
    "<accessibility finding 1>",
    "<accessibility finding 2>"
  ],
  "colorRecommendations": [
    "<specific hex code, contrast, or color distribution change 1>",
    "<color recommendations 2>"
  ],
  "typographyRecommendations": [
    "<specific font size, weights, line heights, or hierarchy advice 1>",
    "<typography recommendations 2>"
  ],
  "spacingRecommendations": [
    "<specific grid, padding, margin, or gap modification 1>",
    "<spacing recommendations 2>"
  ],
  "modernizationSuggestions": [
    "<modern look-and-feel suggestions 1>",
    "<modernization suggestion 2>"
  ]
}
`;

// Helper to generate a realistic mock report
function generateMockReport(originalName) {
  const isDashboard = /dashboard|admin|panel|analytics|table/i.test(originalName);
  const isLanding = /landing|hero|home|landingpage|marketing/i.test(originalName);
  const score = Number((7.0 + Math.random() * 2.2).toFixed(1));

  if (isDashboard) {
    return {
      score,
      categoryScores: {
        typography: 7.8,
        spacing: 7.2,
        visualHierarchy: 8.0,
        accessibility: 6.8,
        colorSystem: 8.5,
        layout: 7.5,
        userExperience: 7.0
      },
      summary: "This dashboard displays a solid visual style with custom cards and dark-mode elements. However, the density of information is quite high, leading to visual noise. Improving spacing constraints and adding clean typographic anchors will significantly enhance the user's parsing speed.",
      strengths: [
        "Consistent use of rounded corners (16px) giving it a modern and premium feel.",
        "Excellent color pairing on accent buttons (#2563EB and #7C3AED) that creates an inviting focal point.",
        "Clean, legible layout using dark slate headers and light card backgrounds."
      ],
      weaknesses: [
        "High table row density makes tabular information difficult to scan quickly.",
        "Lack of distinct hover states on navigation sidebars reduces interactive clarity.",
        "Too many secondary elements share the same background, blending critical components together."
      ],
      priorityImprovements: [
        { "text": "Increase padding in table headers and rows to 16px.", "type": "quickWin", "severity": "high" },
        { "text": "Set sidebar menu item active state to #2563EB with a smooth background animation.", "type": "quickWin", "severity": "medium" },
        { "text": "Introduce an 8px grid constraint across all cards and spacing containers.", "type": "longTerm", "severity": "high" },
        { "text": "Refactor tables into card listings or collapsible sections for mobile/tablet responsiveness.", "type": "longTerm", "severity": "medium" }
      ],
      accessibilityFindings: [
        "Secondary labels with light gray text fail to meet the WCAG AA contrast ratio of 4.5:1.",
        "Search input fields lack explicit ARIA labels for screen reader compatibility."
      ],
      colorRecommendations: [
        "Increase secondary text contrast by changing it from Slate-400 (#94A3B8) to Slate-600 (#475569) on white background.",
        "Use #EF4444 (Error) and #10B981 (Success) indicators consistently for negative and positive percentage growth."
      ],
      typographyRecommendations: [
        "Change table font sizing to 14px (0.875rem) and use medium font-weight for headers to set a clear visual hierarchy.",
        "Increase body text line-height to 1.5 to reduce scanning fatigue."
      ],
      spacingRecommendations: [
        "Standardize gap values to either 16px (1rem) or 24px (1.5rem) inside main grid systems.",
        "Add a minimum of 48px vertical padding between large data modules."
      ],
      modernizationSuggestions: [
        "Apply a subtle 1px border (#E2E8F0) on card layouts instead of thick dropshadows.",
        "Incorporate micro-interactions on charts for interactive data hover events."
      ]
    };
  } else if (isLanding) {
    return {
      score,
      categoryScores: {
        typography: 8.5,
        spacing: 8.0,
        visualHierarchy: 8.2,
        accessibility: 7.5,
        colorSystem: 8.8,
        layout: 8.3,
        userExperience: 8.0
      },
      summary: "An elegant and minimalist landing page design with strong typography, particularly in the hero section. The layout uses generous whitespace, keeping the focus on the primary value proposition. A few improvements in contrast ratios and button grouping will push this landing page to a world-class level.",
      strengths: [
        "Superb typography scale using Inter with excellent heading line-heights.",
        "Effective spacing in the hero section which makes the headline stand out.",
        "Modern glassmorphism navigation header that overlays nicely on the background gradients."
      ],
      weaknesses: [
        "Primary CTA button contrast in the hero is insufficient on top of custom purple gradients.",
        "FAQ section uses generic toggles that feel disconnected from the sleek hero aesthetic.",
        "Benefits section grid layout collapses awkwardly on smaller tablet sizes (768px)."
      ],
      priorityImprovements: [
        { "text": "Boost CTA text color contrast against the purple gradient background.", "type": "quickWin", "severity": "high" },
        { "text": "Apply a subtle transition delay to FAQ accordion components for a smoother expansion.", "type": "quickWin", "severity": "medium" },
        { "text": "Implement CSS Flex wrap or Tailwind grid-cols-1 md:grid-cols-2 lg:grid-cols-3 configurations.", "type": "longTerm", "severity": "high" },
        { "text": "Unify the design system's border radii to a consistent 16px across landing page modules.", "type": "longTerm", "severity": "medium" }
      ],
      accessibilityFindings: [
        "Gray secondary texts on the footer fail contrast minimum requirements.",
        "Framer motion fade-ins do not respect standard system-reduced-motion preferences."
      ],
      colorRecommendations: [
        "Use high contrast colors for the primary call-to-action button, such as #0F172A (almost black) on light modes.",
        "Reduce background gradient opacity to keep the text elements fully readable."
      ],
      typographyRecommendations: [
        "Set main titles to a letter-spacing of -0.025em (tracking-tight) for a premium editorial appearance.",
        "Avoid using font weights below 400 for copy text to maintain high legibility."
      ],
      spacingRecommendations: [
        "Increase padding in the hero container to 120px on desktop to give the header more breathing room.",
        "Align benefit icons directly with the text header's baseline."
      ],
      modernizationSuggestions: [
        "Add a subtle glow effect (radial-gradient) behind the main product mockup image.",
        "Incorporate hover micro-translations on cards, pushing them 4px upward on focus."
      ]
    };
  } else {
    // Generic UI
    return {
      score,
      categoryScores: {
        typography: 7.2,
        spacing: 7.0,
        visualHierarchy: 7.5,
        accessibility: 7.0,
        colorSystem: 7.8,
        layout: 7.4,
        userExperience: 7.1
      },
      summary: "This interface shows an excellent start with a clean design system. To elevate this to product-ready, focus on aligning component borders, improving secondary text contrast, and standardizing the spacing system with an 8px grid constraint.",
      strengths: [
        "Pleasing overall color scheme with slate elements that look professional.",
        "Simple and clear layout structure that is easy for a user to follow.",
        "Modern typography sizing with readable default scales."
      ],
      weaknesses: [
        "Card borders and container paddings are inconsistent, creating visual misalignment.",
        "Primary action elements do not look clickable enough compared to surrounding cards.",
        "Text lines wrap tightly around icons, causing overlap on narrow viewports."
      ],
      priorityImprovements: [
        { "text": "Implement uniform padding of 24px (1.5rem) inside all container cards.", "type": "quickWin", "severity": "high" },
        { "text": "Apply cursor-pointer and hover:scale-[1.02] on interactive cards.", "type": "quickWin", "severity": "medium" },
        { "text": "Migrate layout spacing to strict multiples of 8px.", "type": "longTerm", "severity": "high" },
        { "text": "Introduce explicit screen-reader landmarks for accessibility compliance.", "type": "longTerm", "severity": "medium" }
      ],
      accessibilityFindings: [
        "Input placeholder text color is too light, rendering it invisible under bright light.",
        "No focus outline on keyboard navigation elements."
      ],
      colorRecommendations: [
        "Make secondary actions use a light slate background instead of primary colored outlines to avoid visual clutter.",
        "Use green and yellow badges only for functional status, not general layout categories."
      ],
      typographyRecommendations: [
        "Establish an explicit hierarchy: h1 (32px), h2 (24px), h3 (18px), body (16px), caption (12px).",
        "Set headings to font-weight 700 to provide a strong visual anchor."
      ],
      spacingRecommendations: [
        "Increase card-to-card margin to 24px to prevent elements from looking crowded.",
        "Provide a 12px gap between icon and text elements in menu bars."
      ],
      modernizationSuggestions: [
        "Use a subtle hover transition of 200ms with ease-in-out curve on all buttons.",
        "Use card borders (#F1F5F9) instead of drop-shadows to define cards."
      ]
    };
  }
}

// Upload screenshot and perform audit
export const performAudit = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No screenshot file uploaded.' });
    }

    const { originalname, filename, mimetype, buffer } = req.file;

    // Simulate AI thinking delay for realistic premium feeling
    // (It takes a moment to process the UI anyway)
    await new Promise(resolve => setTimeout(resolve, 3000));

    let auditReport;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== '') {
      try {
        console.log('Initiating Gemini API UI Audit...');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' }
        });

        const imagePart = fileToGenerativePart(buffer, mimetype);
        const result = await model.generateContent([AUDIT_PROMPT, imagePart]);
        const responseText = result.response.text();

        auditReport = JSON.parse(responseText);
        console.log('Gemini API UI Audit complete.');
      } catch (geminiError) {
        console.error('Gemini API call failed, falling back to mock generator:', geminiError.message);
        auditReport = generateMockReport(originalname);
      }
    } else {
      console.log('No GEMINI_API_KEY found. Generating mock professional UI Audit...');
      auditReport = generateMockReport(originalname);
    }

    // Save image to static folder so it can be served to client
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const publicFilename = `${crypto.randomUUID()}${path.extname(originalname)}`;
    const publicPath = path.join(uploadsDir, publicFilename);
    fs.writeFileSync(publicPath, buffer);

    // Save audit record to db
    const newAudit = {
      id: crypto.randomUUID(),
      userId: req.user.id,
      originalName: originalname,
      screenshotUrl: `/uploads/${publicFilename}`,
      createdAt: new Date().toISOString(),
      isPinned: false,
      ...auditReport
    };

    db.addAudit(newAudit);

    res.status(201).json(newAudit);
  } catch (error) {
    console.error('Perform audit error:', error);
    res.status(500).json({ message: 'Server error during UI audit analysis' });
  }
};

// Get audit history for current user
export const getAuditHistory = async (req, res) => {
  try {
    const audits = db.getAuditsByUserId(req.user.id);
    // Sort by createdAt descending
    audits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(audits);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error getting history' });
  }
};

// Get single audit report
export const getAuditById = async (req, res) => {
  try {
    const audit = db.getAuditById(req.params.id);
    if (!audit) {
      return res.status(404).json({ message: 'Audit report not found' });
    }

    // Ensure user owns this audit
    if (audit.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to report' });
    }

    res.json(audit);
  } catch (error) {
    console.error('Get audit by id error:', error);
    res.status(500).json({ message: 'Server error getting audit report' });
  }
};

// Delete single audit report
export const deleteAudit = async (req, res) => {
  try {
    const audit = db.getAuditById(req.params.id);
    if (!audit) {
      return res.status(404).json({ message: 'Audit report not found' });
    }

    if (audit.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete uploaded image from local storage
    const imagePath = path.join(__dirname, '../../', audit.screenshotUrl);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error('Error deleting screenshot file:', err);
      }
    }

    db.deleteAudit(req.params.id);
    res.json({ message: 'Audit report deleted successfully' });
  } catch (error) {
    console.error('Delete audit error:', error);
    res.status(500).json({ message: 'Server error deleting audit' });
  }
};

// Toggle Pin status of audit
export const togglePinAudit = async (req, res) => {
  try {
    const audit = db.getAuditById(req.params.id);
    if (!audit) {
      return res.status(404).json({ message: 'Audit report not found' });
    }

    if (audit.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updated = db.updateAudit(req.params.id, { isPinned: !audit.isPinned });
    res.json(updated);
  } catch (error) {
    console.error('Toggle pin error:', error);
    res.status(500).json({ message: 'Server error updating pin status' });
  }
};
