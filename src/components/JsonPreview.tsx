import React from 'react';
import { Card } from 'antd';
import { FieldDataType, SchemaFieldData } from '../App';

interface JsonPreviewProps {
  data: { fields?: SchemaFieldData[] };
}

const generateJson = (fields: SchemaFieldData[] = []): Record<string, any> => {
  return fields.reduce((acc, field) => {
    if (!field.key) return acc;

    switch (field.type) {
      case 'String':
        acc[field.key] = 'String';
        break;
      case 'Number':
        acc[field.key] = 'Number';
        break;
      case 'Nested':
        acc[field.key] = field.nestedFields ? generateJson(field.nestedFields) : {};
        break;
      case 'Boolean':
        acc[field.key] = false;
        break;
      case 'Float':
        acc[field.key] = 0.0;
        break;
      case 'ObjectId':
        acc[field.key] = 'ObjectId()';
        break;
      case 'Date':
        acc[field.key] = new Date().toISOString();
        break;
      case 'Array':
        acc[field.key] = [];
        break;
      default:
        break;
    }
    return acc;
  }, {} as Record<string, any>);
};

const JsonPreview: React.FC<JsonPreviewProps> = ({ data }) => {
  const jsonOutput = generateJson(data.fields);

  return (
    <Card title="Live JSON Output" bordered={false}>
      <pre
        style={{
          background: '#282c34',
          color: '#abb2bf',
          padding: '20px',
          borderRadius: '8px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowX: 'auto',
          maxHeight: '500px',
          overflowY: 'auto',
        }}
      >
        {JSON.stringify(jsonOutput, null, 2)}
      </pre>
    </Card>
  );
};

export default JsonPreview;