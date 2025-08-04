export interface Activity {
  activityId: string
  title: string
  description: string
  destinationId: string
}


export const fetchActivities = async (destinationId?: string): Promise<Activity[]> => {

  await new Promise((resolve) => setTimeout(resolve, 800))

  const mockActivities: Activity[] = [
    {
      activityId: "1",
      title: "City Heritage Walk",
      description: "Explore the historic landmarks and cultural sites of the city with expert guides",
      destinationId: "mumbai",
    },
    {
      activityId: "2",
      title: "Beach Water Sports",
      description: "Enjoy thrilling water activities including parasailing, jet skiing, and banana boat rides",
      destinationId: "goa",
    },
    {
      activityId: "3",
      title: "Mountain Trekking",
      description: "Adventure trek through scenic mountain trails with breathtaking valley views",
      destinationId: "shimla",
    },
    {
      activityId: "4",
      title: "Palace Tour & Cultural Show",
      description: "Visit magnificent palaces and enjoy traditional Rajasthani folk performances",
      destinationId: "jaipur",
    },
    {
      activityId: "5",
      title: "Backwater Cruise",
      description: "Serene houseboat journey through the famous backwaters with local cuisine",
      destinationId: "kerala",
    },
    {
      activityId: "6",
      title: "Food Street Tour",
      description: "Culinary adventure through local markets and street food hotspots",
      destinationId: "mumbai",
    },
  ]

  return destinationId ? mockActivities.filter((activity) => activity.destinationId === destinationId) : mockActivities
}
