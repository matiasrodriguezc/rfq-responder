// src/types/index.ts

export type BlockType = 'h1' | 'h2' | 'h3' | 'text' | 'form';

export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
}

export interface HeadingBlock extends BaseBlock {
  type: 'h1' | 'h2' | 'h3';
  content: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'textarea';
  value: string;
  required: boolean;
  placeholder?: string;
}

export interface FormBlock extends BaseBlock {
  type: 'form';
  title: string;
  fields: FormField[];
}

export type Block = HeadingBlock | TextBlock | FormBlock;

export interface Response {
  id: string;
  title: string;
  rfqId: string;
  entityId: string;
  blocks: Block[];
  createdAt: Date;
  lastModified: Date;
  status: 'draft' | 'review' | 'submitted';
}

export interface RFQData {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  requirements: string[];
  documents: RFQDocument[];
}

export interface RFQDocument {
  id: string;
  title: string;
  type: string;
  content: string;
  summary: string;
}

export interface EntityData {
  id: string;
  name: string;
  cageCode: string;
  taxId: string;
  address: string;
  capabilities: string[];
  naicsCodes: string[];
  preferences: {
    contractTypes: string[];
    projectSizeMax: number;
    regions: string[];
  };
}