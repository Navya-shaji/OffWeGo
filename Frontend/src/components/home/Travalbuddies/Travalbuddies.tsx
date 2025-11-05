import React, { useEffect, useState } from "react";
import { getAllBuddyPackages } from "@/services/BuddyTravel/buddytravelService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Destination {
  _id: string;
  name: string;
  image?: string;
}

interface BuddyPackage {
  _id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  image?: string;
  status: string;
  destination?: Destination;
}

const Travalbuddies: React.FC = () => {
  const [packages, setPackages] = useState<BuddyPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await getAllBuddyPackages();
        console.log("Fetched packages:", data);

        const approved = data.filter(
          (pkg: BuddyPackage) => pkg.status === "APPROVED"
        );
        setPackages(approved);
      } catch (err: any) {
        setError(err.message || "Failed to fetch buddy travel packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Loading Buddy Packages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-medium mt-10">
        {error}
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-20 text-lg">
        No approved buddy travel packages available right now.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold text-center mb-10 text-gray-800">
        Approved Buddy Travel Packages 🌍
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {packages.map((pkg) => {
          // ✅ Choose image priority:
          // 1. Package image
          // 2. Destination image
          // 3. Default fallback
          const image =
            pkg.image ||
            pkg.destination?.image ||
            "/images/default-trip.jpg";

          return (
            <Card
              key={pkg._id}
              className="hover:shadow-lg transition-shadow duration-300 rounded-2xl overflow-hidden"
            >
              <img
                src={image}
                alt={pkg.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {pkg.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">📍 {pkg.location}</p>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {pkg.description}
                </p>
                <p className="text-sm text-gray-700 font-medium mb-1">
                  🗓 {new Date(pkg.startDate).toLocaleDateString()} -{" "}
                  {new Date(pkg.endDate).toLocaleDateString()}
                </p>
                <p className="text-lg font-semibold text-coral-600 mb-4">
                  ₹{pkg.price}
                </p>

                <Button className="w-full bg-gradient-to-r from-coral-500 to-orange-500 text-white hover:from-coral-600 hover:to-orange-600">
                  Join Trip
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Travalbuddies;
