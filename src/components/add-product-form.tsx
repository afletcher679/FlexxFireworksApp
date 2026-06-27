import { useState } from 'react';
import { ProductForm } from '../components/product-form';
import { Toast, type ToastType } from '../components/toast';

interface AddProductFormProps {
  onAddProduct: (product: {
    name: string;
    brand: string;
    category: string;
    price: string;
    description: string;
    duration_seconds: number;
    stock_quantity: number;
    effects: string[];
    video_url: string;
    image_url: string;
  }) => Promise<void>;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function AddProductForm({ onAddProduct, isOpen = true, onOpenChange }: AddProductFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('info');
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    description: '',
    duration_seconds: 0,
    stock_quantity: 0,
    effects: [] as string[],
    video_url: '',
    image_url: '',
  });

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      setToastMessage('Please fill in name, price, and category');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSaving(true);
    try {
      await onAddProduct(formData);
      setToastMessage('Product added successfully!');
      setToastType('success');
      setShowToast(true);
      setFormData({
        name: '',
        brand: '',
        category: '',
        price: '',
        description: '',
        duration_seconds: 0,
        stock_quantity: 0,
        effects: [],
        video_url: '',
        image_url: '',
      });
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch (error) {
      setToastMessage('Failed to add product');
      setToastType('error');
      setShowToast(true);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
      <ProductForm
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        isSubmitting={isSaving}
        mode="add"
        submitButtonText="Add Product"
        toastMessage={toastMessage}
        toastType={toastType}
        showToast={showToast}
        onToastDismiss={() => setShowToast(false)}
      />
  );
}
