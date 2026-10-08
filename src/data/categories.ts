import { BookCategory, CoverColor, FoilType, ArtMotif } from '../types';

export interface CategoryTemplate {
  id: BookCategory;
  name: string;
  tagline: string;
  defaultTitle: string;
  defaultSubtitle: string;
  defaultCoverColor: CoverColor;
  defaultFoilType: FoilType;
  defaultArtMotif: ArtMotif;
  samplePhotos: {
    name: string;
    caption: string;
    url: string;
  }[];
  defaultMessage: {
    title: string;
    bodyText: string;
    signature: string;
  };
}

export const CATEGORIES_DATA: Record<BookCategory, CategoryTemplate> = {
  WEDDING: {
    id: 'WEDDING',
    name: 'Wedding',
    tagline: 'Vows, ceremonies, and heirloom matrimonial chronicles',
    defaultTitle: 'OUR WEDDING CHRONICLE',
    defaultSubtitle: 'Bole Medhanialem & Reception · 2026',
    defaultCoverColor: 'WARM_BONE',
    defaultFoilType: 'GOLD',
    defaultArtMotif: 'BOTANICAL_SPRIG',
    defaultMessage: {
      title: 'Our Vows Before Family & Elders',
      bodyText: 'To walk together through every season, under the highland eucalyptus breezes and wherever our footsteps lead us. Forever rooted in love, grace, and devotion.',
      signature: 'With eternal love & gratitude'
    },
    samplePhotos: [
      {
        name: 'Vows in Botanical Light',
        caption: 'The exchange of rings before parents and witnesses',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Holding Hands at Reception',
        caption: 'First steps as husband and wife under champagne lights',
        url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Wedding Party Laughter',
        caption: 'Family celebrations and traditional music',
        url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Sunset Terrace Portrait',
        caption: 'Golden hour moments overlooking Addis skyline',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80'
      }
    ]
  },
  FAMILY: {
    id: 'FAMILY',
    name: 'Family',
    tagline: 'Multi-generation gatherings, heritage, and household memories',
    defaultTitle: 'THE FAMILY CHRONICLES',
    defaultSubtitle: 'Generations Rooted in Addis Ababa',
    defaultCoverColor: 'SAGE',
    defaultFoilType: 'GOLD',
    defaultArtMotif: 'COFFEE_BRANCH',
    defaultMessage: {
      title: 'A Tribute to Generations Past & Present',
      bodyText: 'Dedicated to our parents and elders, whose hands laid the foundations of our home. Every smile within these pages carries your warmth and quiet strength.',
      signature: 'With love from all children & grandchildren'
    },
    samplePhotos: [
      {
        name: 'Three Generations Together',
        caption: 'Grandmother surrounded by children and grandchildren',
        url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Morning Coffee Ceremony',
        caption: 'Frankincense incense and freshly roasted coffee beans',
        url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'First Steps in Courtyard',
        caption: 'Little laughter echoing across red stone tiles',
        url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Highland Garden Gathering',
        caption: 'Sunday lunch under jacaranda branches',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
      }
    ]
  },
  TRAVEL: {
    id: 'TRAVEL',
    name: 'Travel',
    tagline: 'Mountain journeys, expeditions, and unforgettable landscapes',
    defaultTitle: 'SIMIEN & HIGHLAND EXPEDITION',
    defaultSubtitle: '3,200m Escarpments & Rift Valley',
    defaultCoverColor: 'TERRACOTTA',
    defaultFoilType: 'GOLD',
    defaultArtMotif: 'HERITAGE_CREST',
    defaultMessage: {
      title: 'Highland Escarpment Field Notes',
      bodyText: 'We stood at the cliff edge as morning mist rolled through the jagged canyons. The wind was cool and pure, carrying the silence of an ancient earth.',
      signature: 'The Voyage Archive'
    },
    samplePhotos: [
      {
        name: 'Simien Mountain Escarpment',
        caption: 'First light breaking over jagged highland ridges',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Lake Hawassa at Sunset',
        caption: 'Fishermen glinting in golden water reflections',
        url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Entoto Ridge Overlook',
        caption: 'Highland eucalyptus breeze looking toward Addis',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Crater Lake Calm',
        caption: 'Sunday afternoon reflection under fig trees',
        url: 'https://images.unsplash.com/photo-1439853941329-a99ce049f08c?auto=format&fit=crop&w=1200&q=80'
      }
    ]
  },
  COUPLE: {
    id: 'COUPLE',
    name: 'Couple',
    tagline: 'Anniversaries, weekend escapes, and intimate memories',
    defaultTitle: 'SUMMER WITH YOU',
    defaultSubtitle: 'Quiet Mornings & Golden Evenings',
    defaultCoverColor: 'WARM_BONE',
    defaultFoilType: 'SILVER',
    defaultArtMotif: 'BOTANICAL_SPRIG',
    defaultMessage: {
      title: 'To My Favorite Person',
      bodyText: 'In every city, through every quiet walk and shared laugh, life is richer by your side. Here are the moments I never want to forget.',
      signature: 'Always & Forever'
    },
    samplePhotos: [
      {
        name: 'Laughter by the Lake',
        caption: 'Quiet afternoon conversation in the breeze',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Holding Lilies',
        caption: 'A bouquet picked at morning market',
        url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Bespoke Keepsake Books',
        caption: 'Handcrafted notes written together',
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Golden Hour Silhouette',
        caption: 'Standing together watching the sunset',
        url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80'
      }
    ]
  },
  BIRTHDAY: {
    id: 'BIRTHDAY',
    name: 'Birthday',
    tagline: 'Milestone years, birthday toasts, and celebratory moments',
    defaultTitle: 'CELEBRATING 30 YEARS',
    defaultSubtitle: 'A Decade of Milestones & Joy',
    defaultCoverColor: 'OBSIDIAN',
    defaultFoilType: 'GOLD',
    defaultArtMotif: 'BOTANICAL_SPRIG',
    defaultMessage: {
      title: 'Happy Birthday & Blessings',
      bodyText: 'May this new chapter bring even more wonder, deep friendships, and fulfillment. Celebrating the remarkable person you are today and every day.',
      signature: 'With warmest wishes & cheers'
    },
    samplePhotos: [
      {
        name: 'Birthday Candle Toasts',
        caption: 'Surrounded by close friends singing wishes',
        url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Candid Smiles',
        caption: 'Unfiltered joy during the celebratory dinner',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Starlit Campfire Gathering',
        caption: 'Celebration under the highland stars',
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Handwritten Gift Notes',
        caption: 'Keepsake letters from dearest friends',
        url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80'
      }
    ]
  },
  FRIENDS: {
    id: 'FRIENDS',
    name: 'Friends',
    tagline: 'Weekend roadtrips, coffee hangs, and lifelong camaraderie',
    defaultTitle: 'THE WEEKEND CREW',
    defaultSubtitle: 'Addis Nights & Roadtrip Stories',
    defaultCoverColor: 'OBSIDIAN',
    defaultFoilType: 'SILVER',
    defaultArtMotif: 'COFFEE_BRANCH',
    defaultMessage: {
      title: 'To the Nights That Turned into Mornings',
      bodyText: 'To spontaneous roadtrips, endless debates around coffee cups, and memories that time will never dull. Here is to our crew.',
      signature: 'The Inner Circle'
    },
    samplePhotos: [
      {
        name: 'Coffee Terrace Hangout',
        caption: 'Saturday afternoons with laughter and coffee',
        url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Roadtrip Overlook',
        caption: 'Stopping on the ridge to take in the canyon view',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Starlit Evening',
        caption: 'Campfire stories and acoustic music',
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Group Portrait Piazza',
        caption: 'Exploring old stone architectural streets',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
      }
    ]
  },
  TEAM: {
    id: 'TEAM',
    name: 'Team',
    tagline: 'Company chronicles, design milestones, and annual tributes',
    defaultTitle: 'ANNUAL ATELIER CHRONICLE',
    defaultSubtitle: 'Projects, Culture & Team Milestones',
    defaultCoverColor: 'OBSIDIAN',
    defaultFoilType: 'BLIND_EMBOSS',
    defaultArtMotif: 'HERITAGE_CREST',
    defaultMessage: {
      title: 'Honoring Shared Dedication & Craft',
      bodyText: 'Every project completed this year is a testament to the talent, resilience, and collaborative spirit of our studio team. Built with pride.',
      signature: 'Leadership & Studio Team'
    },
    samplePhotos: [
      {
        name: 'Studio Design Workshop',
        caption: 'Reviewing physical print proofs and materials',
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Architectural Project Sites',
        caption: 'Stone masonry and historic restorations in Addis',
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Team Summit Gathering',
        caption: 'Annual strategy retreat in the highlands',
        url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80'
      },
      {
        name: 'Handcrafted Bookbinding Spine',
        caption: 'Final quality inspection before dispatch',
        url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80'
      }
    ]
  }
};
