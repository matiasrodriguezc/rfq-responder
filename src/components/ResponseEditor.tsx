import React, { useState, useRef, useEffect } from 'react';
import { Block, Response, FormField } from '../types';
import { Edit3, Trash2, GripVertical, Plus, FileText, Heading1, Heading2, Heading3, ClipboardList } from 'lucide-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd';

interface ResponseEditorProps {
  response: Response | null;
  onUpdateResponse: (response: Response) => void;
  isGenerating: boolean;
}

const ResponseEditor: React.FC<ResponseEditorProps> = ({ 
  response, 
  onUpdateResponse, 
  isGenerating 
}) => {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [editFormTitle, setEditFormTitle] = useState<string>('');
  const [editFormFields, setEditFormFields] = useState<FormField[]>([]);
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleEditBlock = (block: Block) => {
    setEditingBlockId(block.id);
    if (block.type === 'text' || block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
      setEditContent(block.content);
    } else if (block.type === 'form') {
      setEditFormTitle(block.title);
      setEditFormFields(block.fields.map(field => ({ ...field }))); // Copia segura
    }
  };

  const handleSaveEdit = () => {
    if (!response || !editingBlockId) return;

    const updatedBlocks = response.blocks.map(block => {
      if (block.id === editingBlockId) {
        if (block.type === 'text' || block.type === 'h1' || block.type === 'h2' || block.type === 'h3') {
          return { ...block, content: editContent };
        } else if (block.type === 'form') {
          return { ...block, title: editFormTitle, fields: editFormFields };
        }
      }
      return block;
    });

    onUpdateResponse({
      ...response,
      blocks: updatedBlocks,
      lastModified: new Date()
    });

    setEditingBlockId(null);
    setEditContent('');
    setEditFormTitle('');
    setEditFormFields([]);
  };

  const handleCancelEdit = () => {
    setEditingBlockId(null);
    setEditContent('');
    setEditFormTitle('');
    setEditFormFields([]);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!response) return;
    const updatedBlocks = response.blocks.filter(block => block.id !== blockId);
    onUpdateResponse({
      ...response,
      blocks: updatedBlocks,
      lastModified: new Date()
    });
  };

  const addNewBlock = (type: Block['type']) => {
    if (!response) return;

    const newBlock: Block = {
      id: `block_${Date.now()}`,
      type,
      order: response.blocks.length,
      ...(type === 'h1' || type === 'h2' || type === 'h3' 
        ? { content: 'New Heading' }
        : type === 'text'
        ? { content: 'New paragraph content...' }
        : {
            title: 'New Form Section',
            fields: [{
              id: `field_${Date.now()}`,
              label: 'Sample Field',
              type: 'text' as const,
              value: '',
              required: false,
              placeholder: 'Enter value...'
            }]
          })
    } as Block;

    onUpdateResponse({
      ...response,
      blocks: [...response.blocks, newBlock],
      lastModified: new Date()
    });

    setTimeout(() => {
      const el = blockRefs.current[newBlock.id];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !response) return;
    const reordered = Array.from(response.blocks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    const updatedBlocks = reordered.map((block, idx) => ({ ...block, order: idx }));

    onUpdateResponse({
      ...response,
      blocks: updatedBlocks,
      lastModified: new Date()
    });
  };

  const getBlockIcon = (type: Block['type']) => {
    switch (type) {
      case 'h1': return <Heading1 className="w-4 h-4" />;
      case 'h2': return <Heading2 className="w-4 h-4" />;
      case 'h3': return <Heading3 className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      case 'form': return <ClipboardList className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const renderBlock = (block: Block) => {
    const isEditing = editingBlockId === block.id;

    return (
      <div
        key={block.id}
        ref={(el) => {
          blockRefs.current[block.id] = el;
        }}
        className="group border border-gray-200 rounded-lg p-4 mb-4 hover:border-blue-300 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <GripVertical className="w-4 h-4 cursor-move" />
            {getBlockIcon(block.type)}
            <span className="capitalize font-medium">{block.type}</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            {!isEditing && (
              <button
                onClick={() => handleEditBlock(block)}
                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleDeleteBlock(block.id)}
              className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isEditing && (block.type === 'text' || block.type === 'h1' || block.type === 'h2' || block.type === 'h3') ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
              rows={block.type === 'text' ? 4 : 2}
              placeholder={`Enter ${block.type} content...`}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : isEditing && block.type === 'form' ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editFormTitle}
              onChange={(e) => setEditFormTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white text-gray-900"
              placeholder="Enter form title..."
            />
            <div className="space-y-3">
              {editFormFields.map((field, index) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={field.value}
                      onChange={(e) => {
                        const updated = [...editFormFields];
                        updated[index].value = e.target.value;
                        setEditFormFields(updated);
                      }}
                      placeholder={field.placeholder}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      rows={3}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => {
                        const updated = [...editFormFields];
                        updated[index].value = e.target.value;
                        setEditFormFields(updated);
                      }}
                      placeholder={field.placeholder}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            {block.type === 'h1' && <h1 className="text-2xl font-bold text-gray-800">{block.content}</h1>}
            {block.type === 'h2' && <h2 className="text-xl font-semibold text-gray-800">{block.content}</h2>}
            {block.type === 'h3' && <h3 className="text-lg font-medium text-gray-800">{block.content}</h3>}
            {block.type === 'text' && <p className="text-gray-700 leading-relaxed">{block.content}</p>}
            {block.type === 'form' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">{block.title}</h4>
                <div className="space-y-3">
                  {block.fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={field.value}
                          disabled
                          placeholder={field.placeholder}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900 bg-gray-100"
                          rows={3}
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={field.value}
                          disabled
                          placeholder={field.placeholder}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900 bg-gray-100"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Generating RFQ Response</h3>
        <p className="text-gray-600">AI is analyzing requirements and creating your proposal...</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <FileText className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Response Generated</h3>
        <p className="text-gray-600">Click "Generate Response" to create an AI-powered RFQ proposal.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">{response.title}</h2>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>Last modified: {new Date(response.lastModified).toLocaleDateString()}</span>
          <span className="capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {response.status}
          </span>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div
              className="space-y-4"
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              {response.blocks
                .sort((a, b) => a.order - b.order)
                .map((block, idx) => (
                  <Draggable key={block.id} draggableId={block.id} index={idx}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {renderBlock(block)}
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mt-8 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Add new block to your response:</p>
          <div className="text-gray-500 flex justify-center gap-2 flex-wrap">
            {[
              { type: 'h1' as const, label: 'Heading 1', icon: Heading1 },
              { type: 'h2' as const, label: 'Heading 2', icon: Heading2 },
              { type: 'h3' as const, label: 'Heading 3', icon: Heading3 },
              { type: 'text' as const, label: 'Paragraph', icon: FileText },
              { type: 'form' as const, label: 'Form', icon: ClipboardList }
            ].map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => addNewBlock(type)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors text-sm"
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseEditor;