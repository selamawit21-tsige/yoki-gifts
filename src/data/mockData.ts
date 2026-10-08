import { PrintProvider, PlacedOrder } from '../types';
import { getInitialSamplePhotos } from './curatedPhotos';

export const INITIAL_PRINT_PROVIDERS: PrintProvider[] = [
  {
    id: 'printer-bole',
    name: 'Bole Fine Art Press & Atelier',
    location: 'Cameroon St., Bole Atlas, Addis Ababa',
    contactPerson: 'Kidus Yohannes (Head of Pre-Press)',
    phone: '+251 91 144 8821',
    activeOrdersCount: 4,
    completedOrdersCount: 182,
    capacityPerDay: 15,
    rating: 4.9,
    specialty: 'Smyth-sewn layflat hardcover & hot foil debossing'
  },
  {
    id: 'printer-entoto',
    name: 'Entoto Master Bookbinders',
    location: 'Entoto Ave. / Shiro Meda, Gullele, Addis Ababa',
    contactPerson: 'Meseret Hailu (Master Binder)',
    phone: '+251 92 310 9942',
    activeOrdersCount: 2,
    completedOrdersCount: 124,
    capacityPerDay: 10,
    rating: 4.8,
    specialty: 'Handcrafted raw flax linen & silk linen finishes'
  },
  {
    id: 'printer-piazza',
    name: 'Piazza Archival Print Lab',
    location: 'Churchill Road, Arada, Addis Ababa',
    contactPerson: 'Yared Bekele (Color Technologist)',
    phone: '+251 91 267 3301',
    activeOrdersCount: 3,
    completedOrdersCount: 95,
    capacityPerDay: 20,
    rating: 4.7,
    specialty: 'High-speed editorial magazines & short run periodicals'
  }
];

