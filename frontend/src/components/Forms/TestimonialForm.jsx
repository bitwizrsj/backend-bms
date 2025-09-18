import React, { useState } from 'react';
import { Star } from 'lucide-react';
import api from '../../config/api';
import toast from 'react-hot-toast';

const TestimonialForm = ({ onSuccess, testimonial = null, onCancel }) => {
  const [formData, setFormData] = useState({
    text: testimonial?.text || '',
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    rating: testimonial?.rating || 5,
    isFeatured: testimonial?.isFeatured || false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (testimonial) {
        // Update existing testimonial
        response = await api.put(`/api/testimonials/${testimonial._id}`, formData);
        toast.success('Testimonial updated successfully!');
      } else {
        // Create new testimonial
        response = await api.post('/api/testimonials', formData);
        toast.success('Testimonial created successfully!');
      }

      if (onSuccess) onSuccess();
      if (onCancel) onCancel();

      // Reset form if creating new testimonial
      if (!testimonial) {
        setFormData({
          text: '',
          name: '',
          role: '',
          rating: 5,
          isFeatured: false
        });
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error(error.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Testimonial Text</label>
        <textarea
          name="text"
          value={formData.text}
          onChange={handleChange}
          rows={4}
          className="form-input"
          placeholder="Enter the testimonial text..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Student name"
            required
          />
        </div>
        <div>
          <label className="form-label">Role/Position</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Software Developer, Student"
            required
          />
        </div>
      </div>

      <div>
        <label className="form-label">Rating</label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className={`p-1 rounded ${
                star <= formData.rating
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              } hover:text-yellow-400 transition-colors`}
            >
              <Star className="h-6 w-6 fill-current" />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {formData.rating} star{formData.rating !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isFeatured"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
          Featured testimonial
        </label>
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
          {loading ? 'Saving...' : testimonial ? 'Update Testimonial' : 'Add Testimonial'}
        </button>
      </div>
    </form>
  );
};

export default TestimonialForm;