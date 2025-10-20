import React, { useEffect, useState } from "react";
import { bookingdates } from "@/services/Booking/bookingService";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Card, CardContent } from "@/components/ui/card";

interface TravelCalendarProps {
  vendorId: string;
}

const TravelCalendar: React.FC<TravelCalendarProps> = ({ vendorId }) => {
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchBookingDates = async () => {
      try {
        const dates = await bookingdates(vendorId);
        setBookedDates(dates);
      } catch (err) {
        console.error("Error fetching booking dates:", err);
      }
    };
    fetchBookingDates();
  }, [vendorId]);
  console.log(vendorId)

const tileClassName = ({ date }: any) => {
  const formatted = date.toISOString().split("T")[0];

  const normalizedBookedDates = bookedDates?.map(d => d.split("T")[0]) || [];

  if (normalizedBookedDates.includes(formatted)) {
    return "bg-red-500 text-white rounded-full"; 
  }
  return "";
};


  return (
    <Card className="max-w-md mx-auto p-4 shadow-md">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Travel Calendar
        </h2>
        <Calendar tileClassName={tileClassName} />
        <p className="text-sm text-gray-500 mt-2 text-center">
          Red dates are already booked
        </p>
      </CardContent>
    </Card>
  );
};

export default TravelCalendar;
