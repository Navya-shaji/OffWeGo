"use client";

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { getBanner } from "@/services/Banner/bannerService"; // Your actual service import
import { Button } from "@/components/ui/button";
import type { BannerInterface } from "@/interface/bannerInterface"; // Your actual interface import

// Import react-slick CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner: React.FC = () => {
  const [banners, setBanners] = useState<BannerInterface[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getBanner();
       
        setBanners(data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanner();

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: true,
    swipeToSlide: true,
    draggable: true,
  };

  const activeBanners = banners.filter((b) => b.action);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white  to-white overflow-hidden">
      <div className="container mx-auto px-6 py-12 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div
            className={`space-y-8 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-light text-gray-500 tracking-wide uppercase">
                Chase the
              </h2>
              <h1 className="text-6xl md:text-7xl font-extrabold text-black leading-tight">
                Adventure
              </h1>
              <h3 className="text-2xl md:text-3xl font-medium text-gray-700 italic">
                Discover Santorini
              </h3>
            </div>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-xl">
              From iconic white-washed homes to golden sunsets over the sea,
              Santorini is more than a destination—it's a feeling. Let the
              journey shape your soul.
            </p>
          </div>
          <div
            className={`relative transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
          >
            <div className="relative w-full h-96 rounded-lg shadow-2xl overflow-hidden">
              {activeBanners.length > 1 ? (
                <Slider {...sliderSettings}>
                  {activeBanners.map((banner) => (
                    <div key={banner.id} className="w-full h-96">
                      <video
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        controls={false}
                      >
                        <source
                          src={banner.Banner_video_url}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </Slider>
              ) : activeBanners.length === 1 ? (
                <div className="w-full h-96">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    controls={false}
                  >
                    <source
                      src={activeBanners[0].Banner_video_url}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500">
                  No active banners
                </div>
              )}
              <div className="absolute bottom-6 right-6">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  BOOK NOW
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
