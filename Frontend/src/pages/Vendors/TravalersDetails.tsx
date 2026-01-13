import { useState, useEffect } from "react";
import Header from "@/components/home/navbar/Header";
import { useLocation, useNavigate } from "react-router-dom";
import TravelerForm from "./TravlerForm";
import type { RootState } from "@/store/store";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { Traveler } from "@/interface/Boooking";
import { Users, Baby, Mail, Phone, MapPin, Home, Ticket, CreditCard, ArrowLeft, CheckCircle, ShieldCheck } from "lucide-react";

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

  // Controls validation visibility
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  useEffect(() => {
    return () => {
      if (selectedPackage?._id) {
        const storageKey = `traveler-details:${selectedPackage._id}`;
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

    if (!email.trim() || !mobile.trim() || !city.trim() || !address.trim()) {
      if (!isSubmitted) setIsSubmitted(true);
      toast.error("Please fill in all contact details");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile.replace(/\D/g, ''))) {
      toast.error("Please enter a valid 10-digit mobile number");
      return false;
    }

    return true;
  };

  const validateTravelerForms = () => {
    if (adultCount > 0 && !isAdultFormValid) {
      if (!isSubmitted) setIsSubmitted(true);
      toast.error("Please check adult traveler details");
      return false;
    }

    if (childCount > 0 && !isChildFormValid) {
      if (!isSubmitted) setIsSubmitted(true);
      toast.error("Please check child traveler details");
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    setIsSubmitted(true); // Show errors now

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

    if (!validateContactInfo()) return;
    if (!validateTravelerForms()) return;

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

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pt-32 font-sans selection:bg-teal-100">
      <Header forceSolid />
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-slate-600 hover:text-teal-600 font-bold border border-slate-200 hover:border-teal-100 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Package
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">
            Finalize Your Trip
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Almost there! We just need a few details to secure your spot.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

            {/* Left Column: Selections */}
            <div className="lg:col-span-7 bg-white p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-100">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-gray-900 text-2xl font-black">Who is traveling?</h2>
                  <p className="text-slate-400 text-sm font-medium">Select tickets for everyone</p>
                </div>
              </div>

              {/* Adult Ticket */}
              <div className="bg-slate-50 p-6 rounded-3xl mb-6 border border-slate-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300 group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Standard</div>
                      <div className="text-gray-900 text-xl font-bold">Adult</div>
                      <div className="text-teal-600 font-black mt-1">₹{adultPrice.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white rounded-xl p-2 shadow-sm border border-slate-100">
                    <button
                      onClick={() => updateCount("adult", -1)}
                      className="w-10 h-10 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg font-bold transition-all disabled:opacity-30"
                      disabled={adultCount === 0}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xl font-bold text-gray-900">
                      {adultCount}
                    </span>
                    <button
                      onClick={() => updateCount("adult", 1)}
                      className="w-10 h-10 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-teal-200 shadow-md transition-all active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Child Ticket */}
              <div className="bg-slate-50 p-6 rounded-3xl mb-10 border border-slate-100 hover:border-rose-200 hover:shadow-lg transition-all duration-300 group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 transition-transform">
                      <Baby className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Under 12</div>
                      <div className="text-gray-900 text-xl font-bold">Child</div>
                      <div className="text-rose-500 font-bold mt-1">₹{childPrice.toLocaleString()} <span className="text-xs text-rose-300 ml-1 line-through">20% off</span></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white rounded-xl p-2 shadow-sm border border-slate-100">
                    <button
                      onClick={() => updateCount("child", -1)}
                      className="w-10 h-10 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg font-bold transition-all disabled:opacity-30"
                      disabled={childCount === 0}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xl font-bold text-gray-900">
                      {childCount}
                    </span>
                    <button
                      onClick={() => updateCount("child", 1)}
                      className="w-10 h-10 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold shadow-rose-200 shadow-md transition-all active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-teal-600" />
                <div className="p-8">
                  <h3 className="text-gray-900 text-xl font-bold mb-6 flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg">
                      <Mail className="w-5 h-5 text-teal-600" />
                    </div>
                    Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {inputFields.map((field) => {
                      const Icon = field.icon;
                      const hasError = isSubmitted && !(contactInfo as any)[field.name];
                      return (
                        <div key={field.name} className={field.name === 'address' ? 'md:col-span-2' : ''}>
                          <label className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wide ml-1">
                            {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                          </label>
                          <div className="relative group">
                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${hasError ? 'text-red-400' : 'text-slate-400 group-focus-within:text-teal-600'} transition-colors`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <input
                              type={field.type}
                              name={field.name}
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              value={(contactInfo as any)[field.name]}
                              onChange={handleInputChange}
                              placeholder={field.placeholder}
                              className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${hasError ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-teal-100 focus:border-teal-500'} rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all duration-200 placeholder:text-slate-300 text-gray-900`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Forms & Summary */}
            <div className="lg:col-span-5 bg-slate-50/50 p-8 lg:p-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-gray-900 text-2xl font-black">Guest Details</h2>
                <div className="flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-100 px-3 py-1.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> Secure
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {adultCount > 0 && (
                  <TravelerForm
                    travelerType="Adult"
                    count={adultCount}
                    onChange={setAdultTravelers}
                    onValidationChange={setIsAdultFormValid}
                    showErrors={isSubmitted}
                  />
                )}
                {childCount > 0 && (
                  <TravelerForm
                    travelerType="Child"
                    count={childCount}
                    onChange={setChildTravelers}
                    onValidationChange={setIsChildFormValid}
                    showErrors={isSubmitted}
                  />
                )}
                {adultCount === 0 && childCount === 0 && (
                  <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-300">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">Add travelers to continue</p>
                  </div>
                )}
              </div>

              <div className="sticky top-28">
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                  {/* Decorative glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-teal-500/30 transition-all duration-1000" />

                  <div className="relative z-10">
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
                      Price Breakdown
                    </h3>

                    <div className="space-y-4 mb-8">
                      {adultCount > 0 && (
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Adults <span className="text-teal-400">× {adultCount}</span></span>
                          <span className="font-bold text-white">₹{(adultCount * adultPrice).toLocaleString()}</span>
                        </div>
                      )}
                      {childCount > 0 && (
                        <div className="flex justify-between items-center text-slate-300">
                          <span>Children <span className="text-rose-400">× {childCount}</span></span>
                          <span className="font-bold text-white">₹{(childCount * childPrice).toLocaleString()}</span>
                        </div>
                      )}
                      {adultCount === 0 && childCount === 0 && (
                        <p className="text-slate-500 italic text-sm">No tickets selected</p>
                      )}
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Payble</p>
                          <p className="text-3xl font-black text-white">₹{totalAmount.toLocaleString()}</p>
                        </div>
                        <CreditCard className="w-8 h-8 text-teal-400 opacity-50 mb-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Errors Summary */}
                {isSubmitted && (
                  <div className="mt-4 space-y-2 px-2">
                    {(!contactInfo.email || !contactInfo.mobile) && (
                      <p className="text-rose-500 text-xs font-bold flex items-center gap-2 animate-pulse">
                        <CheckCircle className="w-4 h-4 text-rose-500" /> Missing Contact Info
                      </p>
                    )}
                    {((adultCount > 0 && !isAdultFormValid) || (childCount > 0 && !isChildFormValid)) && (
                      <p className="text-rose-500 text-xs font-bold flex items-center gap-2 animate-pulse">
                        <CheckCircle className="w-4 h-4 text-rose-500" /> Check Traveler Details
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={handleNext}
                  className="w-full mt-6 bg-teal-600 hover:bg-teal-500 text-white font-bold text-lg py-5 rounded-2xl shadow-xl shadow-teal-900/10 hover:shadow-teal-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Confirm & Pay <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-xs text-slate-400 font-medium mt-4">
                  Secure 256-bit encrypted checkout
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
