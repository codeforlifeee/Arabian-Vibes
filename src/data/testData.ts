// Test data for development and fallback
import { Activity, Holiday, Cruise } from './types';

export const testActivities: Activity[] = [
  {
    id: 1,
    name: 'Burj Khalifa Observatory',
    location: 'Dubai',
    duration: '2-3 Hours',
    category: 'Sightseeing',
    rating: 4.8,
    price: 149,
    agentPrice: 129,
    discountedPrice: 139,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80'
    ],
    description: 'Visit the world\'s tallest building and enjoy breathtaking views of Dubai.',
    isFlashSale: true,
    flashSaleText: '20% OFF',
    isPopular: true
  },
  {
    id: 2,
    name: 'Desert Safari Adventure',
    location: 'Dubai',
    duration: '6-7 Hours',
    category: 'Adventure',
    rating: 4.9,
    price: 250,
    agentPrice: 220,
    discountedPrice: 230,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80'
    ],
    description: 'Experience the thrill of dune bashing and traditional Bedouin culture.',
    isFlashSale: false,
    isPopular: true
  },
  {
    id: 3,
    name: 'Sheikh Zayed Grand Mosque Tour',
    location: 'Abu Dhabi',
    duration: '3-4 Hours',
    category: 'Cultural',
    rating: 4.9,
    price: 120,
    agentPrice: 100,
    discountedPrice: 110,
    image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&q=80'
    ],
    description: 'Explore one of the world\'s largest mosques and marvel at its stunning architecture.',
    isFlashSale: false,
    isPopular: true
  }
];

export const testHolidays: Holiday[] = [
  {
    id: 1,
    name: 'Maldives Paradise Package',
    destination: 'Maldives',
    duration: '5 Days / 4 Nights',
    category: 'Beach',
    rating: 4.9,
    price: 3500,
    agentPrice: 3200,
    discountedPrice: 3300,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80'
    ],
    description: 'Luxury beach resort with water sports and spa treatments.',
    includes: ['Flights', 'Accommodation', 'Meals', 'Transfers'],
    isFlashSale: true,
    flashSaleText: 'Early Bird 25% OFF'
  },
  {
    id: 2,
    name: 'Dubai Shopping Extravaganza',
    destination: 'Dubai',
    duration: '4 Days / 3 Nights',
    category: 'Shopping',
    rating: 4.7,
    price: 1800,
    agentPrice: 1600,
    discountedPrice: 1700,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'
    ],
    description: 'Shopping tour of Dubai\'s famous malls and traditional souks.',
    includes: ['Accommodation', 'Shopping Tours', 'Transfers'],
    isFlashSale: false
  }
];

export const testCruises: Cruise[] = [
  {
    id: 1,
    name: 'Dubai Marina Dinner Cruise',
    destination: 'Dubai Marina',
    duration: '2-3 Hours',
    category: 'Dinner Cruise',
    rating: 4.8,
    price: 180,
    agentPrice: 160,
    discountedPrice: 170,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80'
    ],
    description: 'Enjoy a romantic dinner cruise with stunning views of Dubai Marina.',
    amenities: ['Dinner Buffet', 'Live Entertainment', 'Open Deck'],
    isFlashSale: false
  },
  {
    id: 2,
    name: 'Dhow Cruise Creek',
    destination: 'Dubai Creek',
    duration: '2 Hours',
    category: 'Traditional Cruise',
    rating: 4.6,
    price: 120,
    agentPrice: 100,
    discountedPrice: 110,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80'
    ],
    description: 'Traditional dhow cruise along historic Dubai Creek.',
    amenities: ['Dinner', 'Traditional Music', 'Air-conditioned Lower Deck'],
    isFlashSale: true,
    flashSaleText: '15% OFF'
  }
];

// Export default for convenience
export default {
  testActivities,
  testHolidays,
  testCruises
};
