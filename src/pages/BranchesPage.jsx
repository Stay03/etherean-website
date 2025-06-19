import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';

/**
 * BranchesPage Component
 * Displays branch information in tabbed sections
 */
const BranchesPage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('headquarters');
  // State for board member images
  const [boardMembers, setBoardMembers] = useState([]);
  // State for executive council member images
  const [executiveMembers, setExecutiveMembers] = useState([]);
  // State for UK branch images
  const [ukImages, setUkImages] = useState([]);
  // State for uMunthu branch images
  const [uMunthuImages, setUMunthuImages] = useState([]);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Branches', path: '/branches' }
  ];

  // Tab data
  const tabs = [
    { id: 'headquarters', label: 'HEADQUARTERS' },
    { id: 'uk', label: 'ETHEREAN MISSION UK' },
    { id: 'tdi', label: 'ETHEREAN T\'DI' },
    { id: 'kumasi', label: 'ETHEREAN KUMASI' },
    { id: 'conscious-humanity', label: 'CONSCIOUS HUMANITY' },
    { id: 'conscious-umunthu', label: 'CONSCIOUS UMUNTHU' }
  ];

  // Load board member images using require.context
  useEffect(() => {
    try {
      // Use require.context to get all images from assets/board directory
      const boardImagesContext = require.context('../assets/board', false, /\.(png|jpe?g|svg)$/);
      const imageKeys = boardImagesContext.keys();

      // Process image files to create board member objects
      const members = imageKeys.map(key => {
        // Extract name from filename (assuming format: "firstname-lastname.jpg")
        const filename = key.replace('./', '');
        const nameWithoutExtension = filename.substring(0, filename.lastIndexOf('.'));
        const name = nameWithoutExtension.split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');

        return {
          name,
          image: boardImagesContext(key),
          title: '', // Default title, can be updated if you have specific titles
        };
      });

      setBoardMembers(members);
    } catch (error) {
      console.error('Failed to load board member images:', error);
      setBoardMembers([]);
    }
  }, []);

  // Load executive council member images using require.context
  useEffect(() => {
    try {
      // Use require.context to get all images from assets/executive directory
      const executiveImagesContext = require.context('../assets/executive', false, /\.(png|jpe?g|svg)$/);
      const imageKeys = executiveImagesContext.keys();

      // Process image files to create executive member objects
      const members = imageKeys.map(key => {
        // Extract name from filename (assuming format: "firstname-lastname.jpg")
        const filename = key.replace('./', '');
        const nameWithoutExtension = filename.substring(0, filename.lastIndexOf('.'));
        const name = nameWithoutExtension.split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');

        return {
          name,
          image: executiveImagesContext(key),
          title: '', // Default title, can be updated if you have specific titles
        };
      });

      setExecutiveMembers(members);
    } catch (error) {
      console.error('Failed to load executive council member images:', error);
      setExecutiveMembers([]);
    }
  }, []);

  // Load UK branch images using require.context
  useEffect(() => {
    try {
      // Use require.context to get all images from assets/uk directory
      const ukImagesContext = require.context('../assets/uk', false, /\.(png|jpe?g|svg)$/);
      const imageKeys = ukImagesContext.keys();

      // Process image files to create image objects
      const images = imageKeys.map(key => ({
        image: ukImagesContext(key),
        alt: key.replace('./', '').replace(/\.(png|jpe?g|svg)$/, ''), // Use filename as alt text
      }));

      setUkImages(images);
    } catch (error) {
      console.error('Failed to load UK branch images:', error);
      setUkImages([]);
    }
  }, []);

  // Load uMunthu branch images using require.context
  useEffect(() => {
    try {
      // Use require.context to get all images from assets/uMunthu directory
      const uMunthuImagesContext = require.context('../assets/uMunthu', false, /\.(png|jpe?g|svg)$/);
      const imageKeys = uMunthuImagesContext.keys();

      // Process image files to create image objects
      const images = imageKeys.map(key => ({
        image: uMunthuImagesContext(key),
        alt: key.replace('./', '').replace(/\.(png|jpe?g|svg)$/, ''), // Use filename as alt text
      }));

      setUMunthuImages(images);
    } catch (error) {
      console.error('Failed to load uMunthu branch images:', error);
      setUMunthuImages([]);
    }
  }, []);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Smooth scroll to content on mobile
    if (window.innerWidth < 768) {
      const contentElement = document.getElementById('tab-content');
      if (contentElement) {
        setTimeout(() => {
          contentElement.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Tab Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide py-2 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`whitespace-nowrap px-5 py-3 font-medium text-sm border-b-2 ${
                  activeTab === tab.id
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors mr-4`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div id="tab-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {/* HEADQUARTERS */}
          {activeTab === 'headquarters' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Headquarters</h2>
              <div className="prose max-w-none">
                <p className="font-semibold">Etherean Mission Headquarters is located on the General Ankrah High Street, Sakaman, Accra.</p>

                <h3 className="text-xl font-semibold mt-6 mb-3">DIRECTIONS TO SITE</h3>
                <p>We are in Sakaman, South Odorkor. Depending on where you are coming from the following directions will bring you home.</p>

                <div className="mt-4">
                  <h4 className="text-lg font-semibold">PATH 1:</h4>
                  <ol className="list-decimal pl-6 mb-4">
                    <li>From Odorkor Trotro Station going towards Malam, take left at the first traffic lights; it leads to Dansoman.</li>
                    <li>From this junction, you will meet Shell and then Goil Filling Stations on the right.</li>
                    <li>Our Church Temple with the big Hospital Complex is on the right after the Goil Filling Station. And that is about 3 minutes walk from the junction traffic lights. Look for the big signboard.</li>
                  </ol>
                </div>

                <div className="mt-4">
                  <h4 className="text-lg font-semibold">PATH 2:</h4>
                  <ol className="list-decimal pl-6 mb-4">
                    <li>From Malam going towards Kaneshie, take right at the first traffic lights; it leads to Dansoman.</li>
                    <li>From this junction, you will meet Shell and then Goil Filling Stations on the right.</li>
                    <li>Our Church Temple with the big Hospital Complex is on the right after the Goil Filling Station. And that is about 3 minutes walk from the junction traffic lights. Look for the big signboard.</li>
                  </ol>
                </div>

                <div className="mt-4">
                  <h4 className="text-lg font-semibold">PATH 3:</h4>
                  <ol className="list-decimal pl-6 mb-4">
                    <li>From Dansoman Round About, going towards Winneba Road, look for the Sakaman Taxi rank and continue towards the main Winneba Road.</li>
                    <li>From Sakaman Taxi rank you will meet the Church before Goil Filling Stations on the left.</li>
                    <li>Our Church Temple with the big Hospital Complex is on the left before the Goil Filling Station. And that is about 2 minutes walk from the Sakaman Taxi rank. Look for the big signboard.</li>
                  </ol>
                </div>

                {/* Board of Trustees Section */}
                <h3 className="text-xl font-semibold mt-8 mb-4">BOARD OF TRUSTEES</h3>

                {boardMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {boardMembers.map((member, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="w-48 h-48 rounded-full overflow-hidden mb-4">
                          <img
                            src={member.image}
                            alt={`${member.name} - Board of Trustees`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="text-lg font-semibold text-center">{member.name}</h4>
                        <p className="text-gray-600 text-center">{member.title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Loading board members...</p>
                )}

                {/* Executive Council Section */}
                <h3 className="text-xl font-semibold mt-8 mb-4">EXECUTIVE COUNCIL</h3>

                {executiveMembers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {executiveMembers.map((member, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="w-48 h-48 rounded-full overflow-hidden mb-4">
                          <img
                            src={member.image}
                            alt={`${member.name} - Executive Council`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="text-lg font-semibold text-center">{member.name}</h4>
                        <p className="text-gray-600 text-center">{member.title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Loading executive council members...</p>
                )}
              </div>
            </div>
          )}

          {/* ETHEREAN MISSION UK */}
          {activeTab === 'uk' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Etherean Mission UK</h2>
              <div className="prose max-w-none">
                <p>Etherean Mission UK was founded in May 1983 by our Leader, Brother Ishmael Tetteh.</p>
                <p>Through this centre, the Awakening Message has reached to many souls.</p>
                <p className="mt-4">The Mission is currently located at:</p>
                <p className="font-semibold">
                  58 Gorringe Park Avenue,<br />
                  Mitcham, Surrey CR4 2DG<br />
                  Phone: 020 8646 6129
                </p>

                {/* UK Branch Gallery Section */}
                <h3 className="text-xl font-semibold mt-8 mb-4">GALLERY</h3>

                {ukImages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {ukImages.map((image, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="w-full h-64 overflow-hidden mb-4">
                          <img
                            src={image.image}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Loading UK branch images...</p>
                )}
              </div>
            </div>
          )}

          {/* ETHEREAN T'DI */}
          {activeTab === 'tdi' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Etherean T'Di</h2>
              <div className="prose max-w-none">
                <p>Takoradi</p>
                <p className="font-semibold">
                  Dave Street<br />
                  Ananji Estates,<br />
                  Takoradi.
                </p>
              </div>
            </div>
          )}

          {/* ETHEREAN KUMASI */}
          {activeTab === 'kumasi' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Etherean Kumasi</h2>
              <div className="prose max-w-none">
                <p>The Kumasi Love Tree Center currently worships at:</p>
                <p className="font-semibold">
                  Durbar Court Hotel<br />
                  Adiembra,<br />
                  Kumasi
                </p>
              </div>
            </div>
          )}

          {/* CONSCIOUS HUMANITY */}
          {activeTab === 'conscious-humanity' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Conscious Humanity</h2>
              <div className="prose max-w-none">
                <p>Conscious Humanity is the United States Non-Profit that carries the teachings of Etherean Mission to the International communities. Its official address is:</p>
                <p className="font-semibold">
                  1632 Rodney Drive, Los Angeles CA 90027<br />
                  Tel: 323 800 2566<br />
                  Email: conscioushumanity@gmail.com<br />
                  Web: conscioushumanity.com
                </p>
              </div>
            </div>
          )}

          {/* CONSCIOUS UMUNTHU */}
          {activeTab === 'conscious-umunthu' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Conscious uMunthu</h2>
              <div className="prose max-w-none">
                <p>In 2009 a group of 4 people met in Chiwoza's house to explore together their interest in Metaphysics. The first book studied was "The Fountain of Life" by Bro Ishmael Tetteh. The group grew in number and other books were studied including: "The Way Forward" and "Essential Life Education".</p>

                <p>The hunger for spiritual empowerment and growth in a space where people could explore and ask questions across different religions made the group very unique as Christians, Hindus, Muslims, Bahais, agnostics and even atheists met under one roof to study and discuss truth. The group further cut across racial lines, Africans, Asians and Europeans came together in common humanity to love and grow together. Apart from studying books, we went to watch spiritual films together, visited each other's homes and celebrated birthdays together. A real community of Conscious uMunthu has grown.</p>

                <p>We have also had Skype calls with Brother Ishmael to discuss issues raised in the books he authored. In 2010 one of our members Rodger, travelled to Ghana and participated in the 35th Anniversary of Etherean Mission. Chiwoza has visited the Mission nearly every year and participated in the 40th anniversary.</p>

                <p className="font-semibold">
                  P. O. Box 31038 Chichiri, Blantyre 3, Malawi.<br />
                  +265 999 841 093<br />
                  Email: consciousumunthu@gmail.com
                </p>

                {/* uMunthu Branch Gallery Section */}
                <h3 className="text-xl font-semibold mt-8 mb-4">GALLERY</h3>

                {uMunthuImages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {uMunthuImages.map((image, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="w-full h-64 overflow-hidden mb-4">
                          <img
                            src={image.image}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Loading uMunthu branch images...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchesPage;
