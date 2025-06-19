import React from 'react';
import Breadcrumb from '../components/Breadcrumb';

/**
 * WhyJesusCameOnEarth Component
 * Displays information about why Jesus came on Earth
 */
const WhyJesusCameOnEarth = () => {
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Why Jesus Came on Earth', path: '/why-jesus-came-on-earth' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Page Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
          <div className="p-6 md:p-8">
            <section className="prose prose-lg max-w-none">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-orange-600 mb-6">
                  The Three Objectives of Jesus
                </h2>
                
                <div className="bg-blue-50 p-6 rounded-lg mb-6 border-l-4 border-blue-400">
                  <p className="text-blue-800 font-medium italic">
                    Preamble: It is true that Jesus, at the penalty of death, gave up his life for our salvation by teaching us the High Truth of Divine Empowerment. In Jesus' own words he said, "Whoever is not with me is against me, and whoever does not gather with me scatters." <span className="font-bold">Matthew 12:30</span>. Clearly, he is teaching that those who do not tow his path are antichrists and will perish with the antichrists.
                  </p>
                </div>

                <p className="text-gray-700 mb-6">
                  Now read on to see if you are gathering with Jesus or you are with the antichrist.
                </p>

                <p className="text-gray-700 mb-6">
                  Christians have been teaching the message of Jesus for 2000 years, yet the world keeps getting worse. Panic, fear, suspicion, conflicts, terrorism, wars and broken families continue to increase the world over, and religion is the major cause of these. It is time we had some sober reflections on the role of the Church in all these.
                </p>

                <p className="text-gray-700 mb-6">
                  The Christ message is Abused, Reduced and Misused and generations continue to be misled and lost. Christianity has by and large become a miracle business and a podium for get-rich-quick cons by charlatans, doomsday preachers and simpletons who are either ignorant of, or disregard the true teachings of Jesus.
                </p>

                <div className="bg-red-50 p-6 rounded-lg mb-6 border-l-4 border-red-400">
                  <p className="text-red-800 font-medium">
                    The Church has become largely Anti-Christ! You have a duty to wake up to the Truth and enlighten the world around you
                  </p>
                </div>
              </div>

              {/* Who is the Anti-Christ Section */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Who is the Anti-Christ?</h3>
                <p className="text-gray-700">
                  The Anti-Christ is any person, group or church that does not follow the mission and teachings of Christ Jesus and in fact does the opposite.
                </p>
              </div>

              {/* Mission 1 */}
              <div className="mb-12 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                <h3 className="text-2xl font-bold text-orange-600 mb-4">Christ Mission 1: Divine Empowerment</h3>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  Jesus lived and died to make you aware that you are divine and your divine nature is available to you even now. The Bible affirms this in the following:
                </h4>

                <ol className="list-decimal pl-6 space-y-3 mb-6 text-gray-700">
                  <li>We were created in God's Spiritual image and likeness and blessed to expand and express the qualities of God. <span className="font-semibold text-orange-600">Genesis 1:26-28.</span></li>
                  <li>We fell from that grace of full God expression by yielding to the persuasions of the senses instead of the spirit within and this is allegorically expressed in the book of Genesis. <span className="font-semibold text-orange-600">Genesis 3: 1-17.</span></li>
                  <li>Salvation, therefore, is to restore you to your original status as the image and likeness of God. <span className="font-semibold text-orange-600">John 10:30-34</span></li>
                  <li>Jesus started his ministry with the teaching that you must repent your old ways of thinking and being, for <em>"The Kingdom of God"</em> is within your reach. <span className="font-semibold text-orange-600">Matthew 4:17.</span></li>
                  <li>Jesus emphasized the need to "<em>Seek ye first the Kingdom of God and its righteousness...</em>" <span className="font-semibold text-orange-600">Matthew 6:33.</span></li>
                  <li>The first request in the master prayer that Jesus taught, the Lord's Prayer, is <em>"Thy Kingdom Come!"</em> <span className="font-semibold text-orange-600">Matthew 6:10.</span></li>
                  <li>In <span className="font-semibold text-orange-600">Luke 4:43</span></li>
                  <li>To the obvious question of when the Kingdom would come, Jesus answered that the kingdom of God is not a physical thing or place to be seen or observed but that the whole <em>"Kingdom of God is WITHIN you." </em><span className="font-semibold text-orange-600">Luke 17:20-21 KJV or NKJV.</span></li>
                </ol>

                <p className="text-gray-700 mb-4">
                  "The Kingdom is WITHIN you" is the greatest empowerment message in the world and the Anti-Christ will not want you know it, hence the churches do not teach it. Also, there is a systematic attempt by "The Powers That Be" to remove it from the Bible.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg mb-6 border-l-4 border-yellow-400">
                  <p className="text-gray-700 italic mb-2">
                    This is what you read in the King James and the New King James Versions:
                  </p>
                  <blockquote className="pl-4 border-l-2 border-gray-300 italic text-gray-700">
                    "Now when He was asked by the Pharisees when the kingdom of God would come, He answered them and said, 'The kingdom of God does not come with observation; nor will they say, "See here!" or "See there!"' For indeed, the kingdom of God is within you."
                  </blockquote>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg mb-6 border-l-4 border-purple-400">
                  <p className="text-gray-700 italic mb-2">
                    Please, read the same verse in the New American Standard Bible and in the New American Bible (Revised edition). These and other newer versions of the bible, which are designed to replace the King James Version and the New King James Versions state thus:
                  </p>
                  <blockquote className="pl-4 border-l-2 border-gray-300 italic text-gray-700">
                    "Asked by the Pharisees when the kingdom of God would come, he said in reply, 'The coming of the kingdom of God cannot be observed, and no one will announce, "Look, here it is," or, "There it is." For behold, the kingdom of God is <u>among</u> you'."
                  </blockquote>
                </div>

                <p className="text-gray-700 mb-4">
                  <span className="font-bold">The kingdom of God is WITHIN you</span> has changed to <em>the kingdom of God is <u>among</u> you</em>. This subtle twist is to infer that Jesus was referring to himself as the Kingdom of God. But the verse 20 to 21a had clearly stated that:
                </p>

                <blockquote className="pl-4 border-l-2 border-gray-400 italic text-gray-700 mb-4">
                  "The coming of the kingdom of God cannot be observed, and no one will announce, 'Look, here it is,' or, 'There it is.'"
                </blockquote>

                <p className="text-gray-700 mb-4">
                  And common sense teaches that the fruits of the Kingdom, such as love, joy, peace and wisdom all come from within you.
                </p>

                <p className="text-gray-700 mb-4">
                  If God and his whole kingdom is within you then who are you? Jesus taught that you are god. This teaching was a blasphemy punishable by death in Jewish tradition. So they took stones, like they have always done before, to kill him but Jesus escaped. <span className="font-semibold text-orange-600">John 10:30-34</span>.
                </p>

                <p className="text-gray-700 mb-4">
                  When they wanted a reason to crucify him, they asked him if he was the child of God and in his yes response, he was condemned to death. <span className="font-semibold text-orange-600">Matthew 26:60-66</span>.
                </p>

                <div className="bg-green-50 p-4 rounded-lg mb-6 border-l-4 border-green-400">
                  <p className="text-gray-700">
                    Jesus died for the teaching that you are divine and that you are an extension of God. The death of Jesus is, therefore, meaningless if you do not stand up for the reason he died. Embrace your divinity as a Child of God.
                  </p>
                </div>

                <p className="text-gray-700 mb-4">
                  Salvation, therefore, is the transformation of your human consciousness into God Consciousness; and Jesus is the example of how to attain it.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-blue-800 font-medium italic">
                    NOTE: It is clear that Jesus started his ministry with the Kingdom teaching and died for it. This teaching must be very important to him indeed.
                  </p>
                </div>

                <p className="text-gray-700 mb-4">
                  <span className="font-bold">The Anti-Christ: </span>If your church does not teach you that the Kingdom of God is within you and does not provide you with the keys to gain access into it, then <span className="font-bold">it is Anti-Christ.</span> The "<span className="font-bold">Kingdom within</span>" is cardinal to Jesus' teaching and he was crucified for teaching that God and his Kingdom dwells within you. (<span className="font-semibold text-orange-600">John 10:30-36; Mat 26:59-66</span>). Truly, God cannot be anywhere else but in his kingdom and Jesus' life demonstrates how that kingdom operates within Man.
                </p>

                <p className="text-gray-700 mb-4">
                  The Anti-Christ teaches you to just mention the name of Jesus to gain entry into God's Kingdom instead of taking up your cross and following him (<span className="font-semibold text-orange-600">Mark 8:34; Mat 7:21-23</span>).
                </p>

                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800 font-bold">
                    Those who go with the Anti-Christ are doomed with it.
                  </p>
                </div>
              </div>

              {/* Mission 2 */}
              <div className="mb-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">Christ Mission 2: Oneness of Life</h3>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  Jesus taught and demonstrated the oneness of all men in the eyes of God and that it is the will of God that we see our oneness with one another, irrespective of our race, creed or culture, as one.
                </h4>

                <ol className="list-decimal pl-6 space-y-3 mb-6 text-gray-700">
                  <li>Jesus taught: Not those who say Lord, Lord or do miracles in the name of Jesus but those who do the will of God <span className="font-semibold text-blue-600">Matthew 7: 21-23.</span></li>
                  <li>Asked what the primary will or law of God is, Jesus made the declaration of Oneness saying, <em>"hear oh Israel the Lord our God is one God."</em><span className="font-semibold text-blue-600">Mark 12: 29. </span>The Bible affirms that we all came from His one breath. <span className="font-semibold text-blue-600">Genesis 2: 7</span>.</li>
                  <li>To practice Oneness, Jesus taught that you have to love God with all of your heart and might and your <span className="font-bold">neighbour</span> as yourself. <span className="font-semibold text-blue-600">(Mark 12:30-31). </span>To love a neighbour as yourself is to be able to step into the person's shoes and feel one with them.</li>
                  <li>Jesus prescribed a new way of living that you have to love the enemy, <span className="font-bold">bless</span> those who curse you and <span className="font-bold">pray</span> for the good of those who persecute and misuse you. That is what qualifies you as a child of God; for a child of God makes peace and does not curse or pray against witches using the blood of Jesus. In fact, while Jesus was shedding his blood, he was praying that the father should forgive his executioners. <span className="font-semibold text-blue-600">Matthew 5: 43-45; Mark 12:30-31. </span></li>
                  <li>Asked who a neighbour was, Jesus taught us to love "the Samaritan"; that is, the follower of another religion and culture <span className="font-semibold text-blue-600">(Luke 10:29-37).</span></li>
                  <li>Jesus demonstrated oneness beyond boundaries when he visited the land of the Samaritans who belonged to a faith and culture other than his <span className="font-semibold text-blue-600">(John 4:4-24)</span>; and requested water from their well. A well in a desert place like Samaria is the very heart of the people.</li>
                  <li>After his death, Peter had a vision from the Holy Spirit in which he saw the oneness in all that God has created. He woke up with a revelation that <em>"God is not a respecter of persons but that in every nation, whoever does his will is accepted of him</em>".<span className="font-semibold text-blue-600"> (Acts 10:10-35).</span> Every nation includes people of all races, religions or tribes.</li>
                  <li>Paul taught after Jesus that you must do all in your power to live peaceably with all people. (<span className="font-semibold text-blue-600">Roman 12: 18</span>) For, God is present in all and through all people. <span className="font-semibold text-blue-600">Ephesians 4:4-6.</span></li>
                </ol>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-blue-800 italic">
                    NOTE: If Jesus taught and demonstrated Oneness while he was alive and also taught it after his death through the Holy Spirit, then Oneness must be important to him and those who do not go by it are antichrists.
                  </p>
                </div>

                <p className="text-gray-700 mb-4">
                  The works of the antichrist causes confusion, conflicts and war; and see, almost all the wars, terrorism and conflicts in the world today are coming from the lack of religious oneness as taught by Jesus.
                </p>

                <p className="text-gray-700 mb-4">
                  <span className="font-bold">The Anti-Christ: </span>We see the Anti-Christ churches binding and cursing their enemies and the congregation rejoicing when members give testimonies of victory over enemies. They even sing halleluiah at the death of an enemy. We hear of pastors threatening to harm or destroy their enemies. The church is become largely antichrist.
                </p>

                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800 font-bold">
                    Those who go with the Anti-Christ are doomed with it.
                  </p>
                </div>
              </div>

              {/* Mission 3 */}
              <div className="mb-12 p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl">
                <h3 className="text-2xl font-bold text-green-600 mb-4">Christ Mission 3: Respect for Self and Culture</h3>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  Jesus respected and valued the Jewish culture he was born into and participated in their observances, while showing where necessity surpasses the ceremonial laws.
                </h4>

                <ol className="list-decimal pl-6 space-y-3 mb-6 text-gray-700">
                  <li>Culture groups people into families, clans or nations. It gives them a sense of identity and inculcates in them the idea of God and defines their relationship to the Divinity as well as imbibing in them a worldview of Oneness of all men. <em>The destruction of a culture is the destruction of their identity, drive for self-determination and creativity and </em><em>they, consequently, are destroyed</em><em>. </em>Jesus taught that you must love your neighbour as yourself, meaning that you must love yourself and extend the same to others. <span className="font-semibold text-green-600">Mark 12:30-31.</span></li>
                  <li>The preservation and growth of a culture is so important that Jesus set himself up to fulfil the law and not to destroy it. <span className="font-semibold text-green-600"> 5:17.</span></li>
                  <li>In line with his culture, when Jesus healed the leper <span className="font-semibold text-green-600">Mark 1:40-44</span>, he charged him to go and perform the cultural requirements as stated in <span className="font-semibold text-green-600">Leviticus 14:3-7.</span>This ritual is similar to what we find in many traditional African religious practices.</li>
                  <li>Jesus observed the traditional Passover of his culture <span className="font-semibold text-green-600">Matthew 26:18</span>. And he directed that he should be remembered whenever his followers break the Passover bread. <span className="font-semibold text-green-600">Luke 22:19.</span></li>
                  <li>Many cultural practices, especially of Africans, that are condemned by modern day Christians are accepted in the Bible. For example, many would accept the words of the African traditional prayers but condemn the libations that go with it. The Bible calls libation "drink offering' and commands that as much as a quarter gallon of gin be poured in the holiest places unto God. <span className="font-semibold text-green-600">Numbers 28:7.</span></li>
                  <li>There is a systematic plan to destroy Africa and keep her people in slavery by ①dividing them and ②destroying their culture.</li>
                </ol>

                <p className="text-gray-700 mb-4">
                  <span className="font-bold">The Anti-Christ Destroys Africa: </span>Unsuspecting Africans are being brainwashed to look down on themselves and to self-destruct. The Anti-Christ system in place makes you feel that your name is evil so you take on Western ones; your skin colour is evil so you bleach; the kinky hair has to be relaxed and straightened for women to look beautiful.
                </p>

                <p className="text-gray-700 mb-4">
                  Everything that is sweet and good must have a Western prefix to it such as "blofoakwadu" (Whiteman's banana), "blofoakuto" (Whiteman's orange), "blofonme" (Whiteman's pineapple).
                </p>

                <p className="text-gray-700 mb-4">
                  There was even an infamous belief that if you meet a Whiteman on your way to church, you must return home because you have seen god.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <p className="text-gray-700 mb-2">
                    When you pray inviting the souls of the departed to join you, it is called Ancestral Worship but it is okay to pray through a Saint; and there is an All Saints Day but we are made to feel ashamed to have All Ancestors Day. To pray with water or a drink to bless the Earth that produces all the food that you eat is called Libation and is condemned but the Bible commands us to do the same thing and calls it Drink Offering. <span className="font-semibold text-green-600">Numbers 28:7; I Sam 7:6.</span>
                  </p>
                </div>

                <p className="text-gray-700 mb-4">
                  To denigrate and reduce an entire race into hopeless nonentities is an insult to God, the Creator of all.
                </p>

                <p className="text-gray-700 mb-4">
                  Africa is divided into 54 nations and none of these divisions was done by Africans. Africa must wake up! And Etherean Mission champions this cause.
                </p>
              </div>

              {/* Etherean Mission Section */}
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <h3 className="text-2xl font-bold text-purple-600 mb-4">The Unique Position of Etherean Mission</h3>
                <p className="text-gray-700 mb-4">
                  Etherean Mission is the embodiment of the three Christ Missions. Etherean simply means heavenly and we are on a mission to anchor heaven on earth. We follow the teachings of Jesus and not the mass consciousness of the church.
                </p>
                <p className="text-gray-700">
                  Our mission is to ①teach the divine natures of man and to empower you with the tools to activate them ②awaken all to oneness, and to ③ restore the mystical traditions and dignity of the African people.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyJesusCameOnEarth;