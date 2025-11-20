import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, X, IndianRupee, Clock, Hotel, Zap, List } from 'lucide-react';
import { toast } from 'react-toastify';
import { addBuddyTravel } from '@/services/BuddyTravel/buddytravelService';
import { getCategory } from '@/services/category/categoryService';
import { fetchAllDestinations } from '@/services/Destination/destinationService';
import { getActivities } from '@/services/Activity/activityService';
import { getAllHotel } from '@/services/Hotel/hotelService';
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

  const [itinerary, setItinerary] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [availableActivities, setAvailableActivities] = useState([]);
  const [availableHotels, setAvailableHotels] = useState([]);
  
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(false);

  // Current itinerary item being added
  const [currentItinerary, setCurrentItinerary] = useState({
    day: 1,
    title: '',
    description: '',
    time: ''
  });

  // Fetch categories and destinations on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch categories
      try {
        setLoadingCategories(true);
        const categoryResponse = await getCategory();
        console.log('Categories Response:', categoryResponse);
        
        // Handle different response structures
        if (Array.isArray(categoryResponse)) {
          setCategories(categoryResponse);
        } else if (categoryResponse?.categories) {
          setCategories(categoryResponse.categories);
        } else if (categoryResponse?.data?.categories) {
          setCategories(categoryResponse.data.categories);
        } else if (categoryResponse?.data) {
          setCategories(Array.isArray(categoryResponse.data) ? categoryResponse.data : []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Failed to load categories. Please refresh the page.');
      } finally {
        setLoadingCategories(false);
      }

      // Fetch destinations
      try {
        setLoadingDestinations(true);
        const destinationResponse = await fetchAllDestinations();
        console.log('Destinations Response:', destinationResponse);
        
        // Handle different response structures
        if (Array.isArray(destinationResponse)) {
          setDestinations(destinationResponse);
        } else if (destinationResponse?.destinations) {
          setDestinations(destinationResponse.destinations);
        } else if (destinationResponse?.data?.destinations) {
          setDestinations(destinationResponse.data.destinations);
        } else if (destinationResponse?.data) {
          setDestinations(Array.isArray(destinationResponse.data) ? destinationResponse.data : []);
        }
      } catch (err) {
        console.error('Error fetching destinations:', err);
        toast.error('Failed to load destinations. Please refresh the page.');
      } finally {
        setLoadingDestinations(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch activities and hotels when destination changes
  useEffect(() => {
    const fetchDestinationData = async () => {
      if (!formData.destination) {
        setAvailableActivities([]);
        setAvailableHotels([]);
        setSelectedActivities([]);
        setSelectedHotels([]);
        return;
      }

      // Fetch activities for selected destination
      try {
        setLoadingActivities(true);
        const activitiesResponse = await getActivities(1, 100);
        console.log('Activities Response:', activitiesResponse);
        
        let allActivities = [];
        if (Array.isArray(activitiesResponse)) {
          allActivities = activitiesResponse;
        } else if (activitiesResponse?.activities) {
          allActivities = activitiesResponse.activities;
        } else if (activitiesResponse?.data?.activity) {
          allActivities = activitiesResponse.data.activity;
        } else if (activitiesResponse?.data) {
          allActivities = Array.isArray(activitiesResponse.data) ? activitiesResponse.data : [];
        }
        
        // Filter by destination
        const filtered = allActivities.filter(a => a.destinationId === formData.destination);
        setAvailableActivities(filtered);
        
        // Clear selected activities that don't match new destination
        setSelectedActivities(prev => prev.filter(a => a.destinationId === formData.destination));
      } catch (err) {
        console.error('Error fetching activities:', err);
        toast.error('Failed to load activities for this destination.');
        setAvailableActivities([]);
      } finally {
        setLoadingActivities(false);
      }

      // Fetch hotels for selected destination
      try {
        setLoadingHotels(true);
        const hotelsResponse = await getAllHotel(1, 100);
        console.log('Hotels Response:', hotelsResponse);
        
        let allHotels = [];
        if (Array.isArray(hotelsResponse)) {
          allHotels = hotelsResponse;
        } else if (hotelsResponse?.hotels) {
          allHotels = hotelsResponse.hotels;
        } else if (hotelsResponse?.data?.hotels) {
          allHotels = hotelsResponse.data.hotels;
        } else if (hotelsResponse?.data) {
          allHotels = Array.isArray(hotelsResponse.data) ? hotelsResponse.data : [];
        }
        
        // Filter by destination
        const filtered = allHotels.filter(h => h.destinationId === formData.destination);
        setAvailableHotels(filtered);
        
        // Clear selected hotels that don't match new destination
        setSelectedHotels(prev => prev.filter(h => h.destinationId === formData.destination));
      } catch (err) {
        console.error('Error fetching hotels:', err);
        toast.error('Failed to load hotels for this destination.');
        setAvailableHotels([]);
      } finally {
        setLoadingHotels(false);
      }
    };

    fetchDestinationData();
  }, [formData.destination]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Itinerary Management
  const handleAddItinerary = () => {
    if (!currentItinerary.title || !currentItinerary.description) {
      toast.error('Please fill in itinerary title and description');
      return;
    }

    setItinerary([...itinerary, { ...currentItinerary }]);
    setCurrentItinerary({
      day: itinerary.length + 2,
      title: '',
      description: '',
      time: ''
    });
    toast.success('Itinerary item added!');
  };

  const handleRemoveItinerary = (index) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
    toast.info('Itinerary item removed');
  };

  // Hotel toggle - one click selection
  const handleToggleHotel = (hotel) => {
    const hotelId = hotel.id || hotel._id;
    const isSelected = selectedHotels.some(h => (h.id || h._id) === hotelId);
    
    if (isSelected) {
      setSelectedHotels(selectedHotels.filter(h => (h.id || h._id) !== hotelId));
    } else {
      setSelectedHotels([...selectedHotels, hotel]);
    }
  };

  // Activity toggle - one click selection
  const handleToggleActivity = (activity) => {
    const activityId = activity.id || activity._id;
    const isSelected = selectedActivities.some(a => (a.id || a._id) === activityId);
    
    if (isSelected) {
      setSelectedActivities(selectedActivities.filter(a => (a.id || a._id) !== activityId));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const validateWithZod = (data) => {
    const result = buddyTravelSchema.safeParse(data);
    if (!result.success) {
      const formattedErrors = {};
      result.error.issues.forEach(err => {
        if (err.path && err.path.length > 0) {
          formattedErrors[err.path[0]] = err.message;
        }
      });
      setErrors(formattedErrors);
      const firstError = result.error.issues[0];
      if (firstError) {
        toast.error(firstError.message);
      }
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
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
        itinerary: itinerary,
        hotels: selectedHotels,
        activities: selectedActivities,
        joinedUsers: []
      };

      const result = await addBuddyTravel(payload);
      toast.success('Buddy travel created successfully! 🎉');
      
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
        setItinerary([]);
        setSelectedHotels([]);
        setSelectedActivities([]);
      }, 1000);
    } catch (error) {
      console.error('❌ Error creating buddy travel:', error);
      
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
    setItinerary([]);
    setSelectedHotels([]);
    setSelectedActivities([]);
    setAvailableActivities([]);
    setAvailableHotels([]);
    setErrors({});
    toast.info('Form has been reset');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Create Buddy Travel</h1>
            <p className="text-indigo-100 mt-2">Fill in the details to create an amazing travel experience</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travel Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Amazing Goa Beach Adventure"
                />
                {errors.title && <div className="text-sm text-red-600 mt-1">{errors.title}</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  {loadingCategories ? (
                    <div className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-500">
                      Loading categories...
                    </div>
                  ) : (
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id || cat._id} value={cat.id || cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.category && <div className="text-sm text-red-600 mt-1">{errors.category}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  {loadingDestinations ? (
                    <div className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-500">
                      Loading destinations...
                    </div>
                  ) : (
                    <select
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a destination</option>
                      {destinations.map(dest => (
                        <option key={dest.id || dest._id} value={dest.id || dest._id}>
                          {dest.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.destination && <div className="text-sm text-red-600 mt-1">{errors.destination}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    placeholder="10000"
                  />
                  {errors.price && <div className="text-sm text-red-600 mt-1">{errors.price}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max People</label>
                  <input
                    type="number"
                    name="maxPeople"
                    value={formData.maxPeople}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    placeholder="10"
                  />
                  {errors.maxPeople && <div className="text-sm text-red-600 mt-1">{errors.maxPeople}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.startDate && <div className="text-sm text-red-600 mt-1">{errors.startDate}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.endDate && <div className="text-sm text-red-600 mt-1">{errors.endDate}</div>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe your travel experience..."
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Itinerary Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                <List className="w-5 h-5" /> Itinerary (Optional)
              </h2>
              
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                    <input
                      type="number"
                      value={currentItinerary.day}
                      onChange={(e) => setCurrentItinerary({...currentItinerary, day: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300"
                      min="1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time (Optional)</label>
                    <input
                      type="text"
                      value={currentItinerary.time}
                      onChange={(e) => setCurrentItinerary({...currentItinerary, time: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300"
                      placeholder="e.g., 9:00 AM"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={currentItinerary.title}
                    onChange={(e) => setCurrentItinerary({...currentItinerary, title: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                    placeholder="e.g., Beach Visit"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={currentItinerary.description}
                    onChange={(e) => setCurrentItinerary({...currentItinerary, description: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300"
                    rows={2}
                    placeholder="Describe the day's activities..."
                  />
                </div>
                
                <button
                  type="button"
                  onClick={handleAddItinerary}
                  className="w-full py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add to Itinerary
                </button>
              </div>

              {itinerary.length > 0 && (
                <div className="space-y-2">
                  {itinerary.map((item, index) => (
                    <div key={index} className="bg-white border rounded-lg p-4 flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-indigo-600">Day {item.day}</span>
                          {item.time && <span className="text-sm text-gray-500">• {item.time}</span>}
                        </div>
                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItinerary(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hotels Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                <Hotel className="w-5 h-5" /> Select Hotels
              </h2>
              
              {!formData.destination ? (
                <p className="text-gray-500 text-center py-4">Please select a destination first</p>
              ) : loadingHotels ? (
                <p className="text-gray-500 text-center py-4">Loading hotels...</p>
              ) : availableHotels.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hotels available for this destination</p>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableHotels.map(hotel => {
                      const hotelId = hotel.id || hotel._id;
                      const isSelected = selectedHotels.some(h => (h.id || h._id) === hotelId);
                      
                      return (
                        <div
                          key={hotelId}
                          onClick={() => handleToggleHotel(hotel)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{hotel.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{hotel.address}</p>
                              <div className="flex items-center gap-1 mt-2">
                                <span className="text-yellow-500">★</span>
                                <span className="text-sm font-medium">{hotel.rating}</span>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="ml-2 flex-shrink-0">
                                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {selectedHotels.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {selectedHotels.length} hotel{selectedHotels.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Activities Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                <Zap className="w-5 h-5" /> Select Activities
              </h2>
              
              {!formData.destination ? (
                <p className="text-gray-500 text-center py-4">Please select a destination first</p>
              ) : loadingActivities ? (
                <p className="text-gray-500 text-center py-4">Loading activities...</p>
              ) : availableActivities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No activities available for this destination</p>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableActivities.map(activity => {
                      const activityId = activity.id || activity._id;
                      const isSelected = selectedActivities.some(a => (a.id || a._id) === activityId);
                      
                      return (
                        <div
                          key={activityId}
                          onClick={() => handleToggleActivity(activity)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            </div>
                            {isSelected && (
                              <div className="ml-2 flex-shrink-0">
                                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {selectedActivities.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {selectedActivities.length} activit{selectedActivities.length > 1 ? 'ies' : 'y'} selected
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={handleSubmit}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBuddyTravelPage;