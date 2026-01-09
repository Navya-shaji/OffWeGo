import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TravelerForm from "./TravlerForm";
import type { RootState } from "@/store/store";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { Traveler } from "@/interface/Boooking";
import { Users, Baby, Mail, Phone, MapPin, Home, Ticket, CreditCard, ArrowLeft } from "lucide-react";

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
  
  const [isAdultFormValid, setIsAdultFormValid] = useState(false);
  const [isChildFormValid, setIsChildFormValid] = useState(false);
  const [isStateLoaded, setIsStateLoaded] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    email: "",
    mobile: "",
    city: "",
    address: "",
  });

  const totalPriceFromModal = state?.totalPrice || Number(selectedPackage?.price) || 0;

  const adultPrice = totalPriceFromModal;
  const childPrice = adultPrice * 0.8;
  const totalAmount = adultCount * adultPrice + childCount * childPrice;

  useEffect(() => {
    if (selectedPackage?._id) {
      const storageKey = `traveler-details:${selectedPackage._id}`;
      const savedState = localStorage.getItem(storageKey);

      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          if (parsed.adultCount !== undefined) setAdultCount(parsed.adultCount);
          if (parsed.childCount !== undefined) setChildCount(parsed.childCount);
          if (parsed.contactInfo) setContactInfo(parsed.contactInfo);
          if (parsed.adultTravelers) setAdultTravelers(parsed.adultTravelers);
          if (parsed.childTravelers) setChildTravelers(parsed.childTravelers);
          if (parsed.isAdultFormValid !== undefined)
            setIsAdultFormValid(parsed.isAdultFormValid);
          if (parsed.isChildFormValid !== undefined)
            setIsChildFormValid(parsed.isChildFormValid);
        } catch (err) {
          console.error("Error parsing saved traveler details:", err);
        }
      }

      setIsStateLoaded(true);
    } else {
      setIsStateLoaded(true);
    }
  }, [selectedPackage?._id]);

  // Save state on every change
  useEffect(() => {
    if (selectedPackage?._id && isStateLoaded) {
      const storageKey = `traveler-details:${selectedPackage._id}`;
      const toSave = {
        adultCount,
        childCount,
        contactInfo,
        adultTravelers,
        childTravelers,
        isAdultFormValid,
        isChildFormValid,
      };
      localStorage.setItem(storageKey, JSON.stringify(toSave));
    }
  }, [
    selectedPackage?._id,
    adultCount,
    childCount,
    contactInfo,
    adultTravelers,
    childTravelers,
    isAdultFormValid,
    isChildFormValid,
    isStateLoaded,
  ]);

  // Clean up data when component unmounts or when navigating back
  useEffect(() => {
    return () => {
      // Cleanup function - clear localStorage when navigating away
      if (selectedPackage?._id) {
        const storageKey = `traveler-details:${selectedPackage._id}`;
        // Only clear if navigating back (not forward to payment)
        const currentPath = window.location.pathname;
        if (!currentPath.includes('payment-checkout')) {
          localStorage.removeItem(storageKey);
        }
      }
    };
  }, [selectedPackage?._id]);

  const updateCount = (type: "adult" | "child", change: number) => {
    if (type === "adult") {
      const newCount = Math.max(0, adultCount + change);
      setAdultCount(newCount);
      if (change < 0) setIsAdultFormValid(newCount === 0);
    } else {
      const newCount = Math.max(0, childCount + change);
      setChildCount(newCount);
      if (change < 0) setIsChildFormValid(newCount === 0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value,
    });
  };

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

    if (!validateContactInfo()) {
      return;
    }

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

  const handleBack = () => {
    // Clear localStorage when going back
    if (selectedPackage?._id) {
      const storageKey = `traveler-details:${selectedPackage._id}`;
      localStorage.removeItem(storageKey);
    }
    navigate(-1);
  };

  const inputFields = [
    { name: "email", icon: Mail, type: "email", placeholder: "your.email@example.com" },
    { name: "mobile", icon: Phone, type: "tel", placeholder: "9876543210" },
    { name: "city", icon: MapPin, type: "text", placeholder: "Your city" },
    { name: "address", icon: Home, type: "text", placeholder: "Complete address" },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 hover:text-gray-900 font-medium border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Package
          </button>
        </div>

        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600">Just a few more details to confirm your adventure</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 lg:p-10 border-r border-gray-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <Ticket className="w-6 h-6 text-gray-800" />
                </div>
                <h2 className="text-gray-900 text-2xl font-bold">Select Tickets</h2>
              </div>

              {/* Adult Ticket */}
              <div className="group bg-white p-6 rounded-2xl mb-5 shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-gray-400">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
                      <Users className="w-6 h-6 text-gray-800" />
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm font-medium mb-1">Adult Ticket</div>
                      <div className="text-gray-900 text-xl font-bold">₹{adultPrice}</div>
                      <div className="text-gray-500 text-xs">per person</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-2 border border-gray-200">
                    <button
                      onClick={() => updateCount("adult", -1)}
                      className="w-10 h-10 bg-white hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                      disabled={adultCount === 0}
                    >
                      −
                    </button>
                    <span className="min-w-10 text-center text-lg font-bold text-gray-900">
                      {adultCount}
                    </span>
                    <button
                      onClick={() => updateCount("adult", 1)}
                      className="w-10 h-10 bg-gray-900 hover:bg-black text-white rounded-lg font-bold transition-all duration-200 shadow-sm hover:shadow"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Child Ticket */}
              <div className="group bg-white p-6 rounded-2xl mb-8 shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-gray-200 hover:border-gray-400">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
                      <Baby className="w-6 h-6 text-gray-800" />
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm font-medium mb-1">Child Ticket</div>
                      <div className="text-gray-900 text-xl font-bold">₹{childPrice.toLocaleString()}</div>
                      <div className="text-gray-500 text-xs">per person (20% off)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-2 border border-gray-200">
                    <button
                      onClick={() => updateCount("child", -1)}
                      className="w-10 h-10 bg-white hover:bg-gray-200 text-gray-700 rounded-lg font-bold transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                      disabled={childCount === 0}
                    >
                      −
                    </button>
                    <span className="min-w-10 text-center text-lg font-bold text-gray-900">
                      {childCount}
                    </span>
                    <button
                      onClick={() => updateCount("child", 1)}
                      className="w-10 h-10 bg-gray-900 hover:bg-black text-white rounded-lg font-bold transition-all duration-200 shadow-sm hover:shadow"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-gray-900 text-xl font-bold mb-6 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-800" />
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
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-800 transition-colors">
                            <Icon className="w-5 h-5" />
                          </div>
                          <input
                            type={field.type}
                            name={field.name}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            value={(contactInfo as any)[field.name]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl text-sm focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-300 transition-all duration-200 bg-white"
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
                <h2 className="text-gray-900 text-2xl font-bold flex items-center gap-2">
                  <Users className="w-6 h-6 text-gray-800" />
                  Traveller Details
                </h2>
                <span className="text-red-500 text-xs font-semibold px-3 py-1 bg-red-50 rounded-full border border-red-200">
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

              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 text-white shadow-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Booking Summary</span>
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-2 mb-4 text-sm">
                  {adultCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Adults × {adultCount}</span>
                      <span className="font-semibold">₹{(adultCount * adultPrice).toLocaleString()}</span>
                    </div>
                  )}
                  {childCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Children × {childCount}</span>
                      <span className="font-semibold">₹{(childCount * childPrice).toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-700 pt-4">
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
                    ? "bg-gray-900 hover:bg-black text-white cursor-pointer"
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
