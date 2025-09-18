import React, { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import api from '../../config/api';
import toast from 'react-hot-toast';

const CourseForm = ({ onSuccess, course = null, onCancel }) => {
  const [formData, setFormData] = useState({
    category: course?.category || '',
    courseCode: course?.courseCode || '',
    courseName: course?.courseName || '',
    subtitle: course?.subtitle || '',
    description: course?.description || '',
    details: course?.details || '',
    preview: course?.preview || '',
    duration: course?.duration || '',
    instructor: course?.instructor || '',
    'fees.original': course?.fees?.original || '',
    'fees.discounted': course?.fees?.discounted || '',
    skills: course?.skills?.join(', ') || '',
    eligibility: course?.eligibility?.join(', ') || '',
    benefits: course?.benefits?.join(', ') || '',
    features: course?.features?.join(', ') || ''
  });
  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);
  const [syllabus, setSyllabus] = useState(course?.syllabus || [{ module: '', topics: '', duration: '' }]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (file, type) => {
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const response = await api.post('/api/courses/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url;
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
      return null;
    }
  };

  const handleSyllabusChange = (index, field, value) => {
    const newSyllabus = [...syllabus];
    if (field === 'topics') {
      newSyllabus[index][field] = value.split(',').map(topic => topic.trim());
    } else {
      newSyllabus[index][field] = value;
    }
    setSyllabus(newSyllabus);
  };

  const addSyllabusModule = () => {
    setSyllabus([...syllabus, { module: '', topics: '', duration: '' }]);
  };

  const removeSyllabusModule = (index) => {
    setSyllabus(syllabus.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = course?.image || '';
      let bannerUrl = course?.banner || '';

      // Upload images if new ones are selected
      if (image) {
        imageUrl = await handleImageUpload(image, 'image');
        if (!imageUrl) {
          setLoading(false);
          return;
        }
      }

      if (banner) {
        bannerUrl = await handleImageUpload(banner, 'banner');
        if (!bannerUrl) {
          setLoading(false);
          return;
        }
      }

      // Prepare course data
      const courseData = {
        category: formData.category,
        courseCode: formData.courseCode,
        courseName: formData.courseName,
        subtitle: formData.subtitle,
        description: formData.description,
        details: formData.details,
        preview: formData.preview,
        duration: formData.duration,
        instructor: formData.instructor,
        image: imageUrl,
        banner: bannerUrl,
        fees: {
          original: parseFloat(formData['fees.original']) || 0,
          discounted: parseFloat(formData['fees.discounted']) || 0,
          currency: 'Rs.'
        },
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        eligibility: formData.eligibility.split(',').map(item => item.trim()).filter(item => item),
        benefits: formData.benefits.split(',').map(benefit => benefit.trim()).filter(benefit => benefit),
        features: formData.features.split(',').map(feature => feature.trim()).filter(feature => feature),
        syllabus: syllabus.filter(module => module.module.trim())
      };

      let response;
      if (course) {
        // Update existing course
        response = await api.put(`/api/courses/${course.courseCode}`, courseData);
        toast.success('Course updated successfully!');
      } else {
        // Create new course
        response = await api.post('/api/courses', courseData);
        toast.success('Course created successfully!');
      }

      if (onSuccess) onSuccess();
      if (onCancel) onCancel();

      // Reset form if creating new course
      if (!course) {
        setFormData({
          category: '',
          courseCode: '',
          courseName: '',
          subtitle: '',
          description: '',
          details: '',
          preview: '',
          duration: '',
          instructor: '',
          'fees.original': '',
          'fees.discounted': '',
          skills: '',
          eligibility: '',
          benefits: '',
          features: ''
        });
        setSyllabus([{ module: '', topics: '', duration: '' }]);
        setImage(null);
        setBanner(null);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(error.response?.data?.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Programming, Design"
            required
          />
        </div>
        <div>
          <label className="form-label">Course Code</label>
          <input
            type="text"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., REACT-101"
            required
          />
        </div>
      </div>

      <div>
        <label className="form-label">Course Name</label>
        <input
          type="text"
          name="courseName"
          value={formData.courseName}
          onChange={handleChange}
          className="form-input"
          placeholder="e.g., Complete React Development"
          required
        />
      </div>

      <div>
        <label className="form-label">Subtitle</label>
        <input
          type="text"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          className="form-input"
          placeholder="Brief course subtitle"
        />
      </div>

      <div>
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="form-input"
          placeholder="Course description"
        />
      </div>

      <div>
        <label className="form-label">Details</label>
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          rows={4}
          className="form-input"
          placeholder="Detailed course information"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., 8 weeks"
          />
        </div>
        <div>
          <label className="form-label">Instructor</label>
          <input
            type="text"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            className="form-input"
            placeholder="Instructor name"
          />
        </div>
      </div>

      <div>
        <label className="form-label">Preview URL</label>
        <input
          type="url"
          name="preview"
          value={formData.preview}
          onChange={handleChange}
          className="form-input"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Original Price (Rs.)</label>
          <input
            type="number"
            name="fees.original"
            value={formData['fees.original']}
            onChange={handleChange}
            className="form-input"
            placeholder="10000"
          />
        </div>
        <div>
          <label className="form-label">Discounted Price (Rs.)</label>
          <input
            type="number"
            name="fees.discounted"
            value={formData['fees.discounted']}
            onChange={handleChange}
            className="form-input"
            placeholder="8000"
          />
        </div>
      </div>

      <div>
        <label className="form-label">Skills (comma-separated)</label>
        <textarea
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          rows={2}
          className="form-input"
          placeholder="React, JavaScript, HTML, CSS"
        />
      </div>

      <div>
        <label className="form-label">Eligibility (comma-separated)</label>
        <textarea
          name="eligibility"
          value={formData.eligibility}
          onChange={handleChange}
          rows={2}
          className="form-input"
          placeholder="Basic programming knowledge, Computer with internet"
        />
      </div>

      <div>
        <label className="form-label">Benefits (comma-separated)</label>
        <textarea
          name="benefits"
          value={formData.benefits}
          onChange={handleChange}
          rows={2}
          className="form-input"
          placeholder="Industry-ready skills, Certificate, Job assistance"
        />
      </div>

      <div>
        <label className="form-label">Features (comma-separated)</label>
        <textarea
          name="features"
          value={formData.features}
          onChange={handleChange}
          rows={2}
          className="form-input"
          placeholder="Live sessions, Recorded videos, Assignments"
        />
      </div>

      {/* Syllabus Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="form-label">Syllabus</label>
          <button
            type="button"
            onClick={addSyllabusModule}
            className="flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Module
          </button>
        </div>
        {syllabus.map((module, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Module {index + 1}</span>
              {syllabus.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSyllabusModule(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Module name"
                value={module.module}
                onChange={(e) => handleSyllabusChange(index, 'module', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Topics (comma-separated)"
                value={Array.isArray(module.topics) ? module.topics.join(', ') : module.topics}
                onChange={(e) => handleSyllabusChange(index, 'topics', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Duration"
                value={module.duration}
                onChange={(e) => handleSyllabusChange(index, 'duration', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Image Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Course Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                  <span>Upload image</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
              {image && <p className="text-sm text-green-600">{image.name}</p>}
            </div>
          </div>
        </div>

        <div>
          <label className="form-label">Banner Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                  <span>Upload banner</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => setBanner(e.target.files[0])}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
              {banner && <p className="text-sm text-green-600">{banner.name}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;