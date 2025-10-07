

export interface TravelerDto {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
}

export interface PackageDto {
  _id: string;
  packageName: string;
  price: number;
  description?: string;
  duration?: number;
}

export interface ContactInfoDto {
  email: string;
  mobile: string;
  city: string;
  address: string;
}

export interface CreateBookingDto {
  userId: string;
  contactInfo: ContactInfoDto;
  adults: TravelerDto[];
  children: TravelerDto[];
  selectedPackage: PackageDto;
  selectedDate: Date;
  totalAmount: number;
}
