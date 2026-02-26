export const uploadToCloudinary = async (imageUri: string): Promise<string> => {
  const formData = new FormData();
  
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);
  
  formData.append('upload_preset', process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  
  if (!response.ok) throw new Error('Failed to upload image');
  
  const data = await response.json();
  return data.secure_url;
};
