import { PhotoItem } from '../types';

export const SAMPLE_EDITORIAL_PHOTOS: Omit<PhotoItem, 'id'>[] = [
  {
    name: 'Addis Golden Hour Coffee Ceremony',
    caption: 'Morning rituals on the terrace, aroma of fresh roast',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape',
    fileSize: '3.4 MB',
    tags: ['Candid', 'Details']
  },
  {
    name: 'Entoto Ridge Overlook',
    caption: 'Highland eucalyptus breeze watching the city awaken',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape',
    fileSize: '4.1 MB',
    tags: ['Landscape']
  },
  {
    name: 'Linen Vows & Botanical Bouquet',
    caption: 'Bole Medhanialem chapel garden, November 2025',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'portrait',
    fileSize: '2.8 MB',
    tags: ['Ceremony', 'Details']
  },
  {
    name: 'Simien Mountains Horizon',
    caption: 'Escarpment silence at dawn, 3,200 meters above sea level',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape',
    fileSize: '5.2 MB',
    tags: ['Landscape']
  },
  {
    name: 'Bespoke Archival Print Spreads',
    caption: 'Fine art sheets resting under morning sun rays',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'square',
    fileSize: '3.1 MB',
    tags: ['Details']
  },
  {
    name: 'Archways of Old Piazza',
    caption: 'Handcrafted wooden shutters and century-old stone masonry',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'portrait',
    fileSize: '3.9 MB',
    tags: ['Candid', 'Landscape']
  },
  {
    name: 'Sunset over Lake Hawassa',
    caption: 'Fishermen glinting in golden water reflections',
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape',
    fileSize: '4.5 MB',
    tags: ['Landscape', 'Candid']
  },
  {
    name: 'Family Gathering Around Mesob',
    caption: 'Three generations sharing laughter and blessings',
    url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'portrait',
    fileSize: '3.7 MB',
    tags: ['Portraits', 'Candid']
  },
  {
    name: 'Raw Cotton Weaving Shiro Meda',
    caption: 'Tibeb patterns emerging from the pedal loom',
    url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'square',
    fileSize: '2.6 MB',
    tags: ['Details']
  },
  {
    name: 'Bishoftu Crater Lake Retreat',
    caption: 'Calm ripples under fig trees on Sunday afternoon',
    url: 'https://images.unsplash.com/photo-1439853941329-a99ce049f08c?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape',
    fileSize: '4.8 MB',
    tags: ['Landscape']
  },
  {
    name: 'Timeless Portrait in Soft Shadow',
    caption: 'Natural window glow, monochrome archival series',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'portrait',
    fileSize: '3.0 MB',
    tags: ['Portraits']
  },
  {
    name: 'Antique Brass & Leather Keepsakes',
    caption: 'Travel notes written by candlelight',
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'square',
    fileSize: '2.4 MB',
    tags: ['Details']
  },
  {
    name: 'Gondar Castle Stone Details',
    caption: 'Royal enclosures standing through centuries of rain',
    url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape',
    fileSize: '4.3 MB',
    tags: ['Details', 'Landscape']
  },
  {
    name: 'Warm Hands Holding Fresh Lilies',
    caption: 'Moments of quiet joy during the reception',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'portrait',
    fileSize: '2.9 MB',
    tags: ['Ceremony', 'Details']
  },
  {
    name: 'Starlit Campfire in the Great Rift',
    caption: 'Milky way arching above acacia branches',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'landscape',
    fileSize: '5.6 MB',
    tags: ['Landscape']
  },
  {
    name: 'First Steps in the Courtyard',
    caption: 'Little laughter echoing on red clay tiles',
    url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'square',
    fileSize: '3.3 MB',
    tags: ['Portraits', 'Candid']
  }
];

export function getInitialSamplePhotos(count: number = 16): PhotoItem[] {
  return SAMPLE_EDITORIAL_PHOTOS.slice(0, count).map((sample, idx) => ({
    id: `photo-sample-${idx + 1}`,
    ...sample,
    isCover: idx === 0
  }));
}
