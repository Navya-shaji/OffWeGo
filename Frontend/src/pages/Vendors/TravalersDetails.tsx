import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TravelerForm from "./TravlerForm";
import type { RootState } from "@/store/store";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { Traveler } from "@/interface/Boooking";
import { Users, Baby, Mail, Phone, MapPin, Home, Ticket, CreditCard } from "lucide-react";

export default function TravelerDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const selectedPackage = state?.selectedPackage;
  const selectedDate = state?.selectedDate;
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  
  const [adultTravelers, setAdultTravelers] = useState<Traveler[]>([]);
  const [childTravelers, setChildTravelers] = useState<Traveler[]>([]);
  
  // Add validation states
  const [isAdultFormValid, setIsAdultFormValid] = useState(false);
  const [isChildFormValid, setIsChildFormValid] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    email: "",
    mobile: "",
    city: "",
    address: "",
  });

  const basePrice = Number(selectedPackage?.price) || 0;

  const flightPriceObj = selectedPackage?.flightPrice;
  const selectedClass = "economy"; 
  const flightClassPrice = typeof flightPriceObj === "object" 
    ? flightPriceObj[selectedClass] || 0
    : Number(flightPriceObj) || 0;

  const packagePrice = basePrice + flightClassPrice;

  const adultPrice = packagePrice;
  const childPrice = adultPrice * 0.8;
  const totalAmount = adultCount * adultPrice + childCount * childPrice;

  const updateCount = (type: "adult" | "child", change: number) => {
    if (type === "adult") {
      const newCount = Math.max(0, adultCount + change);
      setAdultCount(newCount);
      // Reset validation when count changes
      if (change < 0) setIsAdultFormValid(newCount === 0);
    } else {
      const newCount = Math.max(0, childCount + change);
      setChildCount(newCount);
      // Reset validation when count changes
      if (change < 0) setIsChildFormValid(newCount === 0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value,
    });
  };

  // Validate contact information
  const validateContactInfo = () => {
    const { email, mobile, city, address } = contactInfo;
    
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!mobile.trim()) {
      toast.error("Mobile number is required");
      return false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile.replace(/\D/g, ''))) {
      toast.error("Please enter a valid 10-digit mobile number");
      return false;
    }

    if (!city.trim()) {
      toast.error("City is required");
      return false;
    }

    if (!address.trim()) {
      toast.error("Address is required");
      return false;
    }

    return true;
  };

  // Validate traveler forms based on count
  const validateTravelerForms = () => {
    if (adultCount > 0 && !isAdultFormValid) {
      toast.error("Please fill all adult traveler details correctly");
      return false;
    }

    if (childCount > 0 && !isChildFormValid) {
      toast.error("Please fill all child traveler details correctly");
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    if (!userId) {
      toast.error("Please login before booking!");
      navigate("/login");
      return;
    }

    if (adultCount + childCount === 0) {
      toast.error("Please select at least one traveler");
      return;
    }

    if (adultCount === 0 && childCount >= 1) {
      toast.error("Children must be accompanied by at least one adult");
      return;
    }

    // Validate contact information
    if (!validateContactInfo()) {
      return;
    }

    // Validate traveler forms
    if (!validateTravelerForms()) {
      return;
    }

    try {
      const bookingData = {
        userId,
        contactInfo,
        adults: adultTravelers,
        children: childTravelers,
        selectedPackage: {
          _id: selectedPackage._id,
          name: selectedPackage.name,
          price: selectedPackage.price,
          flightPrice: selectedPackage.flightPrice,
          totalPrice: selectedPackage.totalPrice,
        },
        selectedDate,
        totalAmount,
        status: "pending",
        paymentStatus: "pending",
      };

      navigate("/payment-checkout", {
        state: {
          bookingData,
          totalAmount,
        },
      });
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Booking failed!");
    }
  };

  const inputFields = [
    { name: "email", icon: Mail, type: "email", placeholder: "your.email@example.com" },
    { name: "mobile", icon: Phone, type: "tel", placeholder: "9876543210" },
    { name: "city", icon: MapPin, type: "text", placeholder: "Your city" },
    { name: "address", icon: Home, type: "text", placeholder: "Complete address" },
  ];

  // Check if we can proceed to payment
  const canProceedToPayment = 
    (adultCount > 0 || childCount > 0) &&
    (adultCount === 0 || isAdultFormValid) &&
    (childCount === 0 || isChildFormValid) &&
    contactInfo.email &&
    contactInfo.mobile &&
    contactInfo.city &&
    contactInfo.address &&
    !(adultCount === 0 && childCount >= 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600">Just a few more details to confirm your adventure</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden backdrop-blur-sm bg-opacity-95">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-8 lg:p-10 border-r border-gray-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Ticket className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-gray-800 text-2xl font-bold">Select Tickets</h2>
              </div>

              {/* Adult Ticket */}
              <div className="group bg-white p-6 rounded-2xl mb-5 shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-purple-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm font-medium mb-1">Adult Ticket</div>
                      <div className="text-gray-900 text-xl font-bold">₹{adultPrice}</div>
                      <div className="text-gray-400 text-xs">per person</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-2">
                    <button
                      onClick={() => updateCount("adult", -1)}
                      className="w-10 h-10 bg-white hover:bg-purple-100 text-gray-700 rounded-lg font-bold transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={adultCount === 0}
                    >
                      −
                    </button>
                    <span className="min-w-10 text-center text-lg font-bold text-purple-600">
                      {adultCount}
                    </span>
                    <button
                      onClick={() => updateCount("adult", 1)}
                      className="w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all duration-200 shadow-sm hover:shadow"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Child Ticket */}
              <div className="group bg-white p-6 rounded-2xl mb-8 shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-fuchsia-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-fuchsia-100 rounded-xl group-hover:bg-fuchsia-200 transition-colors">
                      <Baby className="w-6 h-6 text-fuchsia-600" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm font-medium mb-1">Child Ticket</div>
                      <div className="text-gray-900 text-xl font-bold">₹{childPrice.toLocaleString()}</div>
                      <div className="text-gray-400 text-xs">per person (20% off)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-2">
                    <button
                      onClick={() => updateCount("child", -1)}
                      className="w-10 h-10 bg-white hover:bg-fuchsia-100 text-gray-700 rounded-lg font-bold transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={childCount === 0}
                    >
                      −
                    </button>
                    <span className="min-w-10 text-center text-lg font-bold text-fuchsia-600">
                      {childCount}
                    </span>
                    <button
                      onClick={() => updateCount("child", 1)}
                      className="w-10 h-10 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg font-bold transition-all duration-200 shadow-sm hover:shadow"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-gray-800 text-xl font-bold mb-6 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-600" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {inputFields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <div key={field.name} className="relative group">
                        <label className="block text-gray-600 text-xs uppercase font-semibold mb-2 tracking-wide">
                          {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <input
                            type={field.type}
                            name={field.name}
                            value={(contactInfo as any)[field.name]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

           
            <div className="p-8 lg:p-10 bg-white">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-gray-800 text-2xl font-bold flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  Traveller Details
                </h2>
                <span className="text-red-500 text-xs font-semibold px-3 py-1 bg-red-50 rounded-full">
                  *Mandatory
                </span>
              </div>

              <div className="space-y-6 mb-6">
                {adultCount > 0 && (
                  <div className="animate-slide-in">
                    <TravelerForm
                      travelerType="Adult"
                      count={adultCount}
                      onChange={setAdultTravelers}
                      onValidationChange={setIsAdultFormValid}
                    />
                  </div>
                )}
                {childCount > 0 && (
                  <div className="animate-slide-in">
                    <TravelerForm
                      travelerType="Child"
                      count={childCount}
                      onChange={setChildTravelers}
                      onValidationChange={setIsChildFormValid}
                    />
                  </div>
                )}
              </div>

          
              <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-2xl p-6 text-white shadow-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Booking Summary</span>
                  <CreditCard className="w-5 h-5 text-white/60" />
                </div>
                <div className="space-y-2 mb-4 text-sm">
                  {adultCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-purple-100">Adults × {adultCount}</span>
                      <span className="font-semibold">₹{(adultCount * adultPrice).toLocaleString()}</span>
                    </div>
                  )}
                  {childCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-purple-100">Children × {childCount}</span>
                      <span className="font-semibold">₹{(childCount * childPrice).toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-purple-400 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total Amount</span>
                    <span className="text-3xl font-bold">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

    
              <button
                onClick={handleNext}
                disabled={!canProceedToPayment}
                className={`w-full px-6 py-4 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 ${
                  canProceedToPayment
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:from-purple-700 hover:to-fuchsia-700 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {canProceedToPayment ? "Proceed to Payment" : "Please Complete All Details"}
              </button>

         
              <div className="mt-4 space-y-2 text-sm">
                {adultCount > 0 && !isAdultFormValid && (
                  <p className="text-red-500 flex items-center gap-2">
                    <span>⚠</span> Please complete all adult traveler details
                  </p>
                )}
                {childCount > 0 && !isChildFormValid && (
                  <p className="text-red-500 flex items-center gap-2">
                    <span>⚠</span> Please complete all child traveler details
                  </p>
                )}
                {adultCount === 0 && childCount >= 1 && (
                  <p className="text-red-500 flex items-center gap-2">
                    <span>⚠</span> At least one adult is required when traveling with children
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}