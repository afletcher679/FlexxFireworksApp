import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { ProductForm } from '../components/product-form';

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
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      Alert.alert('Missing Information', 'Please fill in name, price, and category');
      return;
    }

    setIsSaving(true);
    try {
      await onAddProduct(formData);
      Alert.alert('Success', 'Product added successfully!');
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
        if (closeTimerRef.current) {
          clearTimeout(closeTimerRef.current);
        }

        closeTimerRef.current = setTimeout(() => {
          onOpenChange(false);
        }, 1200);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add product');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
      <ProductForm
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        isSubmitting={isSaving}
        mode="add"
        submitButtonText="Add Product"
      />
  );
}
