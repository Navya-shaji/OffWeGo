import React, { useState } from 'react';

export default function AboutUs() {
  const [activeTimeline, setActiveTimeline] = useState(null);

  const stats = [
    { number: '2M+', label: 'Happy Travelers' },
    { number: '150+', label: 'Countries Covered' },
    { number: '50K+', label: 'Travel Destinations' },
    { number: '4.9★', label: 'User Rating' }
  ];

  const successStories = [
    {
      title: 'Custom Tour Packages',
      description: 'Our travel experts crafted the perfect custom itinerary combining adventure, culture, and relaxation. From the bustling streets of Tokyo to the serene beaches of Bali, every detail was meticulously planned and executed to perfection.',
      image: '🎒'
    },
    {
      title: 'Honeymoon in the Hills - A Romantic Escape to Nature',
      description: 'Sarah and John celebrated their love with an unforgettable mountain retreat. We arranged private cabins, candlelit dinners overlooking valleys, and guided nature walks. Their dream honeymoon became a reality with our personalized touch.',
      image: '💑'
    },
    {
      title: 'Solo Vibes - Travel for the Soul',
      description: 'Meet Emma, who found herself through solo travel across Southeast Asia. With our 24/7 support and carefully curated experiences, she explored ancient temples, learned local crafts, and made lifelong friends along the way.',
      image: '🧘‍♀️'
    }
  ];

  const offerings = [
    {
      icon: '👤',
      title: 'Personalized Experience',
      description: 'Expert guides & staff who care you, tailored to you and meet your needs always'
    },
    {
      icon: '🏛️',
      title: 'Historical Insight',
      description: 'Enabling team to learn more about rich heritage and history of destinations guided'
    },
    {
      icon: '📊',
      title: 'Industry-expert feedback',
      description: 'Real-time travel data insights & feedback that let you create seamless trips'
    }
  ];

  const values = [
    { icon: '🎯', title: 'Innovation', description: 'We constantly push boundaries to deliver cutting-edge features that enhance your travel experience through technology and creativity.' },
    { icon: '🤝', title: 'Community', description: 'Building a global network of travelers who share experiences, tips, and support each other\'s journeys around the world.' },
    { icon: '💎', title: 'Quality', description: 'Curating only the best destinations, accommodations, and experiences to ensure every trip exceeds expectations.' },
    { icon: '🌱', title: 'Sustainability', description: 'Promoting responsible tourism that respects local cultures, protects environments, and supports communities.' },
    { icon: '⚡', title: 'Simplicity', description: 'Making complex travel logistics simple with intuitive design and seamless user experiences at every step.' },
    { icon: '🎨', title: 'Personalization', description: 'Tailoring recommendations and itineraries to match your unique travel style, preferences, and budget.' }
  ];

  const timeline = [
    { year: '2020', title: 'The Beginning', description: 'OffWeGo launches with 500 destinations across 30 countries. Our founding team of 5 starts this incredible journey.' },
    { year: '2021', title: 'Rapid Growth', description: 'Reached 100,000 users and expanded to 80 countries. Launched our mobile app on iOS and Android platforms.' },
    { year: '2022', title: 'Global Expansion', description: 'Crossed 1 million users. Introduced AI-powered itinerary planning and 24/7 customer support in 15 languages.' },
    { year: '2023', title: 'Innovation Leader', description: 'Won "Best Travel App" award. Launched virtual reality destination previews and sustainable travel options.' },
    { year: '2024', title: 'Record Breaking', description: 'Surpassed 2 million users worldwide. Partnered with 10,000+ hotels and airlines for exclusive deals.' },
    { year: '2025', title: 'The Future', description: 'Expanding our vision with new features, more destinations, and an even stronger global community.' }
  ];

  const achievements = [
    { icon: '🏆', title: 'Best Travel App 2023', description: 'Awarded by Global Tech Innovation Awards for excellence in user experience and innovation' },
    { icon: '⭐', title: '4.9 Star Rating', description: 'Consistently rated among the highest on both iOS App Store and Google Play Store' },
    { icon: '🌍', title: '150+ Countries', description: 'Expanded our coverage to include destinations across six continents' },
    { icon: '💚', title: 'Eco-Friendly Certified', description: 'Recognized for promoting sustainable tourism and carbon offset programs' },
    { icon: '🚀', title: 'Fastest Growing App', description: 'Featured as the fastest growing travel platform in 2024 by TechCrunch' },
    { icon: '👥', title: '2M+ Community', description: 'Built a vibrant community of travelers sharing experiences and recommendations' }
  ];

  const team = [
    {
      initials: 'SA',
      name: 'Sarah Anderson',
      role: 'CEO & Founder',
      bio: 'A visionary entrepreneur with 15+ years in the tourism industry. Sarah\'s passion for travel and technology led to the creation of OffWeGo.',
      social: ['L', 'T', 'E']
    },
    {
      initials: 'MJ',
      name: 'Michael Johnson',
      role: 'Chief Technology Officer',
      bio: 'Tech wizard and AI specialist with expertise in building scalable platforms. Michael leads our engineering team.',
      social: ['L', 'G', 'E']
    },
    {
      initials: 'EC',
      name: 'Emily Chen',
      role: 'Head of Design',
      bio: 'Award-winning UX/UI designer passionate about creating beautiful, intuitive interfaces for seamless experiences.',
      social: ['L', 'D', 'E']
    },
    {
      initials: 'DP',
      name: 'David Patel',
      role: 'Travel Content Director',
      bio: 'Globe-trotter extraordinaire who has explored 87 countries. David curates authentic travel experiences.',
      social: ['L', 'I', 'E']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with 3D Illustration Style */}
      <div className="relative bg-gradient-to-b from-blue-100 via-blue-50 to-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-6xl animate-bounce" style={{animationDuration: '3s'}}>🌴</div>
        <div className="absolute top-20 right-20 text-4xl animate-bounce" style={{animationDuration: '4s', animationDelay: '0.5s'}}>✈️</div>
        <div className="absolute bottom-10 left-1/4 text-5xl opacity-40">🏖️</div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-6xl font-bold mb-4 text-gray-900">About Us</h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            We're passionate about creating unforgettable travel experiences that connect people with the world's most amazing destinations
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg">
            Learn More
          </button>
        </div>

        {/* 3D Car Illustration Area */}
        <div className="absolute bottom-0 right-0 text-9xl opacity-20">🚗</div>
      </div>

      {/* Success Stories Section */}
      <div className="bg-gradient-to-b from-white via-yellow-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4">Success Stories</h2>
          <div className="w-32 h-1 bg-blue-600 mx-auto mb-16"></div>

          <div className="space-y-24">
            {successStories.map((story, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-4 text-gray-900">{story.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {story.description}
                  </p>
                  <button className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
                    Read More →
                  </button>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="relative w-80 h-80 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-full flex items-center justify-center text-9xl shadow-2xl">
                    {story.image}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-300 rounded-full opacity-70"></div>
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-300 rounded-full opacity-60"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4">What We Offer</h2>
          <div className="w-32 h-1 bg-yellow-400 mx-auto mb-8"></div>
          <p className="text-center text-gray-600 text-lg max-w-4xl mx-auto mb-16">
            Expert travel consultants providing personalized & exceptional service to guide you
            through every adventure. Our support team ensures seamless travel planning, while seamless
            communication keeps you informed every single step. Certified & International team from India's
            hidden gems to global adventures
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {offerings.map((offer, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-lg mx-auto mb-6 flex items-center justify-center text-5xl">
                  {offer.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{offer.title}</h3>
                <p className="text-gray-600">{offer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why It Works Section */}
      <div className="bg-gradient-to-b from-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16">Why It Works</h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized itinerary</h3>
              <p className="text-gray-600 text-sm">
                Expert guides & staff who care you, tailored to you and meet your needs always
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">🏛️</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Historical context</h3>
              <p className="text-gray-600 text-sm">
                Enabling to learn more about the rich heritage and culture of destinations guided
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Industry-expert feedback</h3>
              <p className="text-gray-600 text-sm">
                Real-time travel data insights & feedback that let you create seamless trips
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Values Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4">Our Mission & Values</h2>
          <div className="w-32 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-4xl mx-auto">
            We're on a mission to make travel planning effortless and inspire people to explore the world with confidence
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="text-6xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gradient-to-b from-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4">Our Journey</h2>
          <div className="w-32 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-center text-gray-600 text-lg mb-16">From a startup to a global platform</p>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {timeline.map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                onMouseEnter={() => setActiveTimeline(index)}
                onMouseLeave={() => setActiveTimeline(null)}
              >
                <div className="flex items-start gap-6">
                  <div className="text-3xl font-bold text-blue-600 min-w-[80px]">{item.year}</div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4">Our Achievements</h2>
          <div className="w-32 h-1 bg-yellow-400 mx-auto mb-16"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{achievement.title}</h4>
                <p className="text-gray-600 text-sm">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gradient-to-b from-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4">Meet Our Team</h2>
          <div className="w-32 h-1 bg-blue-600 mx-auto mb-16"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {member.initials}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-blue-600 text-sm font-semibold mb-3">{member.role}</div>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center gap-2">
                  {member.social.map((social, idx) => (
                    <button key={idx} className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-600 transition-colors">
                      {social}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-16 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Adventure?</h2>
            <p className="text-xl mb-8 opacity-95">Join millions of travelers who trust OffWeGo</p>
            <button className="bg-white text-blue-600 px-10 py-3 rounded-full text-lg font-bold hover:shadow-xl transition-all duration-300">
              Download Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">OFW-Go</h3>
          <p className="text-gray-400 mb-2">&copy; 2025 OffWeGo. All rights reserved.</p>
          <p className="text-gray-500 text-sm">Made with ❤️ by travelers, for travelers</p>
        </div>
      </footer>
    </div>
  );
}