import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import BroIsh from '../assets/BIT_Sweet1.jpg';
import Sakaman1 from '../assets/SAKAMAN-01.jpg';

/**
 * AboutPage Component
 * Displays about information in tabbed sections
 */
const AboutPage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('about-us');
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' }
  ];

  // Tab data
  const tabs = [
    { id: 'about-us', label: 'ABOUT US' },
    { id: 'what-we-do', label: 'WHAT WE DO' },
    { id: 'objectives', label: 'OBJECTIVES' },
    { id: 'ishmael-tetteh', label: 'BRO. ISHMAEL TETTEH' },
    { id: 'service', label: 'SERVICE' },
    { id: 'faq', label: 'F.A.Q' }
  ];

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

      {/* Page Header */}
      

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
          {/* ABOUT US */}
          {activeTab === 'about-us' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">About Us</h2>
              <div className="prose max-w-none">
                <p>From the English word 'ethereal', which means heaven, Etherean Mission means Heavenly Mission and we are here to anchor heaven on earth.</p>
                
                <p>Etherean Mission is the road to the activation of creative abilities. It gives you the opportunity to study the core principles of life and provides you with the requisite tools and abilities to handle life and the universe you live in.</p>
                
                <p>It is a place of joy, where all are supported to discover and express the highest good that they are. Each person embodies the full presence of God and our conscious practice, therefore, is to see and express the good and the divine in ourselves and in all of life. That is the practice of love.</p>
                
                <p>We believe in a unified world that is run by an Absolutely Loving, Omnipotent, Omnipresent and Omniscient Father-Mother God whose kingdom embraces everyone, irrespective of their race, religious creed or culture.</p>
                
                <p>We believe that this God cannot contradict Itself by creating another power, a so-called devil, to oppose Him or haunt Her Children. So, whatever your background, Etherean Mission (Heavenly Mission), is the place for you and you are welcome.</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Vision</h3>
                <p>Our vision is that of a unified world in which everybody is a catalyst that is activating and promoting the innate good in one another.</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Mission</h3>
                <p>Our Three-fold mission is to…</p>
                <ol className="list-decimal pl-6 mb-4">
                  <li>Provide you with the Life Tools to enable you unleash your innate God potentials for you to experience inner peace for the eventual realization of World Peace.</li>
                  <li>Unite the Family of Humanity.</li>
                  <li>Restore cultural Self-dignity and respect to everyone especially, to the African people.</li>
                </ol>
                <p>Simply, we are the restorers of peace.</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Definition</h3>
                <p>Peace is the identification and free expression of our innate potential. The Innate Drive of every person is to be a force of good for themselves and their environment. When this innate potential is rightly nourished it reveals the world of peace we seek to experience.</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Our Objectives</h3>
                <ol className="list-decimal pl-6 mb-4">
                  <li>To bring spiritual enlightenment and empowerment to humankind.</li>
                  <li>To promote Oneness of Life.</li>
                  <li>To restore the Mystical Traditions of Africa.</li>
                </ol>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Our Master Prayer</h3>
                <p>Oh God, let the life I live today call forth your divine presence in everyone I meet in body, mind and spirit into full expression.</p>
                <p>Oh God, let the life I live today see your divine presence in everyone I meet in body, mind and spirit and work to promote your expansion in them and through them.</p>
                <p>Oh God, let the life I live today call forth the innate good in everyone I meet in body, mind and spirit into full expression.</p>
                <p>Oh God, let the life I live today see the innate good in everyone I meet in body, mind and spirit and work to promote its expansion in them and through them.</p>
              </div>
            </div>
          )}

          {/* WHAT WE DO */}
          {activeTab === 'what-we-do' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">What We Do</h2>
              <div className="prose max-w-none">
                <p>We provide high quality spiritual knowledge, processes and practices for the activation of your innate potentials to enable you be the highest and the best you can possibly be.</p>
                
                <p>We know that each person is a unique being and requires different set of life enhancement tools for their development. In this website, we provide you with an array of products so that you work with what works for you.</p>
                
                <p>We work to promote oneness of life so that humanity will come to the realization that we are just one being. Nature confirms this truth that we all share the same resources of life; we eat from the same bowl and we share the same air. In fact, the air in your nostril may be coming from the nostril of another person who is of different faith, race, creed or culture.</p>
                
                <p>We are passionate about world peace through the realisation of inner peace and we provide the tools for each person to awaken to their full God potential.</p>
                
                <p>Many of these tools are available to everyone free of charge, while some are reserved for members only.</p>
                
                <p>Membership is open to anyone who wants join our Etherean Family and commits to make regular tithing to our cause and vision. You can become a member now by clicking on the green Membership button in the upper right corner of the home page.</p>
              </div>
            </div>
          )}

          {/* OBJECTIVES */}
          {activeTab === 'objectives' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Objectives</h2>
              <div className="prose max-w-none">
                <p>Our objectives are based on the same objectives of the Great Master Yeshuah (who the world call, Jesus), which are:</p>
                
                <ol className="list-decimal pl-6 mb-4">
                  <li><strong>Divine Empowerment:</strong> The Kingdom of God is within you; Luke 17:20-21.</li>
                  <li><strong>Oneness of Life:</strong> One God for all; Mark 12:29.</li>
                  <li><strong>Cultural Self-Respect and Dignity:</strong> I have not come to abolish the old traditions but to fulfill them. Matthew 5:17.</li>
                </ol>
                
                <p className="mb-4">
                  <a href="/why-jesus" className="text-yellow-600 hover:text-yellow-700">Study Jesus' Objectives Here</a>
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">We Believe that…</h3>
                <ol className="list-decimal pl-6 mb-4">
                  <li>We believe in a unified world that is run by an Absolutely Loving, Omnipotent, Omnipresent and Omniscient Father Mother God whose kingdom embraces everyone, irrespective of their race, religious creed or culture and that we are here as channels for the assured realization of the Kingdom of God on earth.</li>
                  <li>We believe that this God cannot contradict itself by creating another power, a so-called the devil to oppose haunt Him/ Her children. Indeed, no loving parent will lock up their children in a room with a poisonous snake to haunt them and that God being most loving cannot contradict Itself by creating an enemy, a so-called devil, to live with us his own children.</li>
                  <li>We believe that humanity is one being and we are all expressions of the Divine.</li>
                  <li>We believe that we live in an absolutely benevolent, spontaneous, purposeful and intelligent universe that has coded itself for its own highest good; and that we are all divine expressions of this Creative, Love, Intelligence we choose to call God. This Power understands our deepest needs and that through right mental attitude and right action we allow this power to express through us for Its own glory.</li>
                  <li>We believe that God is not a Person. God is the Creative, Love, Intelligence that indwells everybody and permeates all of life.</li>
                  <li>We believe that humanity is one being and that we are all created in the Spiritual Image and likeness of this All-Loving, All-Intelligent and Absolute Creative Power, God; and that we are here as channels for the assured realization of the Kingdom of God on earth.</li>
                  <li>We believe that we live in an absolutely benevolent, spontaneous, purposeful and intelligent universe that has coded itself for its own highest good; and that we are all divine expressions of this Absolute Creative, Love, Intelligence that we choose to call God.</li>
                  <li>We believe that this absolutely benevolent and generous Universe knows and understands our deepest needs and that through right mental attitude and right action we allow this power to express through us for Its own glory.</li>
                </ol>
                
                <p>So, whatever your background, Etherean Mission (Heavenly Mission), is the place for you and you are welcome.</p>
              </div>
            </div>
          )}

          {/* BRO. ISHMAEL TETTEH */}
          {activeTab === 'ishmael-tetteh' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Bro. Ishmael Tetteh</h2>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3">
                  <div className="rounded-lg h-64 flex items-center justify-center">
                    <img src={BroIsh} alt="Brother Ishmael Tetteh" className="rounded-lg h-full object-cover" />
                  </div>
                </div>
                <div className="md:w-2/3 prose max-w-none">
                  <p>Brother Ishmael Tetteh is a Spiritual Master, whose international presence and message of World Peace over the past 35 years has empowered thousands of lives from Africa, to Germany, to the UK, and now the United States.</p>
                  
                  <p>As Founder and Spiritual Director of the Etherean Mission in Ghana, a trans-denominational metaphysical organization dedicated to self-awareness and study of the natural sciences, Brother Ishmael's charismatic presence has graced the podiums around the world. From the New Thought Alliance in South Africa, the Assoc. for Global New Thought in Palm Springs, to many U.S. churches, organizations television and radio programs throughout the East and West Coast. Many lives have been changed by his presence and teachings.</p>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p>Brother Ishmael has published over twenty books including the "The Way Forward," eighteen principles to radically change your way of thinking, living and being to bring about a life of harmony, peace and success and "Inspired African Mystical Gospel," a rediscovery of lost treasures within African mystical and cultural practices. He has also developed tools and seminars for stimulating creativity, mental and emotional cleansing and self-healing. Popular seminar topics and keynote speaking engagements include, Growing the Empowered Child, Keys to Empowered Living, Pain-to-Power, Possibility Living, Conscious Living and Finding Your Life's Purpose.</p>
                
                <p>In his goal for world peace, Brother Ishmael developed "Growing the Empowered Child."™ Growing the Empowered Child ™ is a program designed to raise children without anger or fear, who are able to recognize and celebrate the uniqueness of themselves and of every other person they encounter. When this is accomplished, we have cultivated a powerful and peaceful child whose only weapon is love. This is certainly the formula for peace and progress for all humanity.</p>
                
                <p>Growing the Empowered Child™ has been incorporated successfully with the youth of the Etherean Mission and one school in Accra, Ghana. Plans are now under-way to build the first Growing the Empowered Child™ School. Games and techniques from the Growing the Empowered Child™ program have also been incorporated in various programs and a school in the United States.</p>
                
                <p>His metaphysical technologies for the harmonious functioning of the mind, body and spirit through nature's principles have guided thousands of students and patients to heal conditions considered terminal by Western medical practitioners. His audiences are introduced to Ancient African Healing Techniques, these are the same techniques utilized in his Hospital program in Ghana, where spiritual, herbal, and traditional medical practices are united.</p>
                
                <p>In addition to a Special Congressional Award for outstanding and invaluable service throughout the international community, he has been awarded Mayoral Proclamations from the cities of Santa Monica and San Francisco, who have declared April 25th and March 17th as "Brother Ishmael Tetteh Day."</p>
                
                <p>Those who know Brother Ishmael enjoy the magnificence of his spirit and warm, loving presence. His truths are filled with divine wisdom and healing, which move people deeply and bring about profound transformations.</p>
              </div>
            </div>
          )}

          {/* SERVICE */}
{activeTab === 'service' && (
  <div>
    <h2 className="text-2xl font-bold mb-6">Service</h2>
    <div className="prose max-w-none">
      
      <div className="flex flex-col md:flex-row gap-6 my-6">
        <div className="md:w-1/2">
          <img 
            src={Sakaman1} 
            alt="Etherean Mission Church in Sakaman" 
            className="rounded-lg shadow-md w-full h-auto object-cover"
            />
        </div>
        <div className="md:w-1/2">
         
        </div>
      </div>
      
            <p>There is one main Church Services on Sunday and a Mid-week Crystal Meditation and Prayer Service of Wednesdays.</p>
       <p>Sunday service is in three parts. These are the Morning Meditation, Metaphysical Studies.</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Meditation Service that lifts you into God contact. Most meditation sessions end up with 'Dance Meditation', a unique program for anchoring and expanding your psyche.</li>
            <li>Metaphysical Studies that gives you spiritual understanding of scriptures and of life. There are currently six main Metaphysical classes made up of the English Class, Children, Lower and Upper Youth Classes and three local dialect classes in Ewe, Akan and Ga.</li>
            <li>Main Service. It provides you with the inspiration, motivation and spiritual support needed to handle life and breakthrough obstacles.</li>
          </ul>
      <h3 className="text-xl font-semibold mt-6 mb-3">Service Times</h3>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Meditation:</strong> 8.30 AM</li>
        <li><strong>Metaphysics:</strong> 9.00 – 10.15 AM</li>
        <li><strong>Main Church:</strong> 10.30 AM – 12.30 PM</li>
        <li><strong>Crystal Service on Wednesday:</strong> 7.00PM – 8.00PM</li>
        <li><strong>Crystal Service on Wednesday (UK Branch):</strong> 8.00PM – 9.00PM</li>
      </ul>
      
      <p><em>Healing Services are organized on the last Sunday of every month.</em></p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Head Quarters Location</h3>
      <p>We are in Sakaman, South Odorkor, Accra.</p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">DIRECTION:</h3>
      <ol className="list-decimal pl-6 mb-4">
        <li>From Odorkor Trotro Station going towards Malam, take left at the first traffic lights; it leads to Dansoman.</li>
        <li>From this junction, you will meet Shell and then Goil Filling Stations on the right.</li>
        <li>Our Church Temple with the big Hospital Complex is on the right after the Goil Filling Station. And that is about 3 minutes walk from the junction traffic lights.</li>
      </ol>
    </div>
  </div>
)}


          {/* F.A.Q */}
          {activeTab === 'faq' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Is Etherean Mission a Christian Ministry?</h3>
                  <div className="prose max-w-none">
                    <p>Many people have asked this question because of our spiritual practice of Oneness. They see us mix up with people of all faiths and we passionately advocate oneness with all irrespective of race, religious creed or culture. Etherean Mission is Christian religion.</p>
                    <p>We are not church Christians, we are Jesus Christians and follow after the strict tradition of Jesus.</p>
                    <p>We honour all paths that lead to truth and its practice of love and we believe that love alone is the divine will of God. Jesus himself declared that his name is not passport to heaven when he shared that "not those who say Lord, Lord but those who do the will of God;" and he summed up the Will of God as follows; "Love God with all of your heart and with all of your might and your neighbour as yourself." This is the Will of God and that we are able to love beyond our religious boundaries to embrace people of other faiths. Just like Jesus, being a Jew, taught the Jews to love the Samarians and he demonstrated it by going to Samaria. He also taught this through the parable of the Good Samaritan. Again, After the death of Jesus when his disciples went into the practice of segregation, the Holy Spirit, in a vision, taught Peter oneness and he came to the realization that God is no respecter of persons but that in every land whoever does His Will is accepted of him.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Do Ethereans use the Bible?</h3>
                  <div className="prose max-w-none">
                    <p>Yes, the Bible is our main text book and we make other supporting references from the Glorious Koran and other holy books of other faiths.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">What is your belief about heaven and hell?</h3>
                  <div className="prose max-w-none">
                    <p>Heaven is the field of infinite and ever-expanding good and hell is its opposite. Both are states of consciousness of every person. You can therefore, choose to experience your heaven on earth from now. No one wakes up knowing algebra who had not studied it previously. Similarly, you cannot wake up in heaven if you do not practice and experience it now.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">What is enlightenment or empowerment?</h3>
                  <div className="prose max-w-none">
                    <p>Empowerment is what you do to attain enlightenment. Enlightenment is the knowing of who and what you are as a divine expression of Life; knowing how you know it and having the ability to freely express it. Empowerment is the knowledge system that enables you to know how to unleash your innate potentials.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Do you pray in the name of Jesus?</h3>
                  <div className="prose max-w-none">
                    <p>Jesus himself made a disclaimer that his name is not a passport to heaven when he said, "Not all those who say, Lord, Lord, but those who do the will of God which is LOVE." Matthew 7:21-22. We, therefore, pray in the Spirit of the Christ Love. And in any case, he was not called Jesus when he was alive. Jesus is the Western name given to the man whose name was Yashuah. Pray from a heart filled with love.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;