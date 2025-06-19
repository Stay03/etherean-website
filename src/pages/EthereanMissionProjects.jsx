import React, { useState } from 'react';
import { Tabs, Tab, PanelGroup, Panel } from 'react-tabs';
import { ChevronRight, Heart, Book, School, Users, Globe, DollarSign, Send } from 'lucide-react';
import Hospital from '../assets/SAKAMAN-01-700x161.jpg';
import Breadcrumb from '../components/Breadcrumb';
const EthereanMissionProjects = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationName, setDonationName] = useState('');
  const [donationEmail, setDonationEmail] = useState('');
  const [donationType, setDonationType] = useState('general');

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would submit to a payment processor
    alert(`Thank you for your donation of $${donationAmount} to ${donationType}!`);
  };

  // Custom amount options
  const donationOptions = [10, 25, 50, 100];

   // Breadcrumb items
   const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/about/projects' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />


        

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex">
              <button 
                onClick={() => setActiveTab(0)}
                className={`py-4 px-6 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 0 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Heart size={18} className="mr-2" />
                About
              </button>
              <button 
                onClick={() => setActiveTab(1)}
                className={`py-4 px-6 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 1 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Book size={18} className="mr-2" />
                Hospital Complex
              </button>
              <button 
                onClick={() => setActiveTab(2)}
                className={`py-4 px-6 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 2 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <School size={18} className="mr-2" />
                School
              </button>
              <button 
                onClick={() => setActiveTab(3)}
                className={`py-4 px-6 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 3 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Users size={18} className="mr-2" />
                ELED
              </button>
              <button 
                onClick={() => setActiveTab(4)}
                className={`py-4 px-6 font-medium text-sm flex items-center whitespace-nowrap ${activeTab === 4 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Globe size={18} className="mr-2" />
                Peace
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* About Tab */}
            {activeTab === 0 && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About Our Projects</h2>
                  <p className="text-gray-700 mb-6">
                    Etherean Mission has taken on several projects to improve the lives of many. These include the Hospital Project, 
                    Education Scholarships, World Peace Project, the School Project and Research.
                  </p>
                  <div className="bg-indigo-50 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-semibold text-indigo-900 mb-3">The Pride of Etherean Mission</h3>
                    <p className="text-gray-700">
                      The wealth of its time-tested efficacious spiritual tools that address the Spiritual, Social, Psychological, 
                      Physical and Financial needs of humanity. These have been made possible by our regular research into the nature 
                      of mind and spirit and how these affect the various aspects of our human life. This on-going research requires 
                      huge funding.
                    </p>
                  </div>
                  <div className="flex space-x-4">

                    <button onClick={() => setActiveTab(1)} className="flex items-center bg-white border border-indigo-600 text-indigo-600 px-6 py-3 rounded-md hover:bg-indigo-50 transition-colors">
                      Explore Projects <ChevronRight size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
                
                {/* Donation Form */}
                <div className="bg-gray-50 p-6 rounded-lg shadow">
                  <DonationForm 
                    donationAmount={donationAmount}
                    setDonationAmount={setDonationAmount}
                    donationName={donationName}
                    setDonationName={setDonationName}
                    donationEmail={donationEmail}
                    setDonationEmail={setDonationEmail}
                    donationType={donationType}
                    setDonationType={setDonationType}
                    donationOptions={donationOptions}
                    handleDonationSubmit={handleDonationSubmit}
                  />
                </div>
              </div>
            )}

            {/* Hospital Complex Tab */}
            {activeTab === 1 && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Hospital Complex</h2>
                  <div className="mb-6">
                    <img src={Hospital} alt="Hospital Complex" className="w-full h-64 object-cover rounded-lg mb-4" />
                    <p className="text-gray-700 mb-4">
                      The Hospital Complex is on three floors and is at the final stages of completion awaiting funds for operation.
                    </p>
                    <ul className="space-y-4 mb-6">
                      <li className="flex items-start">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <span className="text-indigo-600 font-semibold">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Ground Floor</h4>
                          <p className="text-gray-700">
                            Will house the Complementary and Alternative Medicine, among others, will be employing the use of herbs, 
                            hydrotherapy, massages, yoga, walk therapy and chiropractic therapies.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <span className="text-indigo-600 font-semibold">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Middle Floor</h4>
                          <p className="text-gray-700">
                            Has a 45 bed in-patient ward and facilities for surgery.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <span className="text-indigo-600 font-semibold">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Top Floor</h4>
                          <p className="text-gray-700">
                            The spiritual hospital that will offer 24-hour unbroken prayer and will use our numerous 
                            spiritual mind sciences to promote health.
                          </p>
                        </div>
                      </li>
                    </ul>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <p className="italic text-green-800">
                        "Our focus is on adding life to your years and years to your life."
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Donation Form */}
                <div className="bg-gray-50 p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Hospital Donation</h3>
                  <DonationForm 
                    donationAmount={donationAmount}
                    setDonationAmount={setDonationAmount}
                    donationName={donationName}
                    setDonationName={setDonationName}
                    donationEmail={donationEmail}
                    setDonationEmail={setDonationEmail}
                    donationType="hospital"
                    setDonationType={setDonationType}
                    donationOptions={donationOptions}
                    handleDonationSubmit={handleDonationSubmit}
                  />
                </div>
              </div>
            )}

            {/* School Tab */}
            {activeTab === 2 && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">School Projects</h2>
                  <div className="mb-6">
                    <div className="bg-indigo-50 p-6 rounded-lg mb-6">
                      <h3 className="text-xl font-semibold text-indigo-900 mb-3">Growing The Empowered Child Program</h3>
                      <p className="text-gray-700">
                        We want to build a school for various communities. The school will use our Growing the Empowered Child (GEC) processes 
                        and games to empower children. An empowered child is the one who is happy, confident, creative, responsible and with a 
                        drive for excellence. Through our GEC programs, we have the tools to make that happen and building our own schools is 
                        the logical way forward.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Scholarships</h3>
                    <p className="text-gray-700 mb-4">
                      We want to offer Education Scholarships to deprived youths in Ghana and in every Etherean Mission centre in the world. 
                      The unique difference to this program is that, beneficiaries will be given spiritual education during their vacations 
                      to enable them to unleash their core potential and attain spiritual enlightenment and thus produce being of integrity.
                    </p>
                  </div>
                </div>
                
                {/* Donation Form */}
                <div className="bg-gray-50 p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Donate to School Projects</h3>
                  <DonationForm 
                    donationAmount={donationAmount}
                    setDonationAmount={setDonationAmount}
                    donationName={donationName}
                    setDonationName={setDonationName}
                    donationEmail={donationEmail}
                    setDonationEmail={setDonationEmail}
                    donationType="school"
                    setDonationType={setDonationType}
                    donationOptions={donationOptions}
                    handleDonationSubmit={handleDonationSubmit}
                  />
                </div>
              </div>
            )}

            {/* ELED Tab */}
            {activeTab === 3 && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Institutes for Essential Life Education</h2>
                  <div className="mb-6">
                    <p className="text-gray-700 mb-6">
                      Essential Life Education (ELED) is the provision of the Knowledge of the Self and of Relationship and it is the 
                      foundation of Human-Centred Civilization as opposed to the current Structure-based Civilization, which is bound 
                      to collapse on itself. Our goal is to have Foundations to sponsor institutes to promote this knowledge system to 
                      schools and to offer adult education on our radio and TV media.
                    </p>
            
                  </div>
                </div>
                
                {/* Donation Form */}
                <div className="bg-gray-50 p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Support ELED</h3>
                  <DonationForm 
                    donationAmount={donationAmount}
                    setDonationAmount={setDonationAmount}
                    donationName={donationName}
                    setDonationName={setDonationName}
                    donationEmail={donationEmail}
                    setDonationEmail={setDonationEmail}
                    donationType="eled"
                    setDonationType={setDonationType}
                    donationOptions={donationOptions}
                    handleDonationSubmit={handleDonationSubmit}
                  />
                </div>
              </div>
            )}

            {/* Peace Tab */}
            {activeTab === 4 && (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">World Peace Project</h2>
                  <div className="mb-6">
                    <p className="text-gray-700 mb-6">
                      The world peace project is to address the fundamental causes to inner conflicts that eventually result in 
                      outer conflicts and war. It will create the culture of peace, show the processes to peace and provide the 
                      tools for peace.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Heart size={24} className="text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Culture of Peace</h4>
                        <p className="text-sm text-gray-600">Promoting values that foster harmony and mutual respect</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users size={24} className="text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Processes to Peace</h4>
                        <p className="text-sm text-gray-600">Establishing frameworks for conflict resolution</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Send size={24} className="text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Tools for Peace</h4>
                        <p className="text-sm text-gray-600">Providing resources to maintain inner and outer harmony</p>
                      </div>
                    </div>
                    
            
                  </div>
                </div>
                
                {/* Donation Form */}
                <div className="bg-gray-50 p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">World Peace Project Donation</h3>
                  <DonationForm 
                    donationAmount={donationAmount}
                    setDonationAmount={setDonationAmount}
                    donationName={donationName}
                    setDonationName={setDonationName}
                    donationEmail={donationEmail}
                    setDonationEmail={setDonationEmail}
                    donationType="peace"
                    setDonationType={setDonationType}
                    donationOptions={donationOptions}
                    handleDonationSubmit={handleDonationSubmit}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Donation Form Component
const DonationForm = ({ 
  donationAmount, 
  setDonationAmount, 
  donationName,
  setDonationName,
  donationEmail,
  setDonationEmail,
  donationType,
  setDonationType,
  donationOptions,
  handleDonationSubmit
}) => {
  return (
    <form onSubmit={handleDonationSubmit}>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Support Our Mission
      </h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Select Amount
        </label>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {donationOptions.map(amount => (
            <button
              key={amount}
              type="button"
              onClick={() => setDonationAmount(amount.toString())}
              className={`py-2 px-4 text-center border rounded-md transition-colors ${
                donationAmount === amount.toString() 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign size={16} className="text-gray-500" />
          </div>
          <input
            type="text"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder="Custom Amount"
            className="pl-8 w-full py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Your Name
        </label>
        <input
          type="text"
          value={donationName}
          onChange={(e) => setDonationName(e.target.value)}
          placeholder="John Doe"
          className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={donationEmail}
          onChange={(e) => setDonationEmail(e.target.value)}
          placeholder="john@example.com"
          className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
      >
        <Heart size={16} className="mr-2" />
        Donate Now
      </button>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        Your donation helps us continue our mission to improve lives around the world.
      </p>
    </form>
  );
};

export default EthereanMissionProjects;