import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Layout, Tabs, Typography } from 'antd';
import type { TabsProps } from 'antd';
import SchemaField from './components/SchemaField';
import JsonPreview from './components/JsonPreview';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

export type FieldDataType =
  | 'String'
  | 'Number'
  | 'Nested'
  | 'Boolean'
  | 'Float'
  | 'ObjectId'
  | 'Date'
  | 'Array';

export interface SchemaFieldData {
  key: string;
  type: FieldDataType;
  nestedFields?: SchemaFieldData[];
}

export type FormValues = {
  fields: SchemaFieldData[];
};

const App: React.FC = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      fields: [],
    },
  });

  const formData = methods.watch();

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Schema Builder',
      children: (
        <FormProvider {...methods}>
          <form>
            <SchemaField nestingLevel={0} fieldPath="fields" />
          </form>
        </FormProvider>
      ),
    },
    {
      key: '2',
      label: 'JSON Preview',
      children: <JsonPreview data={formData} />,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <Title level={3} style={{ color: '#001529', lineHeight: '64px', margin: 0 }}>
          📝 JSON Schema Builder
        </Title>
      </Header>
      <Content style={{ padding: '24px' }}>
        <div
          style={{
            background: '#fff',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <Tabs defaultActiveKey="1" items={items} />
        </div>
      </Content>
    </Layout>
  );
};

export default App;