export const INITIAL_ORDERS: PlacedOrder[] = [
  {
    orderId: 'YG-2026-7841',
    createdAt: 'October 4, 2026',
    assignedPrinterId: 'printer-bole',
    status: 'PRINTING',
    paymentMethod: 'TELEBIRR',
    paymentStatus: 'PAID',
    trackingCode: 'ETH-COURIER-7841',
    config: {
      id: 'cfg-1',
      size: 'A4_HARDCOVER',
      title: 'THE WEDDING OF SARA & MICHAEL',
      subtitle: 'Addis Ababa · November 2025',
      coverColor: 'WARM_BONE',
      foilType: 'GOLD',
      paperFinish: 'SILK_LINEN',
      pageCount: 32,
      includeGiftBox: true,
      message: {
        enabled: true,
        type: 'VOWS',
        title: 'Our Vows Before Family & Elders',
        bodyText: 'To walk together through every season, under the highland eucalyptus breezes and wherever our footsteps lead us. Forever rooted in love and grace.',
        authorSignature: 'Sara & Michael',
        artMotif: 'BOTANICAL_SPRIG',
        pagePlacement: 'FRONT_DEDICATION'
      },
      qrMedia: {
        enabled: true,
        mediaType: 'VIDEO',
        title: 'Wedding Highlights & Church Ceremony',
        mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        captionText: 'Scan to watch our reception dance & blessing ceremony'
      }
    },
    photos: getInitialSamplePhotos(8),
    shipping: {
      fullName: 'Sara Mengistu',
      phoneNumber: '+251 91 123 4567',
      email: 'sara.m@gmail.com',
      region: 'ADDIS_ABABA',
      subCity: 'Bole (Atlas, Medhanialem, Rwanda, Wello Sefer)',
      specificAddress: 'Near Edna Mall, Sunshine Luxury Condos, Block 4, Apt 302',
      deliveryMethod: 'EXPRESS_COURIER'
    },
    pricing: {
      basePrice: 3450,
      paperAddon: 550,
      pagesAddon: 400,
      giftBoxAddon: 300,
      subtotal: 4700,
      shippingFee: 450,
      total: 5150
    }
  },
  {
    orderId: 'YG-2026-7842',
    createdAt: 'October 5, 2026',
    assignedPrinterId: 'printer-entoto',
    status: 'PRE_PRESS',
    paymentMethod: 'CBE_BIRR',
    paymentStatus: 'PAID',
    config: {
      id: 'cfg-2',
      size: 'A4_HARDCOVER',
      title: 'SIMIEN HIGH-ALTITUDE EXPEDITION',
      subtitle: '3,200m Rift Valley Treks · 2026',
      coverColor: 'TERRACOTTA',
      foilType: 'GOLD',
      paperFinish: 'PEARL_LUSTER',
      pageCount: 48,
      includeGiftBox: false,
      message: {
        enabled: true,
        type: 'MEMOIR',
        title: 'Highland Escarpment Field Notes',
        bodyText: 'We stood at the cliff edge as morning mist rolled through the jagged canyons. The gelada baboons grazed quietly in the golden frost.',
        authorSignature: 'Dawit & Expedition Crew',
        artMotif: 'COFFEE_BRANCH',
        pagePlacement: 'SPREAD_CENTER'
      },
      qrMedia: {
        enabled: true,
        mediaType: 'AUDIO_VOICE',
        title: 'Morning Campfire Sounds at Gich Camp',
        mediaUrl: 'https://actions.google.com/sounds/v1/nature/wind_through_trees.ogg',
        captionText: 'Scan to listen to the highland wind & dawn birdsong',
        audioDuration: '2:14'
      }
    },
    photos: getInitialSamplePhotos(12),
    shipping: {
      fullName: 'Dawit Kebede',
      phoneNumber: '+251 92 884 1029',
      email: 'dawit.k@outlook.com',
      region: 'ADDIS_ABABA',
      subCity: 'Kirkos (Kazanchis, Meskel Square, Mexico)',
      specificAddress: 'ECA Headquarters Avenue, Kirkos sub-city',
      deliveryMethod: 'STANDARD'
    },
    pricing: {
      basePrice: 3450,
      paperAddon: 350,
      pagesAddon: 850,
      giftBoxAddon: 0,
      subtotal: 4650,
      shippingFee: 250,
      total: 4900
    }
  },
  {
    orderId: 'YG-2026-7843',
    createdAt: 'October 6, 2026',
    assignedPrinterId: 'printer-piazza',
    status: 'NEW_ORDER',
    paymentMethod: 'TELEBIRR',
    paymentStatus: 'PAID',
    config: {
      id: 'cfg-3',
      size: 'A5_MAGAZINE',
      title: 'SUMMER ARCHIVE VOL. 2',
      subtitle: 'Weekend Stories in Addis & Bishoftu',
      coverColor: 'OBSIDIAN',
      foilType: 'SILVER',
      paperFinish: 'ARCHIVAL_MATTE',
      pageCount: 24,
      includeGiftBox: false,
      message: {
        enabled: false,
        type: 'DEDICATION',
        title: 'Dedication',
        bodyText: '',
        authorSignature: '',
        artMotif: 'NONE',
        pagePlacement: 'FRONT_DEDICATION'
      },
      qrMedia: {
        enabled: false,
        mediaType: 'VIDEO',
        title: '',
        mediaUrl: '',
        captionText: ''
      }
    },
    photos: getInitialSamplePhotos(6),
    shipping: {
      fullName: 'Bethelhem Tadesse',
      phoneNumber: '+251 91 550 9182',
      email: 'bethel.t@gmail.com',
      region: 'REGIONAL',
      subCity: 'Hawassa',
      specificAddress: 'Haile Resort Area, Lakeside Villa 12',
      deliveryMethod: 'STANDARD'
    },
    pricing: {
      basePrice: 2200,
      paperAddon: 0,
      pagesAddon: 0,
      giftBoxAddon: 0,
      subtotal: 2200,
      shippingFee: 250,
      total: 2450
    }
  }
];
