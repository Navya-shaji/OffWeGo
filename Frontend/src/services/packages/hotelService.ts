export interface Hotel {
  hotelId: string
  name: string
  address: string
  rating: number
  destinationId: string
}

// Mock API - Replace with your actual API endpoints
export const fetchHotels = async (destinationId?: string): Promise<Hotel[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const mockHotels: Hotel[] = [
    {
      hotelId: "1",
      name: "The Grand Palace",
      address: "123 Marine Drive, Mumbai",
      rating: 4.8,
      destinationId: "mumbai",
    },
    {
      hotelId: "2",
      name: "Ocean View Resort",
      address: "456 Beach Road, Goa",
      rating: 4.6,
      destinationId: "goa",
    },
    {
      hotelId: "3",
      name: "Mountain Retreat",
      address: "789 Hill Station, Shimla",
      rating: 4.4,
      destinationId: "shimla",
    },
    {
      hotelId: "4",
      name: "Heritage Haveli",
      address: "321 Old City, Jaipur",
      rating: 4.7,
      destinationId: "jaipur",
    },
    {
      hotelId: "5",
      name: "Backwater Lodge",
      address: "654 Waterfront, Kerala",
      rating: 4.5,
      destinationId: "kerala",
    },
  ]

  return destinationId ? mockHotels.filter((hotel) => hotel.destinationId === destinationId) : mockHotels
}
