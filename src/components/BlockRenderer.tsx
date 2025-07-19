// BlockRenderer.tsx
import { Block } from './blockTypes';

// BlockRenderer.tsx
export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'H1':
      return <h1 className="text-4xl font-bold mb-4">{block.content}</h1>;
    case 'H2':
      return <h2 className="text-2xl font-semibold mb-3">{block.content}</h2>;
    case 'Text':
      return <p className="text-base mb-2">{block.content}</p>;
    case 'Form':
      const items = block.content.split('\n').filter(Boolean);
      return (
        <div className="border rounded p-4 bg-gray-50 mb-4">
          <h3 className="font-semibold mb-2">Formulario:</h3>
          <ul className="list-disc ml-5 space-y-1">
            {items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      );
    default:
      return null;
  }
}