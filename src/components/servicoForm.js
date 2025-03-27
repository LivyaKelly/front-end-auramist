'use client';
import { useState } from 'react';
import { Form, Input, InputNumber, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadImageToApi } from '@/utils/uploadImageToApi';


export default function ServicoForm({ onSuccess }) {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const onFinish = async (values) => {
      try {
        setLoading(true);
        const file = fileList[0]?.originFileObj;
  
        if (!file) {
          message.error('Selecione uma imagem.');
          return;
        }
  
        const imageUrl = await uploadImageToApi(file);
  
        const res = await fetch('http://localhost:3001/api/services', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name,
            description: values.description,
            duration: values.duration,
            price: values.price,
            urlImage: imageUrl,
          }),
        });
  
        if (!res.ok) throw new Error('Erro ao criar serviço');
  
        message.success('Serviço criado com sucesso!');
        form.resetFields();
        setFileList([]);
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error(error);
        message.error('Erro ao criar serviço.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="name" label="Nome do serviço" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
  
        <Form.Item name="description" label="Descrição">
          <Input.TextArea />
        </Form.Item>
  
        <Form.Item name="duration" label="Duração (minutos)" rules={[{ required: true }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
  
        <Form.Item name="price" label="Preço (R$)" rules={[{ required: true }]}>
          <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
        </Form.Item>
  
        <Form.Item label="Imagem do serviço" required>
          <Upload
            accept="image/*"
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            <Button icon={<UploadOutlined />}>Selecionar imagem</Button>
          </Upload>
        </Form.Item>
  
        <Button type="primary" htmlType="submit" loading={loading}>
          Criar Serviço
        </Button>
      </Form>
    );
  }
  