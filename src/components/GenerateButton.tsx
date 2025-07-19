import React from 'react';
import { Wand2, FileCheck, Clock, DollarSign } from 'lucide-react';

interface GenerateButtonProps {
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  rfqData?: {
    title: string;
    deadline: string;
    estimatedValue: string;
    requirements: number;
  };
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ 
  onGenerate, 
  isGenerating, 
  rfqData 
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
      {/* RFQ Overview */}
      {rfqData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Current RFQ</h3>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-800 mb-3">{rfqData.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-gray-600">Deadline:</span>
                <span className="font-medium text-gray-800">{rfqData.deadline}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">Value:</span>
                <span className="font-medium text-gray-800">{rfqData.estimatedValue}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600">Requirements:</span>
                <span className="font-medium text-gray-800">{rfqData.requirements} items</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Section */}
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Wand2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            AI-Powered RFQ Response Generator
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Let our AI analyze the RFQ requirements and automatically generate a comprehensive, 
            compliant response tailored to your company's capabilities.
          </p>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`
            px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200
            ${isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Generating Response...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Generate Response
            </span>
          )}
        </button>

        {/* What the AI will do */}
        <div className="mt-6 p-4 bg-white/70 rounded-lg">
          <p className="text-sm text-gray-600 font-medium mb-2">What our AI will do:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Analyze RFQ requirements
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Match company capabilities
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Generate technical specifications
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Create required forms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateButton;
