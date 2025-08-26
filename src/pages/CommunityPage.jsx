import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CommunityPage = () => {
  // Import UK banner image
  const ukBannerImage = require('../assets/Church-UK-banner.jpg');
  
  // Get auth context
  const { user } = useAuth();
  
  // State for active tab in Learn More section
  const [activeTab, setActiveTab] = useState('evolve');
  
  // State for quotes slider
  const [currentQuote, setCurrentQuote] = useState(0);
  
  // Quotes data
  const quotes = [
    {
      text: "Whatever is happening in our life, God knows about it.",
      author: "Sis. Joan Tetteh, Etherean Mission"
    },
    {
      text: "Life is God and God is life.",
      author: "Brother Ernest Ntim-Ofori"
    }
  ];

  // Auto-slide quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Breadcrumb with UK Banner Background */}
      <div 
        className="relative w-full pt-64 pb-52 rounded-3xl overflow-hidden  object-bottom"
        style={{
          backgroundImage: `url(${ukBannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Banner Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">SPIRITUALITY AT ITS BEST</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose max-w-none">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Spiritual Growth</h2>
              <p className="text-lg mb-6 leading-relaxed">
                Etherean Mission is the road to total spiritual freedom and creative abilities. It gives you the opportunity to study the core principles of life and provides you with the requisite tools and abilities to handle life and the universe you live in.
              </p>
              
              <p className="text-lg mb-6 leading-relaxed">
                We are Spiritual Educators for the realization of the finished kingdom of God that is present in everybody.
              </p>
              
              <p className="text-lg mb-6 leading-relaxed">
                Etherean Mission is a place of joy, where all are supported to discover and express the highest good and purity that they are. Each person embodies the full pure presence of God and our conscious practice, therefore is to see and express the good and the divine in ourselves and in all of life. That is the practice of love.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Spiritual University</h2>
              <p className="text-lg mb-6 leading-relaxed">
                When Christianity missed out on Jesus' teaching that the Kingdom of God is within each one of us, it lost its touch with spirituality and that is where Etherean Mission starts its spiritual journey.
              </p>
              
              <p className="text-lg mb-6 leading-relaxed">
                Etherean Mission is rich with spiritual wisdom, and we may best be described as the University of Spirituality.
              </p>
              
              <p className="text-lg mb-6 leading-relaxed">
                There are two school systems in life; Secular Education, provided by our school systems and Spiritual Education that is to be provided by our religious institutions.
              </p>
              
              <p className="text-lg mb-6 leading-relaxed">
                When it comes to Spiritual Education, most religious bodies are virtually bankrupt. Religion has become a set of fear based dogmas that keep changing from one religious sect to the other. Spirituality on the other hand is to listen to the Indwelling Presence and do what is right for you and the world you live in.
              </p>
              
              <p className="text-lg leading-relaxed">
                Religion separates people, spirituality unites all. Religion is about hell fire and a final destiny, spirituality teaches the immutable of karma and puts you on your own unique eternal journey. As unique that everyone is, each person has a unique path for his or her soul evolution.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Show Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg">
          {/* First Row - Text Left, Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
            {/* Text Content */}
            <div className="p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Working to Activate the Good in One Another</h2>
              <p className="text-lg mb-4 leading-relaxed text-gray-700">
                Promote the good you see in one another.
              </p>
              <p className="text-lg mb-6 leading-relaxed text-gray-700">
                Be the corrected version of the wrong you see in someone.
              </p>
              <div>
                <Link 
                  to="/events" 
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-6 rounded-full transition-colors duration-300"
                >
                  View Our Events
                </Link>
              </div>
            </div>
            
            {/* Image */}
            <div className="p-8 flex items-center justify-center">
              <img
                src={require('../assets/communityPage/drish2-300x191.jpg')}
                alt="Community Gathering"
                className="max-w-full h-80 object-contain rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Second Row - Image Left, Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch border-t border-gray-200">
            {/* Image */}
            <div className="p-8 lg:order-1 flex items-center justify-center">
              <img
                src={require('../assets/communityPage/Hour-of-Empowerment3-248x300.png')}
                alt="Hour of Empowerment"
                className="max-w-full h-80 object-contain rounded-lg shadow-md"
              />
            </div>
            
            {/* Text Content */}
            <div className="p-8 lg:order-2 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Give To Us</h2>
              <p className="text-lg mb-4 leading-relaxed text-gray-700">
                Everyone confirms that our teachings are second to none.
              </p>
              <p className="text-lg mb-4 leading-relaxed text-gray-700">
                Your duty is to take it to the world. You owe the world a legacy of peace through the dissemination of our teachings.
              </p>
              <p className="text-lg mb-6 leading-relaxed text-gray-700">
                With your giving, collectively, we meet the needs of humanity and enhance our individual and collective evolution.
              </p>
              <div>
                <Link 
                  to="/donate" 
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-6 rounded-full transition-colors duration-300"
                >
                  Give Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learn More Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg">
       

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex justify-center">
              <div className="flex space-x-8 px-8">
                {['evolve', 'service', 'impact'].map((tab) => (
                  <button
                    key={tab}
                    className={`py-4 px-6 font-semibold text-lg capitalize border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-yellow-500 text-yellow-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Evolve Tab */}
            {activeTab === 'evolve' && (
              <div className="prose max-w-none">
                <p className="text-lg mb-4 leading-relaxed text-gray-700">
                  We are all units of life in the body of life, here to Evolve.
                </p>
                
                <p className="text-lg mb-4 leading-relaxed text-gray-700">
                  To evolve means, you identify your God virtues and grow them.
                </p>
                
                <p className="text-lg mb-6 leading-relaxed text-gray-700">
                  You are here to be more Love, Joy, Wisdom, Evolutionary Intelligence and Creativity
                </p>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                  <p className="text-lg font-semibold text-gray-800">
                    In summary:
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700 mt-2">
                    We are all units of life in the body of life, here to Evolve, to Serve Life for the Promotion of Life.
                  </p>
                </div>
              </div>
            )}

            {/* Service Tab */}
            {activeTab === 'service' && (
              <div className="prose max-w-none">
                <p className="text-lg mb-4 leading-relaxed text-gray-700">
                  We are all units of life in the body of life, here to Give Service.
                </p>
                
                <p className="text-lg mb-4 leading-relaxed text-gray-700">
                  Everything in life is here to service to another life unit.
                  Use every opportunity to give service and if you do not find any, create new opportunities to serve life.
                </p>
                
                <p className="text-lg mb-6 leading-relaxed text-gray-700">
                  Serve the Church by looking for what is needed and be its provider.
                </p>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                  <p className="text-lg font-semibold text-gray-800">
                    In summary, this is what you must know:
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700 mt-2">
                    We are all units of life in the body of life, here to Evolve, to Serve Life for the Promotion of Life.
                  </p>
                </div>
              </div>
            )}

            {/* Impact Tab */}
            {activeTab === 'impact' && (
              <div className="prose max-w-none">
                <p className="text-lg mb-4 leading-relaxed text-gray-700">
                  We are all units of life in the body of life, here to Impact Life.
                </p>
                
                <p className="text-lg mb-4 leading-relaxed text-gray-700">
                  Legacy is encapsulated and impactful lasting good.
                </p>
                
                <p className="text-lg mb-4 leading-relaxed text-gray-700">
                  The power of your legacy is measured by how well the good is preserved in its sanity and how long it lasts.
                  Legacy is what you did that touched the lives people.
                  Legacy is the profiting and expansion of your innate God Virtues.
                  Legacy is the Cosmic Mission of Your Soul.
                  Legacy gives you Cosmic Character.
                </p>
                
                <p className="text-lg mb-4 leading-relaxed text-gray-700">
                  Package the Spirit that touched the people so that it outlives you by centuries.
                  What image of my spirit do I want to leave behind eternally?
                </p>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                  <p className="text-lg font-semibold text-gray-800">
                    In Summary:
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700 mt-2">
                    We are all units of life in the body of life, here to Evolve, to Serve Life for the Promotion of Life.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quotes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div 
          className="relative rounded-lg overflow-hidden shadow-lg"
          style={{
            backgroundImage: `url(${require('../assets/communityPage/quote.jpg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '400px'
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          
          {/* Quotes Content */}
          <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center min-h-[400px]">
            <div className="max-w-4xl mx-auto text-center">
              {/* Quote Slider */}
              <div className="relative overflow-hidden">
                {quotes.map((quote, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-1000 ease-in-out ${
                      index === currentQuote
                        ? 'opacity-100 transform translate-x-0'
                        : index < currentQuote
                        ? 'opacity-0 transform -translate-x-full absolute inset-0'
                        : 'opacity-0 transform translate-x-full absolute inset-0'
                    }`}
                  >
                    <blockquote className="text-2xl md:text-3xl font-light text-white leading-relaxed mb-6">
                      "{quote.text}"
                    </blockquote>
                    <cite className="text-lg text-yellow-300 font-medium">
                      — {quote.author}
                    </cite>
                  </div>
                ))}
              </div>

              {/* Quote Indicators */}
              <div className="flex justify-center space-x-2 mt-8">
                {quotes.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === currentQuote ? 'bg-yellow-300' : 'bg-white bg-opacity-40'
                    }`}
                    onClick={() => setCurrentQuote(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Our Community Section - Only show if user is not logged in */}
      {!user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Join Our Community
              </h2>
              
              <p className="text-lg md:text-xl text-gray-800 mb-8 leading-relaxed">
                Become part of a vibrant spiritual community dedicated to growth, service, and making a lasting impact. 
                Connect with like-minded individuals on a journey of spiritual evolution and discover your divine purpose.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/membership" 
                  className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-full transition-colors duration-300 text-lg shadow-lg"
                >
                  Sign Up Now
                </Link>
                
                <Link 
                  to="/about" 
                  className="inline-block bg-transparent hover:bg-white hover:bg-opacity-20 text-gray-900 border-2 border-gray-900 font-semibold py-4 px-8 rounded-full transition-all duration-300 text-lg"
                >
                  Learn More About Us
                </Link>
              </div>
              
              <div className="mt-8 text-sm text-gray-700">
                <p>Already have an account? 
                  <Link to="/login" className="font-semibold hover:underline ml-1">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;