import  { useState } from 'react';

export default function AboutUs() {
  const [activeTimeline, setActiveTimeline] = useState(null);

  const stats = [
    { number: '2M+', label: 'Happy Travelers' },
    { number: '150+', label: 'Countries Covered' },
    { number: '50K+', label: 'Travel Destinations' },
    { number: '4.9★', label: 'User Rating' }
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
      bio: 'A visionary entrepreneur with 15+ years in the tourism industry. Sarah\'s passion for travel and technology led to the creation of OffWeGo. She has personally visited 95 countries and believes everyone deserves accessible travel experiences.',
      social: ['LinkedIn', 'Twitter', 'Email']
    },
    {
      initials: 'MJ',
      name: 'Michael Johnson',
      role: 'Chief Technology Officer',
      bio: 'Tech wizard and AI specialist with expertise in building scalable platforms. Michael leads our engineering team to create seamless user experiences. Former lead engineer at major tech companies, now bringing innovation to travel.',
      social: ['LinkedIn', 'GitHub', 'Email']
    },
    {
      initials: 'EC',
      name: 'Emily Chen',
      role: 'Head of Design',
      bio: 'Award-winning UX/UI designer passionate about creating beautiful, intuitive interfaces. Emily believes design should make complex tasks feel effortless. Her work has been featured in major design publications worldwide.',
      social: ['LinkedIn', 'Dribbble', 'Email']
    },
    {
      initials: 'DP',
      name: 'David Patel',
      role: 'Travel Content Director',
      bio: 'Globe-trotter extraordinaire who has explored 87 countries and counting. David curates authentic travel experiences and hidden gems. Former travel journalist bringing insider knowledge to our platform.',
      social: ['LinkedIn', 'Instagram', 'Email']
    },
    {
      initials: 'LM',
      name: 'Lisa Martinez',
      role: 'Head of Customer Success',
      bio: 'Dedicated to ensuring every traveler has an exceptional experience. Lisa leads our 24/7 support team across 15 languages. Her commitment to customer satisfaction has earned OffWeGo its stellar reputation.',
      social: ['LinkedIn', 'Twitter', 'Email']
    },
    {
      initials: 'JK',
      name: 'James Kim',
      role: 'VP of Partnerships',
      bio: 'Master negotiator who has secured partnerships with thousands of hotels, airlines, and local businesses worldwide. James ensures our users get exclusive deals and authentic local experiences.',
      social: ['LinkedIn', 'Twitter', 'Email']
    },
    {
      initials: 'AN',
      name: 'Aisha Nkrumah',
      role: 'Head of Sustainability',
      bio: 'Environmental advocate championing responsible tourism. Aisha develops programs that minimize travel impact while maximizing positive contributions to local communities and environments.',
      social: ['LinkedIn', 'Twitter', 'Email']
    },
    {
      initials: 'RG',
      name: 'Roberto Garcia',
      role: 'Chief Marketing Officer',
      bio: 'Creative storyteller with a knack for connecting with audiences worldwide. Roberto leads our marketing strategy and brand development, sharing inspiring travel stories that motivate millions to explore.',
      social: ['LinkedIn', 'Instagram', 'Email']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full animate-pulse delay-700"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">About OffWeGo</h1>
          <p className="text-2xl mb-4 opacity-95">Transforming the way the world travels, one adventure at a time</p>
          <p className="text-lg opacity-90">Your journey begins with us. Let's explore the world together.</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-5xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl shadow-lg p-12">
          <h2 className="text-5xl font-bold text-center text-indigo-600 mb-12 relative pb-6">
            Our Story
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded"></div>
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-indigo-600 mb-4">How It All Began</h3>
              <p className="text-gray-600 text-lg mb-6">
                OffWeGo was born from a simple idea: travel should be accessible, exciting, and stress-free for everyone. Our founder, Sarah, was frustrated with the complexity of planning international trips and wished for a single platform that could handle everything.
              </p>
              <p className="text-gray-600 text-lg mb-6">
                In 2020, during unprecedented times, we launched OffWeGo with a mission to revolutionize travel planning. What started as a small team of five passionate individuals has now grown into a global community serving millions of travelers worldwide.
              </p>
              <p className="text-gray-600 text-lg">
                Today, we're proud to be the leading travel companion app, helping adventurers discover new horizons and create unforgettable memories.
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl h-96 flex items-center justify-center text-8xl shadow-xl">
              🌍✈️
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Values Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl shadow-lg p-12">
          <h2 className="text-5xl font-bold text-center text-indigo-600 mb-6 relative pb-6">
            Our Mission & Vision
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded"></div>
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-4xl mx-auto">
            We're on a mission to make travel planning effortless and inspire people to explore the world with confidence. Our vision is to become the world's most trusted travel platform, connecting cultures and creating global citizens.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-transparent hover:border-indigo-600 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-6xl mb-6">{value.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl shadow-lg p-12">
          <h2 className="text-5xl font-bold text-center text-indigo-600 mb-6 relative pb-6">
            Our Journey
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded"></div>
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12">From a startup to a global platform - here's how we grew</p>
          
          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <div 
                key={index} 
                className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}
                onMouseLeave={() => setActiveTimeline(null)}
              >
                <div className={`bg-gray-50 rounded-xl p-6 border-2 ${activeTimeline === index ? 'border-indigo-600 shadow-lg' : 'border-gray-200'} transition-all duration-300`}>
                  <div className="text-2xl font-bold text-indigo-600 mb-2">{item.year}</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                <div className="hidden md:block absolute top-6 w-6 h-6 bg-indigo-600 rounded-full border-4 border-white shadow-lg" style={{
                  left: index % 2 === 0 ? 'auto' : '-12px',
                  right: index % 2 === 0 ? '-12px' : 'auto'
                }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl shadow-lg p-12">
          <h2 className="text-5xl font-bold text-center text-indigo-600 mb-6 relative pb-6">
            Our Achievements
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded"></div>
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12">Recognition and milestones we're proud of</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border-l-4 border-indigo-600 hover:bg-white hover:shadow-lg transform hover:translate-x-2 transition-all duration-300">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h4 className="text-xl font-bold text-indigo-600 mb-2">{achievement.title}</h4>
                <p className="text-gray-600 text-sm">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl shadow-lg p-12">
          <h2 className="text-5xl font-bold text-center text-indigo-600 mb-6 relative pb-6">
            Meet Our Team
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded"></div>
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12">The passionate individuals dedicated to making your travel dreams come true</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-transparent hover:border-indigo-600 hover:shadow-xl transform hover:-translate-y-3 transition-all duration-300">
                <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                  {member.initials}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <div className="text-indigo-600 font-semibold mb-4">{member.role}</div>
                <p className="text-gray-600 text-sm mb-6">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  {member.social.map((social, idx) => (
                    <button key={idx} className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-purple-600 transform hover:scale-110 transition-all duration-300">
                      {social[0]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-16 text-center text-white">
          <h2 className="text-5xl font-bold mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-8 opacity-95">Join millions of travelers who trust OffWeGo for their journeys</p>
          <button className="bg-white text-indigo-600 px-12 py-4 rounded-full text-xl font-bold hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            Download OffWeGo Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white text-center py-12 text-gray-600">
        <p className="text-lg">&copy; 2025 OffWeGo. Inspiring adventures, connecting the world, one journey at a time.</p>
        <p className="mt-3 text-sm">Made with ❤️ by travelers, for travelers</p>
      </footer>
    </div>
  );
}