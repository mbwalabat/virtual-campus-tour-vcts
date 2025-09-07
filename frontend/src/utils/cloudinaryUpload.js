import Compressor from 'compressorjs';
import { uploadsAPI } from '../services/api.js';

// Compress image before upload
const compressImage = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality,
      maxWidth: 1920,
      maxHeight: 1080,
      convertSize: 1000000, // Convert to JPEG if larger than 1MB
      success: resolve,
      error: reject,
    });
  });
};

// Upload file directly to Cloudinary
const uploadToCloudinary = async (file, folder, resourceType = 'auto', onProgress) => {
  try {
    // Get signed upload parameters
    const sigRes = await uploadsAPI.getSignature(folder);
    const { signature, timestamp, cloudName, apiKey } = sigRes.data.data;
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('folder', folder);
    formData.append('signature', signature);
    
    // Upload to Cloudinary
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Upload multiple images with compression
export const uploadImages = async (files, onProgress) => {
  const uploadPromises = files.map(async (file, index) => {
    try {
      // Compress image
      const compressedFile = await compressImage(file);
      
      // Upload to Cloudinary
      const url = await uploadToCloudinary(
        compressedFile, 
        'locations/images', 
        'image',
        (progress) => {
          if (onProgress) {
            onProgress(`Uploading image ${index + 1}/${files.length}... ${Math.round(progress)}%`);
          }
        }
      );
      
      return url;
    } catch (error) {
      console.error(`Error uploading image ${index + 1}:`, error);
      throw error;
    }
  });
  
  return Promise.all(uploadPromises);
};

// Upload single audio file
export const uploadAudio = async (file, onProgress) => {
  try {
    if (onProgress) onProgress('Uploading audio...');
    
    const url = await uploadToCloudinary(
      file, 
      'locations/audio', 
      'video', // Cloudinary treats audio as video resource type
      (progress) => {
        if (onProgress) {
          onProgress(`Uploading audio... ${Math.round(progress)}%`);
        }
      }
    );
    
    return url;
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw error;
  }
};

// Upload single video file
export const uploadVideo = async (file, onProgress) => {
  try {
    if (onProgress) onProgress('Uploading video...');
    
    const url = await uploadToCloudinary(
      file, 
      'locations/video', 
      'video',
      (progress) => {
        if (onProgress) {
          onProgress(`Uploading video... ${Math.round(progress)}%`);
        }
      }
    );
    
    return url;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

// Upload 360° panorama image
export const upload360Image = async (file, onProgress) => {
  try {
    if (onProgress) onProgress('Uploading 360° image...');
    
    // Compress 360° image
    const compressedFile = await compressImage(file, 0.9); // Higher quality for 360°
    
    const url = await uploadToCloudinary(
      compressedFile, 
      'locations/view360', 
      'image',
      (progress) => {
        if (onProgress) {
          onProgress(`Uploading 360° image... ${Math.round(progress)}%`);
        }
      }
    );
    
    return url;
  } catch (error) {
    console.error('Error uploading 360° image:', error);
    throw error;
  }
};
