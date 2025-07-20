import React from 'react';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { Input, Select, Button, Space, Form } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { FieldDataType } from '../App';

const { Option } = Select;

interface SchemaFieldProps {
  nestingLevel: number;
  fieldPath: string;
}

const SchemaField: React.FC<SchemaFieldProps> = ({ nestingLevel, fieldPath }) => {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldPath,
  });

  const fieldVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -300, transition: { duration: 0.3 } },
  };

  return (
    <div style={{ marginLeft: nestingLevel > 0 ? '20px' : '0' }}>
      <AnimatePresence>
        {fields.map((field, index) => {
          const currentFieldPath = `${fieldPath}.${index}`;
          const fieldType = watch(`${currentFieldPath}.type`);

          return (
            <motion.div
              key={field.id}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              style={{ marginBottom: '16px' }}
            >
              <Space align="start" style={{ width: '100%' }}>
                <Controller
                  name={`${currentFieldPath}.key`}
                  control={control}
                  defaultValue=""
                  render={({ field, fieldState }) => (
                    <Form.Item
                      validateStatus={fieldState.error ? 'error' : ''}
                      help={fieldState.error?.message}
                      style={{ marginBottom: 0 }}
                    >
                      <Input
                        {...field}
                        placeholder="Field Name"
                        style={{ minWidth: '200px' }}
                      />
                    </Form.Item>
                  )}
                  rules={{
                    required: 'Field name is required',
                    pattern: {
                      value: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                      message: 'Invalid field name (must start with letter or underscore)',
                    },
                  }}
                />

                <Controller
                  name={`${currentFieldPath}.type`}
                  control={control}
                  defaultValue="String"
                  render={({ field }) => (
                    <Select {...field} style={{ width: '120px' }}>
                      <Option value="String">String</Option>
                      <Option value="Number">Number</Option>
                      <Option value="Boolean">Boolean</Option>
                      <Option value="Float">Float</Option>
                      <Option value="ObjectId">ObjectId</Option>
                      <Option value="Date">Date</Option>
                      <Option value="Array">Array</Option>
                      <Option value="Nested">Nested</Option>
                    </Select>
                  )}
                />

                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => remove(index)}
                />
              </Space>

              {(fieldType === 'Nested' || fieldType === 'Array') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    paddingLeft: '20px',
                    borderLeft: '2px solid #f0f0f0',
                    marginTop: '16px',
                  }}
                >
                  <SchemaField
                    nestingLevel={nestingLevel + 1}
                    fieldPath={`${currentFieldPath}.nestedFields`}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      <Button
        type="dashed"
        onClick={() => append({ key: '', type: 'String', nestedFields: [] })}
        icon={<PlusOutlined />}
        style={{ marginTop: '16px' }}
      >
        Add Field
      </Button>
    </div>
  );
};

export default SchemaField;