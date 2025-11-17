import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, FileText, Tag, Plus, X, IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';
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
        toast.error('Failed to load categories. Please refresh the page.');
      } finally {
        setLoadingCategories(false);
      }

      try {
        setLoadingDestinations(true);
        const destinationResponse = await fetchAllDestinations(1, 100);
        setDestinations(destinationResponse.destinations || []);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        toast.error('Failed to load destinations. Please refresh the page.');
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
      result.error.issues.forEach(err => {
        if (err.path && err.path.length > 0) {
          formattedErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(formattedErrors);
      
      // Show first validation error as toast
      const firstError = result.error.issues[0];
      if (firstError) {
        toast.error(firstError.message);
      }
      
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

      // Success toast
      toast.success('Buddy travel created successfully! 🎉');
      
      // Reset form after success
      setTimeout(() => {
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
      }, 1000);
      
    } catch (error: any) {
      console.error('❌ Error creating buddy travel:', error);
      
      // Handle specific error messages
      if (error.message?.includes('only up to 3')) {
        toast.error('You can only create up to 3 total listings (packages + buddy trips)');
      } else if (error.message?.includes('Missing required fields')) {
        toast.error('Please fill in all required fields');
      } else if (error.message?.includes('Network')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(error.message || 'Failed to create buddy travel. Please try again.');
      }
      
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
    toast.info('Form has been reset');
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-xl sm:text-5xl font-bold text-gray-900 mb-2">Create Buddy Travel</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8 space-y-6 border border-gray-200"
        >
          {/* Travel Title */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" /> Travel Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Weekend Trek to Munnar Hills"
              className={`w-full px-5 py-3 border ${
                errors.title ? 'border-red-400' : 'border-gray-300'
              } rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Category & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Tag className="w-5 h-5 mr-2 text-indigo-600" /> Category
              </label>
              {loadingCategories ? (
                <p className="text-gray-500">Loading categories...</p>
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 border ${
                    errors.category ? 'border-red-400' : 'border-gray-300'
                  } rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
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

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-5 h-5 mr-2 text-indigo-600" /> Destination
              </label>
              {loadingDestinations ? (
                <p className="text-gray-500">Loading destinations...</p>
              ) : (
                <select
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 border ${
                    errors.destination ? 'border-red-400' : 'border-gray-300'
                  } rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
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
          </div>

          {/* Price & Max People */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <IndianRupee className="w-5 h-5 mr-2 text-indigo-600" /> Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="5000"
                className={`w-full px-5 py-3 border ${
                  errors.price ? 'border-red-400' : 'border-gray-300'
                } rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
              />
              {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Users className="w-5 h-5 mr-2 text-indigo-600" /> Max People
              </label>
              <input
                type="number"
                name="maxPeople"
                value={formData.maxPeople}
                onChange={handleChange}
                placeholder="10"
                className={`w-full px-5 py-3 border ${
                  errors.maxPeople ? 'border-red-400' : 'border-gray-300'
                } rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
              />
              {errors.maxPeople && <p className="text-sm text-red-600 mt-1">{errors.maxPeople}</p>}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['startDate', 'endDate'].map(date => (
              <div key={date}>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-5 h-5 mr-2 text-indigo-600" /> {date === 'startDate' ? 'Start Date' : 'End Date'}
                </label>
                <input
                  type="date"
                  name={date}
                  value={formData[date]}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 border ${
                    errors[date] ? 'border-red-400' : 'border-gray-300'
                  } rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition`}
                />
                {errors[date] && <p className="text-sm text-red-600 mt-1">{errors[date]}</p>}
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your travel plan..."
              className={`w-full px-5 py-3 border ${
                errors.description ? 'border-red-400' : 'border-gray-300'
              } rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none transition`}
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : <><Plus className="w-5 h-5 mr-2" /> Create Buddy Travel</>}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5 mr-2" /> Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBuddyTravelPage;