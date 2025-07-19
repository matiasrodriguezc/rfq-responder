// src/app/api/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Schema for AI response validation
const BlockSchema = z.union([
  z.object({
    id: z.string(),
    type: z.literal('h1'),
    order: z.number(),
    content: z.string(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('h2'),
    order: z.number(),
    content: z.string(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('h3'),
    order: z.number(),
    content: z.string(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('text'),
    order: z.number(),
    content: z.string(),
  }),
  z.object({
    id: z.string(),
    type: z.literal('form'),
    order: z.number(),
    title: z.string(),
    fields: z.array(z.object({
      id: z.string(),
      label: z.string(),
      type: z.enum(['text', 'number', 'date', 'email', 'textarea']),
      value: z.string(),
      required: z.boolean(),
      placeholder: z.string(),
    })),
  }),
]);

const ResponseSchema = z.object({
  title: z.string(),
  blocks: z.array(BlockSchema),
});

// Mock data - In real implementation, you'd fetch from database
const RFQ_DATA = {
  id: "FA301625Q0050",
  title: "Air Force Bleacher Systems",
  description: "Request for 8 bleacher seating systems (125-person capacity each)",
  requirements: [
    "8 bleacher systems with 125-person capacity each",
    "Delivery to JBSA Lackland/Camp Bullis, TX",
    "No installation required (delivery only)",
    "Must include technical specifications and pictures",
    "SDVOSB set-aside requirement",
    "Firm Fixed Price contract",
    "Drawings, specifications, and pictures required",
    "Financial information forms completion"
  ],
  deadline: "July 21, 2025",
  estimatedValue: "Under $1M",
  naicsCode: "337127",
  setAside: "SDVOSB"
};

const ENTITY_DATA = {
  id: "gunn-construction-llc",
  name: "Gunn Construction LLC",
  cageCode: "[TO BE PROVIDED]",
  taxId: "[TO BE PROVIDED]",
  address: "Arlington, Virginia",
  capabilities: [
    "Commercial construction",
    "Institutional building construction", 
    "Federal contract delivery",
    "Structural systems installation",
    "Project management"
  ],
  naicsCodes: ["236220", "238110", "238120"],
  preferences: {
    contractTypes: ["Federal", "State"],
    projectSizeMax: 1000000,
    regions: ["Mid-Atlantic", "Virginia", "DC Metro"]
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rfqId, entityId } = body;

    // In a real app, validate the IDs and fetch actual data
    if (rfqId !== "FA301625Q0050" || entityId !== "gunn-construction-llc") {
      return NextResponse.json(
        { error: "Invalid RFQ or Entity ID" },
        { status: 400 }
      );
    }

    // Construct prompt for AI
    const systemPrompt = `You are an expert government contracting specialist creating RFQ responses. 

Create a comprehensive, professional RFQ response with the following structure:
- Use heading blocks (h1, h2, h3) for organization
- Use text blocks for detailed descriptions and explanations  
- Use form blocks for required data collection fields
- Ensure all government requirements are addressed
- Make the response specific to the company's capabilities

Key principles:
- Be thorough and professional
- Address all RFQ requirements specifically
- Include all necessary forms and data fields
- Use proper government contracting language
- Ensure compliance with stated requirements`;

    const userPrompt = `Create an RFQ response for:

RFQ Details:
- Title: ${RFQ_DATA.title}
- Description: ${RFQ_DATA.description}
- Requirements: ${RFQ_DATA.requirements.join(', ')}
- Deadline: ${RFQ_DATA.deadline}
- Value: ${RFQ_DATA.estimatedValue}
- NAICS: ${RFQ_DATA.naicsCode}
- Set-Aside: ${RFQ_DATA.setAside}

Company Details:
- Name: ${ENTITY_DATA.name}
- Location: ${ENTITY_DATA.address}
- Capabilities: ${ENTITY_DATA.capabilities.join(', ')}
- NAICS Codes: ${ENTITY_DATA.naicsCodes.join(', ')}

Required sections to include:
1. Title/Header
2. Company Information
3. Basic Quote Information Form (company name, CAGE code, delivery date, pricing, warranty)
4. Technical Specifications
5. Contact Information Form (POC, phone, email, tax ID)
6. Compliance & Certifications
7. Delivery & Timeline
8. Additional Requirements (as needed)

Make sure to include proper form fields for data collection and ensure the response is complete and professional.`;

    // Generate response using AI
    const result = await generateObject({
      model: openai('gpt-4o'),
      system: systemPrompt,
      prompt: userPrompt,
      schema: ResponseSchema,
    });

    // Create the full response object
    const response = {
      id: `response_${Date.now()}`,
      title: result.object.title,
      rfqId: rfqId,
      entityId: entityId,
      blocks: result.object.blocks,
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'draft' as const,
    };

    console.log('Generated RFQ response:', response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error generating RFQ response:', error);
    
    // Return a fallback mock response if AI fails
    const fallbackResponse = {
      id: `response_${Date.now()}`,
      title: "Air Force Bleacher Systems - RFQ Response",
      rfqId: "FA301625Q0050",
      entityId: "gunn-construction-llc",
      status: 'draft' as const,
      createdAt: new Date(),
      lastModified: new Date(),
      blocks: [
        {
          id: 'block_1',
          type: 'h1' as const,
          order: 0,
          content: 'RFQ Response: Air Force Bleacher Systems (FA301625Q0050)'
        },
        {
          id: 'block_2',
          type: 'h2' as const,
          order: 1,
          content: 'Executive Summary'
        },
        {
          id: 'block_3',
          type: 'text' as const,
          order: 2,
          content: 'Gunn Construction LLC is pleased to submit this response for the Air Force Bleacher Systems RFQ. We propose to deliver eight (8) high-quality bleacher seating systems, each with 125-person capacity, to JBSA Lackland/Camp Bullis, Texas. Our company brings extensive federal contracting experience and construction expertise to ensure successful project delivery.'
        },
        {
          id: 'block_4',
          type: 'form' as const,
          order: 3,
          title: 'Basic Quote Information',
          fields: [
            {
              id: 'company_name',
              label: 'Company Name',
              type: 'text' as const,
              value: 'Gunn Construction LLC',
              required: true
            },
            {
              id: 'cage_code',
              label: 'CAGE/SAM Unique Entity ID',
              type: 'text' as const,
              value: '',
              required: true,
              placeholder: 'Enter CAGE code'
            },
            {
              id: 'payment_terms',
              label: 'Payment Terms',
              type: 'text' as const,
              value: 'Net 30 Days',
              required: true
            },
            {
              id: 'delivery_date',
              label: 'Estimated Delivery Date',
              type: 'date' as const,
              value: '',
              required: true
            },
            {
              id: 'total_price',
              label: 'Total Price (8 Bleacher Systems)',
              type: 'number' as const,
              value: '',
              required: true,
              placeholder: 'Enter total price'
            },
            {
              id: 'warranty',
              label: 'Warranty Information',
              type: 'textarea' as const,
              value: 'Standard manufacturer warranty covering defects in materials and workmanship for one (1) year from date of delivery.',
              required: true
            }
          ]
        },
        {
          id: 'block_5',
          type: 'h2' as const,
          order: 4,
          content: 'Technical Specifications & Compliance'
        },
        {
          id: 'block_6',
          type: 'text' as const,
          order: 5,
          content: 'Our proposed bleacher systems will meet all requirements specified in the Statement of Work, including 125-person capacity per unit, structural safety standards, and accessibility compliance. Technical drawings, specifications, and product photographs will be provided as required attachments to demonstrate full compliance with RFQ requirements.'
        },
        {
          id: 'block_7',
          type: 'form' as const,
          order: 6,
          title: 'Contact Information',
          fields: [
            {
              id: 'poc_name',
              label: 'Point of Contact Name',
              type: 'text' as const,
              value: '',
              required: true,
              placeholder: 'Enter primary contact name'
            },
            {
              id: 'phone',
              label: 'Telephone Number',
              type: 'text' as const,
              value: '',
              required: true,
              placeholder: '(XXX) XXX-XXXX'
            },
            {
              id: 'email',
              label: 'Email Address',
              type: 'email' as const,
              value: '',
              required: true,
              placeholder: 'contact@gunnconstructionllc.com'
            },
            {
              id: 'tax_id',
              label: 'Tax ID Number',
              type: 'text' as const,
              value: '',
              required: true,
              placeholder: 'XX-XXXXXXX'
            }
          ]
        },
        {
          id: 'block_8',
          type: 'h2' as const,
          order: 7,
          content: 'SDVOSB Certification & Compliance'
        },
        {
          id: 'block_9',
          type: 'text' as const,
          order: 8,
          content: 'Gunn Construction LLC maintains active SAM registration with current representations and certifications. We confirm full compliance with SDVOSB set-aside requirements and all FAR provisions incorporated by reference in this solicitation.'
        }
      ]
    };

    return NextResponse.json(fallbackResponse);
  }
}