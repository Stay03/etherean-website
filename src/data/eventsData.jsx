// Mock data for upcoming and past events
const eventsData = [
  {
    id: 1,
    title: "Embracing the Power of Women in the New Era",
    date: "2025-04-15",
    time: "10:00 AM - 4:00 PM",
    location: "Etherean Center, New York",
    image: "https://ethereanlife.com/wp-content/uploads/2025/03/WhatsApp-Image-2025-02-23-at-14.39.39.jpeg", // Path to image relative to public folder
    fallbackImage: "https://images.unsplash.com/photo-1540304453527-62f979142a17?q=80&w=2070", // Fallback image URL
    status: "upcoming",
    link: "/events/you-can-have-what-you-want-workshop",
    type: "Workshop"
  },
  {
    id: 2,
    title: "Voice of God Evolution 2024",
    date: "2025-05-20",
    time: "6:30 PM - 9:30 PM",
    location: "Etherean Life Virtual Event",
    image: "/events/voice-of-god-event.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=2070",
    status: "upcoming",
    link: "/events/voice-of-god-evolution",
    type: "Conference"
  },
  {
    id: 3,
    title: "Inner Peace Meditation Retreat",
    date: "2025-06-10",
    time: "All Day",
    location: "Etherean Mountain Retreat, Colorado",
    image: "/events/meditation-retreat.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?q=80&w=2069",
    status: "upcoming",
    link: "/events/inner-peace-meditation-retreat",
    type: "Retreat"
  },
  {
    id: 4,
    title: "Spiritual Growth Masterclass",
    date: "2025-03-05",
    time: "2:00 PM - 5:00 PM",
    location: "Etherean Center, Los Angeles",
    image: "/events/masterclass-event.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070",
    status: "past",
    link: "/events/spiritual-growth-masterclass",
    type: "Masterclass"
  },
  {
    id: 5,
    title: "Etherean Foundations Workshop",
    date: "2025-02-18",
    time: "9:00 AM - 3:00 PM",
    location: "Etherean Center, Chicago",
    image: "/events/foundations-workshop.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070",
    status: "past",
    link: "/events/etherean-foundations-workshop",
    type: "Workshop"
  },
  {
    id: 6,
    title: "Spiritual Growth Retreat",
    date: "2025-01-15",
    time: "All Day",
    location: "Etherean Mountain Retreat, Colorado",
    image: "/events/spiritual-growth-retreat.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?q=80&w=2069",
    status: "past",
    link: "/events/spiritual-growth-retreat",
    type: "Retreat"
  }
];

// Helper function to get upcoming and past events
export const getUpcomingEvents = () => {
  return eventsData.filter(event => event.status === 'upcoming');
};

export const getPastEvents = () => {
  return eventsData.filter(event => event.status === 'past');
};

// Get all events sorted by date (upcoming first, then past)
export const getAllEvents = () => {
  const upcoming = getUpcomingEvents().sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = getPastEvents().sort((a, b) => new Date(b.date) - new Date(a.date));
  return [...upcoming, ...past];
};

export default eventsData;