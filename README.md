# CLEATUS Hackathon - AI-Powered RFQ Response Generator

## 🚀 Overview

Transform hours of manual RFQ (Request for Quote) analysis and form filling into a one-click AI-powered solution. This project builds an intelligent system that automatically generates complete government contracting responses by analyzing contract requirements and entity capabilities.

**The Challenge**: Click "Generate Response" → AI builds the complete proposal → User reviews and edits

That's it. Turn what normally takes hours into something that just works.

## 📋 What's an RFQ?

An RFQ (Request for Quote) is when the government asks businesses to submit their price and basic details for a specific product or service. Unlike complex proposals, RFQs are typically straightforward: "We need X quantity of Y item, what's your price and when can you deliver it?"

## 🎯 Sample Data: Real Production Case Study

### The Contract: Air Force Bleacher Systems
- **RFQ FA301625Q0050** - Request for 8 bleacher seating systems (125-person capacity each)
- **Small business set-aside** for delivery to JBSA Lackland/Camp Bullis, TX
- **Deadline**: July 21, 2025
- **Value**: Under $1M
- **Scope**: Delivery only, no installation required

### The Entity: Gunn Construction LLC
- **Full-service construction company** based in Arlington, Virginia
- **27 NAICS codes** covering comprehensive construction capabilities
- **Strategic focus**: Federal contracts under $1M in Mid-Atlantic region
- **Perfect alignment** with contract preferences and timeline

## 🏗️ Response Architecture

Responses are built using modular **blocks** that can be dynamically arranged:

### Content Blocks
- **H1/H2/H3** - Hierarchical headings
- **Text** - Paragraph content
- **Form** - Input forms for data collection

**Why Forms Matter**: 95%+ of RFQs include standardized forms collecting business classification, delivery timelines, technical specs, and pricing. The government uses these for standardized comparison across all bidders.

## 📁 Data Structure

```
├── entity-data/
│   ├── entity.json                    # Complete business profile (2.3KB)
│   └── capability-statement.json     # Capability statement metadata (717B)
├── contract-data/
│   ├── contract.json                  # Contract details & requirements (4.8KB)
│   ├── documents.json                 # All contract documents (6.9KB)
│   └── far-sections.json             # FAR sections breakdown (8.5KB)
├── _documents/                        # Markdown versions for reference
└── _forms/                           # PDF forms for this RFQ
```

## 📋 RFQ Submission Requirements

This Air Force RFQ requires a comprehensive submission package:

### ✅ Required Components
1. **Basic Quote Information**
   - Company details, CAGE/SAM ID, payment terms
   - Delivery date, contact info, warranty details
   - Electronic invoicing capability (WAWF)

2. **Technical Documentation** ⚠️ **CRITICAL**
   - Product specifications matching SOW requirements
   - Specification sheets and pictures
   - Drawings/diagrams
   - **WARNING**: Missing spec sheets/pictures = automatic rejection

3. **Required Forms**
   - Attachment 2: Contractor Release of Financial Information
   - Attachment 3: Financial Information Questionnaire (bank completion)

4. **Government Compliance**
   - Active SAM registration with current certifications
   - SDVOSB verification (100% set-aside requirement)
   - FAR provisions compliance

## 🎯 Strategic Alignment Analysis

### Perfect Match Indicators ✅
- Federal contract (entity prefers federal/state)
- Under $1M threshold (entity prefers <$1M)
- 19 days to bid (entity wants 15+ days)
- Delivery-only scope (not design-build)
- Structural work aligns with construction expertise

### Potential Challenges ⚠️
- NAICS mismatch: 337127 (Manufacturing) vs 236220 (Construction)
- Location: TX delivery vs VA-focused preference
- Specialization: Bleacher systems vs general construction

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Quick Setup
```bash
# Clone the repository
git clone <repository-url>
cd cleatus-hackathon

# Install dependencies
npm install

# Start development server
npm run dev
```

### Recommended Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Vercel AI SDK
- **Deployment**: Vercel

### Initial Setup Command
```bash
npx create-next-app@latest rfq-responder --typescript --tailwind --app --src-dir --turbopack
```

## 🤖 AI Agent Implementation

The core AI agent should:

1. **Analyze Contract Requirements**
   - Parse RFQ documents for submission requirements
   - Extract technical specifications
   - Identify mandatory forms and compliance items

2. **Match Entity Capabilities**
   - Assess strategic alignment with contract
   - Identify potential challenges or gaps
   - Suggest positioning strategies

3. **Generate Complete Response**
   - Auto-populate forms with entity data
   - Create technical compliance documentation
   - Structure response according to RFQ requirements

4. **Enable User Review & Edit**
   - Present generated response in editable blocks
   - Allow reordering, modification, and refinement
   - Maintain compliance with submission requirements

## 🔧 Development Approach

### Phase 1: Data Processing
- Parse JSON data files into usable structures
- Extract RFQ requirements and entity capabilities
- Build matching/alignment algorithms

### Phase 2: Response Generation
- Implement block-based response architecture
- Create form auto-population logic
- Build compliance checking system

### Phase 3: User Interface
- Design intuitive "Generate Response" workflow
- Create editable block interface
- Implement review and export functionality

### Phase 4: AI Integration
- Integrate chosen AI provider (OpenAI, Anthropic, etc.)
- Implement intelligent requirement extraction
- Build capability matching and response generation

## 📊 Key Metrics for Success

- **Time Reduction**: From hours to minutes for RFQ response
- **Accuracy**: Complete requirement coverage
- **Compliance**: All mandatory forms and documentation
- **Usability**: One-click generation + easy editing

## 🎪 Why This Matters

Government contracting is a $600B+ market where small businesses often struggle with complex paperwork and requirements. This AI system democratizes access by:

- **Reducing barriers**: Complex requirements → Simple workflow
- **Increasing accuracy**: AI ensures nothing is missed
- **Saving time**: Focus on business, not paperwork
- **Improving competitiveness**: Better responses = more wins

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is a hackathon project, but contributions and improvements are welcome! 

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Ready to revolutionize government contracting? Let's build the future of RFQ responses! 🚀**
