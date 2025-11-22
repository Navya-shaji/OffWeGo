
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { getBanner } from "@/services/Banner/bannerService";
import { Button } from "@/components/ui/button";
import type { BannerInterface } from "@/interface/bannerInterface";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner: React.FC = () => {
  const [banners, setBanners] = useState<BannerInterface[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await getBanner();
        const bannerList = Array.isArray(response?.data) ? response.data : [];
        setBanners(bannerList);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBanners([]);
      }
    };

    fetchBanner();
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: true,
    swipeToSlide: true,
    draggable: true,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <ul className="flex gap-2">{dots}</ul>
      </div>
    ),
    customPaging: (i: number) => (
      <button
        className={`h-1 transition-all duration-300 ${
          i === currentSlide ? 'w-12 bg-white' : 'w-6 bg-white/40'
        }`}
      />
    ),
  };

  const activeBanners = banners.filter((b) => b.action);

  return (
    <section className="relative h-screen bg-black overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        {activeBanners.length > 1 ? (
          <Slider {...sliderSettings}>
            {activeBanners.map((banner) => (
              <div key={banner.id} className="w-full h-screen">
                <video
                  className="w-full h-screen object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  controls={false}
                >
                  <source src={banner.Banner_video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </Slider>
        ) : activeBanners.length === 1 ? (
          <video
            className="w-full h-screen object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
          >
            <source src={activeBanners[0].Banner_video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center text-white/60">
              <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-light">No active banners</p>
            </div>
          </div>
        )}
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl">
            <div
              className={`transition-all duration-1000 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {/* Subtitle */}
              <div className="mb-6">
                <span className="inline-block text-sm font-semibold tracking-[0.3em] text-white/80 uppercase border border-white/30 px-6 py-2 backdrop-blur-sm">
                  Discover the World
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-white mb-6 tracking-tight leading-none">
                Wander
                <span className="block font-bold">Beyond</span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl leading-relaxed font-light">
                Embark on extraordinary journeys to breathtaking destinations. 
                Every adventure tells a story, every moment becomes a memory.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button className="group relative px-8 py-6 bg-white text-black font-semibold overflow-hidden transition-all duration-300 hover:scale-105 rounded-none">
                  <span className="relative z-10">Explore Destinations</span>
                  <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    Explore Destinations
                  </span>
                </Button>
                
                <Button className="px-8 py-6 border-2 border-white text-white font-semibold backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 rounded-none bg-transparent">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 right-12 z-20">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs font-semibold tracking-widest uppercase rotate-90 origin-center mb-8">
            Scroll
          </span>
          <div className="w-px h-16 bg-white/30 relative overflow-hidden">
            <div className="absolute w-full h-8 bg-white/60 animate-scroll-down"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-down {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scroll-down {
          animation: scroll-down 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Banner;
