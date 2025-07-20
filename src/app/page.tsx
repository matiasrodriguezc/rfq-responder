'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Response } from '../types';
import GenerateButton from '../components/GenerateButton';
import ResponseEditor from '../components/ResponseEditor';
import { Building2, FileText, Award, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';

const RFQResponder: React.FC = () => {
  const [currentResponse, setCurrentResponse] = useState<Response | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shouldScrollToResponse, setShouldScrollToResponse] = useState(false);
  const responseRef = useRef<HTMLDivElement | null>(null);

  const rfqData = {
    title: "FA301625Q0050 - Air Force Bleacher Systems",
    deadline: "July 21, 2025",
    estimatedValue: "Under $1M",
    requirements: 8
  };

  const entityData = {
    name: "Gunn Construction LLC",
    location: "Arlington, Virginia",
    naicsCodes: "27 codes",
    established: "2023"
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rfqId: 'FA301625Q0050',
          entityId: 'gunn-construction-llc'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const generatedResponse: Response = await response.json();
      setShouldScrollToResponse(true);
      setCurrentResponse(generatedResponse);
    } catch (error) {
      console.error('Error generating response:', error);
      setShouldScrollToResponse(true);
      setCurrentResponse(createMockResponse());
    } finally {
      setIsGenerating(false);
    }
  };

  const createMockResponse = (): Response => {
    return {
      id: `response_${Date.now()}`,
      title: "Air Force Bleacher Systems - RFQ Response",
      rfqId: "FA301625Q0050",
      entityId: "gunn-construction-llc",
      status: 'draft',
      createdAt: new Date(),
      lastModified: new Date(),
      blocks: [
        {
          id: 'block_1',
          type: 'h1',
          order: 0,
          content: 'RFQ Response: Air Force Bleacher Systems'
        },
        {
          id: 'block_2',
          type: 'h2',
          order: 1,
          content: 'Company Information'
        },
        {
          id: 'block_3',
          type: 'text',
          order: 2,
          content: 'Gunn Construction LLC is a full-service construction company based in Arlington, Virginia, established in 2023. We specialize in federal contracts under $1M and have comprehensive construction capabilities across 27 NAICS codes.'
        },
        {
          id: 'block_4',
          type: 'form',
          order: 3,
          title: 'Basic Quote Information',
          fields: [
            {
              id: 'company_name',
              label: 'Company Name',
              type: 'text',
              value: 'Gunn Construction LLC',
              required: true
            },
            {
              id: 'cage_code',
              label: 'CAGE/SAM Unique Entity ID',
              type: 'text',
              value: '',
              required: true,
              placeholder: 'Enter your CAGE code'
            },
            {
              id: 'delivery_date',
              label: 'Estimated Delivery Date',
              type: 'date',
              value: '',
              required: true
            },
            {
              id: 'total_price',
              label: 'Total Price (8 Bleacher Systems)',
              type: 'number',
              value: '',
              required: true,
              placeholder: 'Enter total price'
            },
            {
              id: 'warranty',
              label: 'Warranty Information',
              type: 'textarea',
              value: 'Standard 1-year manufacturer warranty on all bleacher systems, covering defects in materials and workmanship.',
              required: true
            }
          ]
        },
        {
          id: 'block_5',
          type: 'h2',
          order: 4,
          content: 'Technical Specifications'
        },
        {
          id: 'block_6',
          type: 'text',
          order: 5,
          content: 'We propose to deliver eight (8) bleacher seating systems, each with a capacity of 125 persons. Each unit will meet all specified requirements for structural integrity, safety standards, and accessibility compliance as outlined in the Statement of Work.'
        },
        {
          id: 'block_7',
          type: 'form',
          order: 6,
          title: 'Contact Information',
          fields: [
            {
              id: 'poc_name',
              label: 'Point of Contact Name',
              type: 'text',
              value: '',
              required: true,
              placeholder: 'Enter contact person name'
            },
            {
              id: 'phone',
              label: 'Telephone',
              type: 'text',
              value: '',
              required: true,
              placeholder: '(XXX) XXX-XXXX'
            },
            {
              id: 'email',
              label: 'Email Address',
              type: 'email',
              value: '',
              required: true,
              placeholder: 'contact@company.com'
            },
            {
              id: 'tax_id',
              label: 'Tax ID',
              type: 'text',
              value: '',
              required: true,
              placeholder: 'XX-XXXXXXX'
            }
          ]
        },
        {
          id: 'block_8',
          type: 'h2',
          order: 7,
          content: 'Compliance & Certifications'
        },
        {
          id: 'block_9',
          type: 'text',
          order: 8,
          content: 'Gunn Construction LLC maintains active SAM registration with current representations and certifications. We confirm compliance with all FAR provisions incorporated by reference and meet the SDVOSB requirements for this contract.'
        }
      ]
    };
  };

  const handleUpdateResponse = (updatedResponse: Response) => {
    setCurrentResponse(updatedResponse);
  };

  const handleExportResponse = () => {
  if (!currentResponse) return;

  const doc = new jsPDF();
  let y = 10; // posición vertical inicial
  const lineHeight = 10;

  const addText = (text: string, options: { size?: number; style?: 'normal' | 'bold' } = {}) => {
    const { size = 12, style = 'normal' } = options;
    doc.setFontSize(size);
    doc.setFont('helvetica', style);

    const lines = doc.splitTextToSize(text, 180); // ajusta el ancho del texto
    lines.forEach((line: string | string[]) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 10, y);
      y += lineHeight;
    });
    y += 2;
  };

  addText(currentResponse.title, { size: 16, style: 'bold' });
  addText(`Generated: ${new Date(currentResponse.createdAt).toLocaleDateString()}`, { size: 10 });

  currentResponse.blocks
    .sort((a, b) => a.order - b.order)
    .forEach(block => {
      switch (block.type) {
        case 'h1':
          addText(block.content, { size: 14, style: 'bold' });
          break;
        case 'h2':
          addText(block.content, { size: 13, style: 'bold' });
          break;
        case 'h3':
          addText(block.content, { size: 12, style: 'bold' });
          break;
        case 'text':
          addText(block.content);
          break;
        case 'form':
          addText(block.title, { style: 'bold' });
          block.fields.forEach(field => {
            addText(`${field.label}: ${field.value || '[TO BE FILLED]'}`);
          });
          break;
      }
      y += 4;
    });

  doc.save(`${currentResponse.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
};

  // ✅ Auto-scroll only when shouldScrollToResponse is true
  useEffect(() => {
    if (shouldScrollToResponse && currentResponse && responseRef.current) {
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth' });
        setShouldScrollToResponse(false);
      }, 100);
    }
  }, [shouldScrollToResponse, currentResponse]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">CLEATUS RFQ Responder</h1>
                <p className="text-sm text-gray-500">AI-Powered Government Contract Responses</p>
              </div>
            </div>
            {currentResponse && (
              <button
                onClick={handleExportResponse}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Export Response
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Your Company</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium text-gray-800">{entityData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location:</span>
                <span className="font-medium text-gray-800">{entityData.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">NAICS Codes:</span>
                <span className="font-medium text-gray-800">{entityData.naicsCodes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Established:</span>
                <span className="font-medium text-gray-800">{entityData.established}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Target RFQ</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Title:</span>
                <div className="font-medium text-gray-800 mt-1">{rfqData.title}</div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deadline:</span>
                <span className="font-medium text-red-600">{rfqData.deadline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Est. Value:</span>
                <span className="font-medium text-green-600">{rfqData.estimatedValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Requirements:</span>
                <span className="font-medium text-gray-800">{rfqData.requirements} items</span>
              </div>
            </div>
          </div>
        </div>

        <GenerateButton
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          rfqData={rfqData}
        />

        <div ref={responseRef} className="bg-white rounded-lg shadow-sm border">
          <ResponseEditor
            response={currentResponse}
            onUpdateResponse={handleUpdateResponse}
            isGenerating={isGenerating}
          />
        </div>
      </div>

      <div className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg font-semibold mb-2">CLEATUS Hackathon July 2025</h3>
          <p className="text-gray-400">AI-Powered RFQ Response Generator</p>
        </div>
      </div>
    </div>
  );
};

export default RFQResponder;