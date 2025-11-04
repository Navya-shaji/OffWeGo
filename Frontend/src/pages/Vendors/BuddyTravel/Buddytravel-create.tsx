import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, FileText, Tag, Plus, X,  DollarSign } from 'lucide-react';
import { addBuddyTravel } from '@/services/BuddyTravel/buddytravelService';
import { getCategory } from '@/services/category/categoryService';
import { fetchAllDestinations } from '@/services/Destination/destinationService';

import { buddyTravelSchema } from '@/Types/vendor/Package/BuddyTravel';

const AddBuddyTravelPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    destination: '',
    startDate: '',
    endDate: '',
    price: '',
    maxPeople: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingDestinations, setLoadingDestinations] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCategories(true);
        const categoryResponse = await getCategory(1, 100);
        setCategories(categoryResponse.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoadingCategories(false);
      }

      try {
        setLoadingDestinations(true);
        const destinationResponse = await fetchAllDestinations(1, 100);
        setDestinations(destinationResponse.destinations || []);
      } catch (err) {
        console.error('Error fetching destinations:', err);
      } finally {
        setLoadingDestinations(false);
      }
    };
    fetchData();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };


  const validateWithZod = (data: typeof formData) => {
    const result = buddyTravelSchema.safeParse(data);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) formattedErrors[err.path[0] as string] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
    setErrors({});
    return true;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateWithZod(formData)) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        maxPeople: parseInt(formData.maxPeople),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };


      const result = await addBuddyTravel(payload);
 

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          title: '',
          description: '',
          category: '',
          destination: '',
          startDate: '',
          endDate: '',
          price: '',
          maxPeople: '',
        });
      }, 2000);
    } catch (error: any) {
      console.error('❌ Error creating buddy travel:', error);
      setErrors({ submit: error.message || 'Failed to add buddy travel. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      destination: '',
      startDate: '',
      endDate: '',
      price: '',
      maxPeople: '',
    });
    setErrors({});
    setSubmitSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Buddy Travel</h1>
          <p className="text-gray-600">Connect with fellow travelers and explore together</p>
        </div>

        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">
            Buddy travel added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
          {/* 🔹 Title */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2 text-indigo-600" /> Travel Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Weekend Trek to Munnar Hills"
              className={`w-full px-4 py-3 border ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* 🔹 Category */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Tag className="w-4 h-4 mr-2 text-indigo-600" /> Category
            </label>
            {loadingCategories ? (
              <p className="text-gray-500">Loading categories...</p>
            ) : (
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
            {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
          </div>

          {/* 🔹 Destination */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mr-2 text-indigo-600" /> Destination
            </label>
            {loadingDestinations ? (
              <p className="text-gray-500">Loading destinations...</p>
            ) : (
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.destination ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="">Select a destination</option>
                {destinations.map(dest => (
                  <option key={dest._id} value={dest._id}>
                    {dest.name}
                  </option>
                ))}
              </select>
            )}
            {errors.destination && <p className="text-sm text-red-600 mt-1">{errors.destination}</p>}
          </div>

          {/* 🔹 Price & Max People */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 mr-2 text-indigo-600" /> Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 5000"
                className={`w-full px-4 py-3 border ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Users className="w-4 h-4 mr-2 text-indigo-600" /> Max People
              </label>
              <input
                type="number"
                name="maxPeople"
                value={formData.maxPeople}
                onChange={handleChange}
                placeholder="e.g., 10"
                className={`w-full px-4 py-3 border ${
                  errors.maxPeople ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.maxPeople && <p className="text-sm text-red-600 mt-1">{errors.maxPeople}</p>}
            </div>
          </div>

          {/* 🔹 Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-indigo-600" /> Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.startDate ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.startDate && <p className="text-sm text-red-600 mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-indigo-600" /> End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.endDate ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.endDate && <p className="text-sm text-red-600 mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* 🔹 Description */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2 text-indigo-600" /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your travel plan..."
              className={`w-full px-4 py-3 border ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none`}
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* 🔹 Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              {isSubmitting ? 'Creating...' : <><Plus className="w-5 h-5 mr-2" /> Create Buddy Travel</>}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5 inline mr-2" /> Reset
            </button>
          </div>

          {errors.submit && <p className="mt-4 text-sm text-red-600">{errors.submit}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddBuddyTravelPage;
