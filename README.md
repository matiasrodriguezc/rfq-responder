# CLEATUS RFQ Responder

> AI-Powered Government Contract Response Generator

An intelligent platform that leverages AI to automatically generate comprehensive, compliant responses to Request for Quotation (RFQ) documents for government contracting.

## 🚀 Features

### Core Functionality
- **AI-Powered Generation**: Uses OpenAI GPT-4 to analyze RFQ requirements and generate tailored responses
- **Interactive Block Editor**: Drag-and-drop interface for editing and reordering response sections
- **Form Management**: Automatically generates required government forms with proper fields
- **PDF Export**: Export complete responses as professional PDF documents
- **Real-time Editing**: Live editing of headings, text blocks, and form fields
- **Compliance Focused**: Ensures responses address all government contracting requirements

### Key Components
- **Smart Content Generation**: Matches company capabilities to RFQ requirements
- **Structured Response Format**: Organized sections for technical specs, compliance, and contact info
- **Government Form Integration**: Pre-configured forms for CAGE codes, pricing, warranties, etc.
- **SDVOSB Compliance**: Built-in support for Service-Disabled Veteran-Owned Small Business requirements

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **@hello-pangea/dnd** - Drag and drop functionality
- **jsPDF** - PDF generation

### Backend
- **Next.js API Routes** - Server-side endpoints
- **OpenAI SDK** - AI integration with GPT-4
- **Vercel AI SDK** - Structured AI responses with Zod validation
- **Zod** - Schema validation and type safety

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # AI response generation endpoint
│   ├── components/
│   │   ├── GenerateButton.tsx    # AI generation trigger
│   │   └── ResponseEditor.tsx    # Interactive block editor
│   ├── types/
│   │   └── index.ts             # TypeScript definitions
│   └── page.tsx                 # Main RFQ responder interface
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cleatus-rfq-responder.git
   cd cleatus-rfq-responder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Generating an RFQ Response

1. **Review RFQ Details**: The interface displays current RFQ information including deadline, value, and requirements
2. **Check Company Info**: Verify your company details and capabilities
3. **Generate Response**: Click "Generate Response" to trigger AI analysis
4. **Edit Content**: Use the interactive editor to modify generated content
5. **Export PDF**: Download the final response as a professional PDF

### Editing Response Blocks

- **Drag & Drop**: Reorder sections by dragging blocks
- **Edit Content**: Click the edit icon to modify text and headings
- **Form Fields**: Update form values directly in the interface
- **Add Blocks**: Insert new sections (headings, paragraphs, forms)
- **Delete Blocks**: Remove unnecessary sections

## 🏗️ Architecture

### AI Response Generation
```typescript
// The system uses structured AI generation with Zod schemas
const ResponseSchema = z.object({
  title: z.string(),
  blocks: z.array(BlockSchema),
});

// AI generates responses based on RFQ requirements and company data
const result = await generateObject({
  model: openai('gpt-4o'),
  schema: ResponseSchema,
  prompt: userPrompt,
});
```

### Block System
The application uses a flexible block-based content system:

- **Heading Blocks** (`h1`, `h2`, `h3`): For section titles
- **Text Blocks**: For paragraphs and descriptions  
- **Form Blocks**: For required government forms and data collection

### Data Flow
1. User triggers AI generation
2. System combines RFQ requirements with company capabilities
3. AI generates structured response using predefined schema
4. Frontend renders editable blocks
5. User can modify, reorder, and export final response

## 🔧 Configuration

### RFQ Data
Currently configured for Air Force Bleacher Systems RFQ:
- **RFQ ID**: FA301625Q0050
- **Requirements**: 8 bleacher systems (125-person capacity each)
- **Value**: Under $1M
- **Set-Aside**: SDVOSB

### Company Profile
Example configuration for Gunn Construction LLC:
- **Location**: Arlington, Virginia
- **Capabilities**: Federal contracting, construction
- **NAICS Codes**: Multiple construction-related codes

## 📊 Sample Output

The AI generates comprehensive responses including:

### Executive Summary
Professional overview matching company capabilities to RFQ requirements

### Technical Specifications
Detailed compliance information addressing all RFQ requirements

### Required Forms
- Basic Quote Information (company name, CAGE code, pricing, delivery)
- Contact Information (POC, phone, email, tax ID)
- Compliance certifications and warranties

### Government Compliance
SDVOSB certification status and FAR provision compliance

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Environment Variables
Ensure the following are set in your deployment environment:
- `OPENAI_API_KEY`: Your OpenAI API key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project was developed for the CLEATUS Hackathon July 2025.

## 🏆 Hackathon Context

**CLEATUS Hackathon July 2025**
- **Theme**: AI-Powered Government Contracting Solutions
- **Goal**: Streamline RFQ response process for small businesses
- **Focus**: SDVOSB (Service-Disabled Veteran-Owned Small Business) support

## 🛡️ Security Considerations

- API keys are stored securely in environment variables
- Input validation using Zod schemas
- Structured AI responses prevent prompt injection
- Client-side form validation for data integrity
