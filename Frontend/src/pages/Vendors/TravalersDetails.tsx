// 1. Updated TravelerDetails.tsx - Create booking immediately
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TravelerForm from "./TravlerForm";
import { createBooking } from "@/services/Booking/bookingService";
import type { RootState } from "@/store/store";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function TravelerDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const selectedPackage = state?.selectedPackage;
  const selectedDate = state?.selectedDate;
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  
  const [adultTravelers, setAdultTravelers] = useState([]);
  const [childTravelers, setChildTravelers] = useState([]);

  const [contactInfo, setContactInfo] = useState({
    email: "",
    mobile: "",
    city: "",
    address: "",
  });

 const packagePrice = selectedPackage?.totalPrice || selectedPackage?.price || 500;
  const adultPrice = packagePrice;
  const childPrice = adultPrice * 0.8;
  const totalAmount = adultCount * adultPrice + childCount * childPrice;

  const updateCount = (type: "adult" | "child", change: number) => {
    if (type === "adult") {
      setAdultCount(Math.max(0, adultCount + change));
    } else {
      setChildCount(Math.max(0, childCount + change));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value,
    });
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

    if (
      !contactInfo.email ||
      !contactInfo.mobile ||
      !contactInfo.city ||
      !contactInfo.address
    ) {
      toast.error("Please fill all contact information");
      return;
    }

    if (adultCount > 0 && adultTravelers.some((t: any) => !t.name || !t.age || !t.gender)) {
      toast.error("Please fill all adult traveler details");
      return;
    }

    if (childCount > 0 && childTravelers.some((t: any) => !t.name || !t.age || !t.gender)) {
      toast.error("Please fill all child traveler details");
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
          basePrice: selectedPackage.basePrice,
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
  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left Section */}
          <div className="bg-gray-50 p-10 border-r border-gray-200">
            <h2 className="text-gray-800 text-2xl font-semibold mb-8">
              Select Tickets
            </h2>

            {/* Adult Ticket */}
            <div className="bg-white p-5 rounded-xl mb-4 shadow-sm flex justify-between items-center">
              <div className="flex-1">
                <div className="text-gray-600 text-sm mb-1">Adult</div>
                <div className="text-gray-800 text-lg font-semibold">
                  ₹{adultPrice} per person
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateCount("adult", -1)}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  −
                </button>
                <span className="min-w-8 text-center text-base font-semibold">
                  {adultCount}
                </span>
                <button
                  onClick={() => updateCount("adult", 1)}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  +
                </button>
              </div>
            </div>

            {/* Child Ticket */}
            <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center">
              <div className="flex-1">
                <div className="text-gray-600 text-sm mb-1">Child</div>
                <div className="text-gray-800 text-lg font-semibold">
                  ₹{childPrice} per person
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateCount("child", -1)}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  −
                </button>
                <span className="min-w-8 text-center text-base font-semibold">
                  {childCount}
                </span>
                <button
                  onClick={() => updateCount("child", 1)}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  +
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mb-8 mt-8">
              <h3 className="text-gray-800 text-lg font-semibold mb-5">
                Contact Information
              </h3>
              {["email", "mobile", "city", "address"].map((field) => (
                <div key={field} className="mb-5">
                  <label className="block text-gray-600 text-xs uppercase font-semibold mb-2 tracking-wide">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={(contactInfo as any)[field]}
                    onChange={handleInputChange}
                    placeholder={`Enter your ${field}`}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-600 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: Traveler Forms */}
          <div className="p-10">
            <h2 className="text-gray-800 text-2xl font-semibold mb-8">
              Traveller Details
              <span className="text-red-500 text-xs float-right">
                *Mandatory
              </span>
            </h2>

            {adultCount > 0 && (
              <TravelerForm
                travelerType="Adult"
                count={adultCount}
                onChange={setAdultTravelers}
              />
            )}
            {childCount > 0 && (
              <TravelerForm
                travelerType="Child"
                count={childCount}
                onChange={setChildTravelers}
              />
            )}

            <div className="mt-5">
              <p className="text-gray-700 font-semibold mb-3">
                Total Amount: ₹{totalAmount}
              </p>
              <button
                onClick={handleNext}
                className="w-full px-4 py-4 bg-black text-white rounded-lg text-base font-semibold hover:bg-gray-800 transition-colors"
              >
                Confirm Booking
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
