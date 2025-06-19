import React from 'react';
import Breadcrumb from '../components/Breadcrumb';

const PrivacyPolicyPage = () => {
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Privacy Policy', path: '/privacy-policy' }
  ];

  return (
    
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}

            <Breadcrumb items={breadcrumbItems} />



      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 py-12">
     

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="text-lg mb-4"><strong>Welcome to the Etherean Mission website.</strong> We are strongly committed to protecting your privacy and providing a safe online experience for all of our users while offering the highest quality user experience.</p>

          <p className="mb-4">This privacy policy has been compiled to better serve those who are concerned with how their 'Personally Identifiable Information' (PII) is being used online. PII, as described in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.</p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Section: Personal Information */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">What personal information do we collect from the people that visit our blog, website or app?</h2>
            <p className="mb-4">When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, phone number, credit card information or other details to help you with your experience.</p>
          </section>

          {/* Section: When */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">When do we collect information?</h2>
            <p className="mb-4">We collect information from you when you register on our site, place an order, subscribe to a newsletter, respond to a survey, fill out a form, Use Live Chat, Open a Support Ticket or enter information on our site.</p>
            <p className="mb-4">Provide us with feedback on our products or services</p>
          </section>

          {/* Section: How */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">How do we use your information?</h2>
            <p className="mb-4">We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.</li>
              <li>To improve our website in order to better serve you.</li>
              <li>To allow us to better service you in responding to your customer service requests.</li>
              <li>To administer a contest, promotion, survey or other site feature.</li>
              <li>To quickly process your transactions.</li>
              <li>To ask for ratings and reviews of services or products</li>
              <li>To follow up with them after correspondence (live chat, email or phone inquiries)</li>
            </ul>
          </section>

          {/* Section: Protection */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">How do we protect your information?</h2>
            <p className="mb-4">Our website is scanned on a regular basis for security holes and known vulnerabilities in order to make your visit to our site as safe as possible.</p>
            <p className="mb-4">We do not use Malware Scanning.</p>
            <p className="mb-4">Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.</p>
            <p className="mb-4">We implement a variety of security measures when a user places an order to maintain the safety of your personal information.</p>
            <p className="mb-4">All transactions are processed through a gateway provider and are not stored or processed on our servers.</p>
          </section>

          {/* Section: Cookies */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Do we use 'cookies'?</h2>
            <p className="mb-4">Yes. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's or service provider's systems to recognize your browser and capture and remember certain information.</p>
            <p className="mb-4">For instance, we use cookies to help us remember and process the items in your shopping cart. They are also used to help us understand your preferences based on previous or current site activity, which enables us to provide you with improved services. We also use cookies to help us compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">We use cookies to:</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Understand and save user's preferences for future visits.</li>
            </ul>
            <p className="mt-4 mb-4">You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since browser is a little different, look at your browser's Help Menu to learn the correct way to modify your cookies.</p>
            <p className="mb-4">If you turn cookies off, It won't affect the user's experience.</p>
          </section>

          {/* Section: Third-party */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Third-party disclosure</h2>
            <p className="mb-4">We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information.</p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 border-b pb-2">Third-party links</h2>
            <p className="mb-4">We do not include or offer third-party products or services on our website.</p>
          </section>

          {/* Section: Google */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Google</h2>
            <p className="mb-4">Google's advertising requirements can be summed up by Google's Advertising Principles. They are put in place to provide a positive experience for users. <a href="https://support.google.com/adwordspolicy/answer/1316548?hl=en" className="text-blue-600 hover:underline">https://support.google.com/adwordspolicy/answer/1316548?hl=en</a></p>
            <p className="mb-4">We use Google AdSense Advertising on our website.</p>
            <p className="mb-4">Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on previous visits to our site and other sites on the Internet. Users may opt-out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.</p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">We have implemented the following:</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Demographics and Interests Reporting</li>
            </ul>
            <p className="mt-4 mb-4">We, along with third-party vendors such as Google use first-party cookies (such as the Google Analytics cookies) and third-party cookies (such as the DoubleClick cookie) or other third-party identifiers together to compile data regarding user interactions with ad impressions and other ad service functions as they relate to our website.</p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">Opting out:</h3>
            <p className="mb-4">Users can set preferences for how Google advertises to you using the Google Ad Settings page. Alternatively, you can opt out by visiting the Network Advertising Initiative Opt Out page or by using the Google Analytics Opt Out Browser add on.</p>
          </section>

          {/* Section: CalOPPA */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">California Online Privacy Protection Act</h2>
            <p className="mb-4">CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law's reach stretches well beyond California to require any person or company in the United States (and conceivably the world) that operates websites collecting Personally Identifiable Information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals or companies with whom it is being shared. – See more at: <a href="http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf" className="text-blue-600 hover:underline">http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf</a></p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">According to CalOPPA, we agree to the following:</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Users can visit our site anonymously.</li>
              <li>Once this privacy policy is created, we will add a link to it on our home page or as a minimum, on the first significant page after entering our website.</li>
              <li>Our Privacy Policy link includes the word 'Privacy' and can easily be found on the page specified above.</li>
            </ul>
            <p className="mt-4 mb-2">You will be notified of any Privacy Policy changes:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>On our Privacy Policy Page</li>
            </ul>
            <p className="mt-4 mb-2">Can change your personal information:</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>By logging in to your account</li>
            </ul>
          </section>

          {/* Section: DNT */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">How does our site handle Do Not Track signals?</h2>
            <p className="mb-4">We honor Do Not Track signals and Do Not Track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place.</p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 border-b pb-2">Does our site allow third-party behavioral tracking?</h2>
            <p className="mb-4">It's also important to note that we do not allow third-party behavioral tracking</p>
          </section>

          {/* Section: COPPA */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">COPPA (Children Online Privacy Protection Act)</h2>
            <p className="mb-4">When it comes to the collection of personal information from children under the age of 13 years old, the Children's Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, United States' consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children's privacy and safety online.</p>
            <p className="mb-4">We do not specifically market to children under the age of 13 years old.</p>
          </section>

          {/* Section: Fair Information */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Fair Information Practices</h2>
            <p className="mb-4">The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information.</p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">In order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:</h3>
            <p className="mb-2">We will notify the users via in-site notification</p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Within 7 business days</li>
            </ul>
            <p className="mt-4 mb-4">We also agree to the Individual Redress Principle which requires that individuals have the right to legally pursue enforceable rights against data collectors and processors who fail to adhere to the law. This principle requires not only that individuals have enforceable rights against data users, but also that individuals have recourse to courts or government agencies to investigate and/or prosecute non-compliance by data processors.</p>
          </section>

          {/* Section: CAN SPAM */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">CAN SPAM Act</h2>
            <p className="mb-4">The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations.</p>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">We collect your email address in order to:</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Send information, respond to inquiries, and/or other requests or questions</li>
              <li>Process orders and to send information and updates pertaining to orders.</li>
              <li>Send you additional information related to your product and/or service</li>
              <li>Market to our mailing list or continue to send emails to our clients after the original transaction has occurred.</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">To be in accordance with CANSPAM, we agree to the following:</h3>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Not use false or misleading subjects or email addresses.</li>
              <li>Identify the message as an advertisement in some reasonable way.</li>
              <li>Include the physical address of our business or site headquarters.</li>
              <li>Monitor third-party email marketing services for compliance, if one is used.</li>
              <li>Honor opt-out/unsubscribe requests quickly.</li>
              <li>Allow users to unsubscribe by using the link at the bottom of each email.</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">If at any time you would like to unsubscribe from receiving future emails, you can email us at</h3>
            <p className="mb-4">Follow the instructions at the bottom of each email and we will promptly remove you from <strong>ALL</strong> correspondence.</p>
          </section>

          {/* Section: Contact */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Contacting Us</h2>
            <p className="mb-2">If there are any questions regarding this privacy policy, you may contact us using the information below.</p>
            <div className="mt-4 pl-4 border-l-4 border-blue-600">
              <p className="mb-1">http://ethereanlife.com/</p>
              <p className="mb-1">P.O. Box AN 8562, Accra North, Ghana.</p>
              <p className="mb-1">Phone: +233 302 326702, +233 302 326701</p>
              <p className="mb-1">Email: ethereanlife@gmail.com</p>
            </div>
            <p className="mt-6 text-sm text-gray-500">Last Edited on 2018-05-20</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;