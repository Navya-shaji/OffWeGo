export interface Traveler {
  name: string;
  age: number;
  gender: "male" | "female" | "other"; // must match DTO
}

export interface Booking {
  userId: string;
  contactInfo: {
    email: string;
    mobile: string;
    city: string;
    address: string;
  };
  adults: Traveler[];
  children: Traveler[];
  selectedPackage: {
    _id: string;
    packageName: string;
    price: number;
    description?: string;
    duration?: number;
  };
  selectedDate: Date;
  totalAmount: number;
}
