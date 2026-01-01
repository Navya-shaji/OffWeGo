import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Globe, Users, Headphones, Building2, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useState } from "react";

const ExpandedContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    preferredContact: "email",
    travelType: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e:any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        preferredContact: "email",
        travelType: ""
      });
    }, 3000);
  };

  const departments = [
    {
      icon: Headphones,
      title: "Customer Support",
      description: "General inquiries and assistance",
      email: "support@offwego.com",
      phone: "+1 (234) 567-890",
      color: "blue"
    },
    {
      icon: Building2,
      title: "Sales & Partnerships",
      description: "Business opportunities and collaborations",
      email: "sales@offwego.com",
      phone: "+1 (234) 567-891",
      color: "purple"
    },
    {
      icon: Users,
      title: "Travel Specialists",
      description: "Customized travel planning",
      email: "specialists@offwego.com",
      phone: "+1 (234) 567-892",
      color: "green"
    },
    {
      icon: Globe,
      title: "International Office",
      description: "Global support and inquiries",
      email: "international@offwego.com",
      phone: "+44 (20) 1234-5678",
      color: "orange"
    }
  ];

  const offices = [
    {
      city: "New York (HQ)",
      address: "123 Travel Avenue, Suite 500",
      region: "New York, NY 10001",
      country: "United States",
      phone: "+1 (234) 567-890"
    },
    {
      city: "London",
      address: "456 Explorer Street",
      region: "London W1A 1AA",
      country: "United Kingdom",
      phone: "+44 (20) 1234-5678"
    },
    {
      city: "Singapore",
      address: "789 Adventure Road",
      region: "Singapore 123456",
      country: "Singapore",
      phone: "+65 1234-5678"
    },
    {
      city: "Dubai",
      address: "321 Discovery Boulevard",
      region: "Dubai, UAE",
      country: "United Arab Emirates",
      phone: "+971 4 123-4567"
    }
  ];

  const faqs = [
    {
      question: "What are your operating hours?",
      answer: "Our customer support team is available Monday to Friday, 8am to 6pm EST. We also offer limited support on Saturdays from 9am to 4pm EST."
    },
    {
      question: "How quickly will I receive a response?",
      answer: "We typically respond to all inquiries within 24 hours during business days. Urgent matters are prioritized and may receive faster responses."
    },
    {
      question: "Do you offer travel insurance?",
      answer: "Yes, we partner with leading insurance providers to offer comprehensive travel insurance options. Contact our specialists for more information."
    },
    {
      question: "Can I modify my booking?",
      answer: "Booking modifications depend on the specific terms of your reservation. Please contact our support team with your booking reference for assistance."
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      green: "bg-green-100 text-green-600",
      orange: "bg-orange-100 text-orange-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">
            We're Here to Help
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Have questions about your journey? Our team of travel experts is ready to assist you every step of the way.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Response Time", value: "< 24 hrs", icon: Clock },
            { label: "Countries Covered", value: "150+", icon: Globe },
            { label: "Happy Travelers", value: "50K+", icon: Users },
            { label: "Support Staff", value: "100+", icon: Headphones }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
              <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Departments */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Contact Our Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <div className={`${getColorClasses(dept.color)} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <dept.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{dept.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
                <div className="space-y-2 text-sm">
                  <a href={`mailto:${dept.email}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{dept.email}</span>
                  </a>
                  <a href={`tel:${dept.phone}`} className="flex items-center gap-2 text-green-600 hover:text-green-700">
                    <Phone className="w-4 h-4" />
                    {dept.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-7 h-7 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                  <p className="text-sm text-gray-600">Fill out the form and we'll get back to you soon</p>
                </div>
              </div>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-green-900 mb-2">Message Sent Successfully!</h3>
                  <p className="text-green-700 mb-4">
                    Thank you for contacting Off We Go. Our team will review your message and respond within 24 hours.
                  </p>
                  <p className="text-sm text-green-600">
                    Check your email for a confirmation message.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="+1 (234) 567-890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Travel Type
                      </label>
                      <select
                        name="travelType"
                        value={formData.travelType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      >
                        <option value="">Select type</option>
                        <option value="solo">Solo Travel</option>
                        <option value="couple">Couple/Romantic</option>
                        <option value="family">Family</option>
                        <option value="group">Group</option>
                        <option value="business">Business</option>
                        <option value="adventure">Adventure</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="booking">Booking Support</option>
                      <option value="destinations">Destination Information</option>
                      <option value="customized">Customized Travel Planning</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="complaint">Complaint/Issue</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method *
                    </label>
                    <div className="flex gap-4">
                      {["email", "phone", "both"].map((method) => (
                        <label key={method} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value={method}
                            checked={formData.preferredContact === method}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 capitalize">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                      placeholder="Tell us more about your travel plans or inquiry..."
                    ></textarea>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Business Hours */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium text-gray-900">8am - 6pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium text-gray-900">9am - 4pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-gray-900">Closed</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    All times in Eastern Standard Time (EST)
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Emergency Support
              </h3>
              <p className="text-sm text-red-700 mb-3">
                For urgent travel emergencies, call our 24/7 hotline
              </p>
              <a href="tel:+11234567899" className="text-red-600 font-bold text-lg hover:text-red-700">
                +1 (234) 567-899
              </a>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Connect With Us</h3>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { icon: Facebook, color: "hover:bg-blue-600" },
                  { icon: Twitter, color: "hover:bg-sky-500" },
                  { icon: Instagram, color: "hover:bg-pink-600" },
                  { icon: Linkedin, color: "hover:bg-blue-700" },
                  { icon: Youtube, color: "hover:bg-red-600" }
                ].map((social, idx) => (
                  <button
                    key={idx}
                    className={`bg-gray-100 ${social.color} hover:text-white p-3 rounded-lg transition-colors`}
                  >
                    <social.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Office Locations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Global Offices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">{office.city}</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>{office.address}</p>
                  <p>{office.region}</p>
                  <p className="font-medium text-gray-700">{office.country}</p>
                  <a href={`tel:${office.phone}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 pt-2">
                    <Phone className="w-4 h-4" />
                    {office.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <div className="text-center text-blue-700">
              <MapPin className="w-16 h-16 mx-auto mb-3" />
              <p className="text-lg font-semibold">Headquarters Location</p>
              <p className="text-sm">Integrate Google Maps here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedContactUsPage;