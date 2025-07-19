'use client';

import React, { useState } from 'react';
import { Response } from '../types';
import GenerateButton from '../components/GenerateButton';
import ResponseEditor from '../components/ResponseEditor';
import { Building2, FileText, Award, CheckCircle } from 'lucide-react';

const RFQResponder: React.FC = () => {
  const [currentResponse, setCurrentResponse] = useState<Response | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const responseRef = React.useRef<HTMLDivElement | null>(null);

  // Mock RFQ data based on the hackathon sample
  const rfqData = {
    title: "FA301625Q0050 - Air Force Bleacher Systems",
    deadline: "July 21, 2025",
    estimatedValue: "Under $1M",
    requirements: 8
  };

  // Mock entity data
  const entityData = {
    name: "Gunn Construction LLC",
    location: "Arlington, Virginia",
    naicsCodes: "27 codes",
    established: "2023"
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Call to your AI API endpoint
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
      setCurrentResponse(generatedResponse);
    } catch (error) {
      console.error('Error generating response:', error);
      // For demo purposes, create a mock response
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
    
    // Create a simple text export of the response
    let exportText = `${currentResponse.title}\n`;
    exportText += `Generated: ${new Date(currentResponse.createdAt).toLocaleDateString()}\n\n`;
    
    currentResponse.blocks
      .sort((a, b) => a.order - b.order)
      .forEach(block => {
        if (block.type === 'h1') {
          exportText += `# ${block.content}\n\n`;
        } else if (block.type === 'h2') {
          exportText += `## ${block.content}\n\n`;
        } else if (block.type === 'h3') {
          exportText += `### ${block.content}\n\n`;
        } else if (block.type === 'text') {
          exportText += `${block.content}\n\n`;
        } else if (block.type === 'form') {
          exportText += `**${block.title}**\n`;
          block.fields.forEach(field => {
            exportText += `${field.label}: ${field.value || '[TO BE FILLED]'}\n`;
          });
          exportText += '\n';
        }
      });

    // Create and download file
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentResponse.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    if (currentResponse && responseRef.current) {
      // Pequeño delay para asegurar que el DOM ya tenga renderizado el contenido
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [currentResponse]);

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
        {/* Entity & RFQ Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Entity Info */}
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

          {/* RFQ Info */}
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

        {/* Generate Button */}
        <GenerateButton
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          rfqData={rfqData}
        />

        {/* Response Editor */}
        <div
          ref={responseRef}
          className="bg-white rounded-lg shadow-sm border"
        >
          <ResponseEditor
            response={currentResponse}
            onUpdateResponse={handleUpdateResponse}
            isGenerating={isGenerating}
          />
        </div>
      </div>

      {/* Footer */}
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