import { useState, useContext } from "react";
import {
  X,
  MapPin,
  Building,
  Type,
  FileText,
  Image,
  Mic,
  Globe,
  Video,
  Upload,
  CheckCircle,
} from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';
import { uploadImages, uploadAudio, uploadVideo, upload360Image } from '../../utils/cloudinaryUpload';

const LocationModal = ({ location, onSave, onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: location?.name || "",
    category: location?.category || "academic",
    department: location?.department || "",
    description: location?.description || "",
    latitude: location?.coordinates?.latitude || "",
    longitude: location?.coordinates?.longitude || "",
    images: location?.images || [],
    audio: location?.audio || null,
    video: location?.video || null,
    view360: location?.view360 || null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState('');
  const [uploadStatus, setUploadStatus] = useState({});

  const categories = [
    { value: "academic", label: "Academic" },
    { value: "administration", label: "Administration" },
    { value: "research", label: "Research" },
    { value: "accommodation", label: "Accommodation" },
    { value: "dining", label: "Dining" },
    { value: "recreation", label: "Recreation" },
    { value: "events", label: "Events" },
  ];

  const departments = [
    "Administration",
    "Computer Science",
    "Agriculture",
    "Library",
    "Hostels",
    "Food Technology",
    "Animal Husbandry",
    "Plant Breeding & Genetics",
    "Agricultural Engineering",
    "Economics & Management",
    "Sports",
    "Events",
    "Dining Services",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Location name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    else if (formData.description.trim().length < 20)
      newErrors.description = "Description must be at least 20 characters";
    if (!formData.latitude) newErrors.latitude = "Latitude is required";
    if (!formData.longitude) newErrors.longitude = "Longitude is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
      setUploadStatus(prev => ({ ...prev, images: 'pending' }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      setUploadStatus(prev => ({ ...prev, [name]: 'pending' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Upload files to Cloudinary and return URLs
  const uploadFiles = async () => {
    const uploadData = { ...formData };
    
    try {
      // Upload images
      if (formData.images && formData.images.length > 0) {
        setUploadProgress('Compressing and uploading images...');
        setUploadStatus(prev => ({ ...prev, images: 'uploading' }));
        
        const imageUrls = await uploadImages(formData.images, setUploadProgress);
        uploadData.imageUrls = imageUrls;
        uploadData.images = []; // Clear file objects
        
        setUploadStatus(prev => ({ ...prev, images: 'completed' }));
      }
      
      // Upload audio
      if (formData.audio) {
        setUploadProgress('Uploading audio...');
        setUploadStatus(prev => ({ ...prev, audio: 'uploading' }));
        
        const audioUrl = await uploadAudio(formData.audio, setUploadProgress);
        uploadData.audioUrl = audioUrl;
        uploadData.audio = null; // Clear file object
        
        setUploadStatus(prev => ({ ...prev, audio: 'completed' }));
      }
      
      // Upload video
      if (formData.video) {
        setUploadProgress('Uploading video...');
        setUploadStatus(prev => ({ ...prev, video: 'uploading' }));
        
        const videoUrl = await uploadVideo(formData.video, setUploadProgress);
        uploadData.videoUrl = videoUrl;
        uploadData.video = null; // Clear file object
        
        setUploadStatus(prev => ({ ...prev, video: 'completed' }));
      }
      
      // Upload 360° image
      if (formData.view360) {
        setUploadProgress('Uploading 360° image...');
        setUploadStatus(prev => ({ ...prev, view360: 'uploading' }));
        
        const view360Url = await upload360Image(formData.view360, setUploadProgress);
        uploadData.view360Url = view360Url;
        uploadData.view360 = null; // Clear file object
        
        setUploadStatus(prev => ({ ...prev, view360: 'completed' }));
      }
      
      setUploadProgress('Upload completed!');
      return uploadData;
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(`Upload failed: ${error.message}`);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setUploadProgress('');
    
    try {
      // Upload files to Cloudinary first
      const uploadData = await uploadFiles();
      
      // Then save location with URLs
      await onSave(uploadData);
    } catch (error) {
      console.error("Error saving location:", error);
      alert(error.message || "Failed to save location");
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {location ? "Edit Location" : "Add New Location"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Location Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <MapPin className="inline w-4 h-4 mr-1 text-gray-500" />
              Location Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter location name"
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <Type className="inline w-4 h-4 mr-1 text-gray-500" />
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <Building className="inline w-4 h-4 mr-1 text-gray-500" />
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                errors.department ? "border-red-500" : "border-gray-300"
              }`}
              disabled={user?.role === 'departmentAdmin'}
            >
              <option value="">Select Department</option>
              {user?.role === 'departmentAdmin'
                ? (
                  <>
                    {/* Always show the current department so it displays when editing */}
                    {formData.department && (
                      <option value={formData.department}>{formData.department}</option>
                    )}
                    {/* Fallback to user's department if empty */}
                    {!formData.department && user.department && (
                      <option value={user.department}>{user.department}</option>
                    )}
                  </>
                )
                : departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
            </select>
            {errors.department && (
              <p className="text-red-500 text-xs mt-1">{errors.department}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <FileText className="inline w-4 h-4 mr-1 text-gray-500" />
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
                maxLength={500}

              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a detailed description"
              className={`w-full rounded-lg border px-3 py-2 text-sm resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description ? (
                <p className="text-red-500 text-xs">{errors.description}</p>
              ) : (
                <p className="text-gray-500 text-xs">
                  Provide a comprehensive description
                </p>
              )}
              <span className="text-xs text-gray-400">
                {formData.description.length}/500
              </span>
            </div>
          </div>

          {/* Latitude */}
          <div>
            <label
              htmlFor="latitude"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Latitude
            </label>
            <input
              type="number"
              step="any"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Enter latitude"
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                errors.latitude ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.latitude && (
              <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
            )}
          </div>

          {/* Longitude */}
          <div>
            <label
              htmlFor="longitude"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Longitude
            </label>
            <input
              type="number"
              step="any"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Enter longitude"
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                errors.longitude ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.longitude && (
              <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>
            )}
          </div>

          {/* File Uploads */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Image className="inline w-4 h-4 mr-1 text-gray-500" />
              Gallery Images (multiple)
              {uploadStatus.images === 'completed' && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
              {uploadStatus.images === 'uploading' && <Upload className="inline w-4 h-4 ml-2 text-blue-500 animate-spin" />}
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Upload up to 5 photos for this location gallery.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mic className="inline w-4 h-4 mr-1 text-gray-500" />
              Audio Narration (single)
              {uploadStatus.audio === 'completed' && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
              {uploadStatus.audio === 'uploading' && <Upload className="inline w-4 h-4 ml-2 text-blue-500 animate-spin" />}
            </label>
            <input
              type="file"
              name="audio"
              accept="audio/*"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">MP3/WAV recommended. Re-upload to replace.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Video className="inline w-4 h-4 mr-1 text-gray-500" />
              360° Video (single)
              {uploadStatus.video === 'completed' && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
              {uploadStatus.video === 'uploading' && <Upload className="inline w-4 h-4 ml-2 text-blue-500 animate-spin" />}
            </label>
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Upload an equirectangular 360 video for immersive view. Re-upload to replace.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Globe className="inline w-4 h-4 mr-1 text-gray-500" />
              360° Panorama Image (single)
              {uploadStatus.view360 === 'completed' && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
              {uploadStatus.view360 === 'uploading' && <Upload className="inline w-4 h-4 ml-2 text-blue-500 animate-spin" />}
            </label>
            <input
              type="file"
              name="view360"
              accept="image/*,.mp4,.webm"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Upload a 360 equirectangular image for fallback if no video.</p>
          </div>

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center">
                <Upload className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm text-blue-700">{uploadProgress}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 px-4 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-70"
            >
              {loading ? "Saving..." : location ? "Update Location" : "Create Location"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationModal;
