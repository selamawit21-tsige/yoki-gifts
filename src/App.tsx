/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { ConfiguratorView } from './components/ConfiguratorView';
import { PhotoUploaderView } from './components/PhotoUploaderView';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { MessageAndQREditorModal } from './components/MessageAndQREditorModal';
import { QRMediaPreviewModal } from './components/QRMediaPreviewModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { PrinterDashboard } from './components/PrinterDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { CanvasEditorModal } from './components/CanvasEditorModal';
import {
  BookConfiguration,
  PhotoItem,
  BookSize,
  BookCategory,
  PlacedOrder,
  AppUserRole,
  PrintProvider,
  OrderStatus,
  BookMessage,
  BookQRMedia
} from './types';
import {
  BOOK_SIZE_OPTIONS,
  PAPER_FINISH_OPTIONS,
  PAGE_COUNT_OPTIONS,
  DELIVERY_OPTIONS
} from './data/products';
import { CATEGORIES_DATA } from './data/categories';
import { getInitialSamplePhotos } from './data/curatedPhotos';
import { INITIAL_PRINT_PROVIDERS, INITIAL_ORDERS } from './data/mockData';

export default function App() {
  // Multi-Role state
  const [activeRole, setActiveRole] = useState<AppUserRole>('customer');

  // Customer navigation state
  const [activeView, setActiveView] = useState<'landing' | 'configurator' | 'upload' | 'checkout'>('landing');

  // Global shared orders state (Orders dispatched by customer immediately show in printer and admin queues)
  const [orders, setOrders] = useState<PlacedOrder[]>(() => INITIAL_ORDERS);
  const [printers, setPrinters] = useState<PrintProvider[]>(() => INITIAL_PRINT_PROVIDERS);
  const [currentPrinterId, setCurrentPrinterId] = useState<string>('printer-bole');

  // Customer book configuration state
  const [config, setConfig] = useState<BookConfiguration>({
    id: 'book-current',
    size: 'A4_HARDCOVER',
    title: 'ADDIS MEMORY CHRONICLE',
    subtitle: 'Moments Bound in Linen · 2026',
    coverColor: 'WARM_BONE',
    foilType: 'GOLD',
    paperFinish: 'ARCHIVAL_MATTE',
    pageCount: 24,
    includeGiftBox: false,
    fontStyle: 'MODERN',
    message: {
      enabled: true,
      type: 'DEDICATION',
      title: 'To Our Beloved Family & Ancestors',
      bodyText: 'May these pages preserve the mornings over fresh roast, the highland winds of Entoto, and the blessings that bind us together through every generation.',
      authorSignature: 'With love, Selamawit & Family',
      artMotif: 'COFFEE_BRANCH',
      pagePlacement: 'FRONT_DEDICATION'
    },
    qrMedia: {
      enabled: true,
      mediaType: 'VIDEO',
      title: 'Wedding Reception & Highland Celebration',
      mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      captionText: 'Scan with camera to watch our reception celebration video',
      audioDuration: '02:45'
    }
  });

  // Customer photo studio state
  const [photos, setPhotos] = useState<PhotoItem[]>(() => getInitialSamplePhotos(16));

  // Confirmed placed order modal
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  // Dedicated Message & QR Editor modal
  const [isEditingMessageAndQR, setIsEditingMessageAndQR] = useState(false);

  // Interactive QR Media playback simulator modal
  const [previewingQRMedia, setPreviewingQRMedia] = useState<BookQRMedia | null>(null);

  // Customer Track Order modal state
  const [isTrackOrderModalOpen, setIsTrackOrderModalOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined);

  // Active photo being edited in CanvasEditorModal
  const [activeEditingPhoto, setActiveEditingPhoto] = useState<PhotoItem | null>(null);

  // Compute live price for Navbar display
  const currentSize = BOOK_SIZE_OPTIONS[config.size];
  const currentPaper = PAPER_FINISH_OPTIONS[config.paperFinish];
  const currentPage = PAGE_COUNT_OPTIONS.find(p => p.pages === config.pageCount) || PAGE_COUNT_OPTIONS[0];
  const giftBoxPrice = config.includeGiftBox ? 300 : 0;
  const totalETB = currentSize.basePrice + currentPaper.priceAddon + currentPage.priceAddon + giftBoxPrice;

  const currentPrinter = printers.find(p => p.id === currentPrinterId) || printers[0];

  // Category Template Selection Handler
  const handleSelectCategory = (catKey: BookCategory) => {
    const template = CATEGORIES_DATA[catKey];
    if (template) {
      setConfig(prev => ({
        ...prev,
        category: catKey,
        title: template.defaultTitle,
        subtitle: template.defaultSubtitle,
        coverColor: template.defaultCoverColor,
        foilType: template.defaultFoilType,
        message: {
          enabled: true,
          type: catKey === 'WEDDING' ? 'VOWS' : catKey === 'TRAVEL' ? 'MEMOIR' : 'DEDICATION',
          title: template.defaultMessage.title,
          bodyText: template.defaultMessage.bodyText,
          authorSignature: template.defaultMessage.signature,
          artMotif: template.defaultArtMotif,
          pagePlacement: 'FRONT_DEDICATION'
        }
      }));

      // Load curated thematic photography set
      if (template.samplePhotos && template.samplePhotos.length > 0) {
        const themePhotos: PhotoItem[] = template.samplePhotos.map((p, idx) => ({
          id: `sample-${catKey.toLowerCase()}-${idx + 1}-${Date.now()}`,
          url: p.url,
          name: p.name,
          caption: p.caption,
          isCover: idx === 0,
          aspectRatio: 'landscape',
          fileSize: '3.2 MB'
        }));
        setPhotos(themePhotos);
      }
    }
    setActiveView('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers
  const handleStartConfig = (preferredSize?: BookSize, preferredCategory?: BookCategory) => {
    if (preferredSize) {
      setConfig(prev => ({ ...prev, size: preferredSize }));
    }
    if (preferredCategory) {
      handleSelectCategory(preferredCategory);
      return;
    }
    setActiveView('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToUpload = () => {
    setActiveView('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = () => {
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (newOrder: PlacedOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    setPlacedOrder(newOrder);
  };

  const handleCreateNewBook = () => {
    setPlacedOrder(null);
    setConfig({
      id: `book-${Date.now()}`,
      size: 'A4_HARDCOVER',
      title: 'NEW MEMORY ARCHIVE',
      subtitle: 'Addis Ababa · 2026',
      coverColor: 'WARM_BONE',
      foilType: 'GOLD',
      paperFinish: 'ARCHIVAL_MATTE',
      pageCount: 24,
      includeGiftBox: false,
      fontStyle: 'MODERN',
      message: {
        enabled: true,
        type: 'DEDICATION',
        title: 'Dedication Note',
        bodyText: 'Moments to remember and cherish for years to come.',
        authorSignature: 'With warmth',
        artMotif: 'BOTANICAL_SPRIG',
        pagePlacement: 'FRONT_DEDICATION'
      },
      qrMedia: {
        enabled: false,
        mediaType: 'VIDEO',
        title: '',
        mediaUrl: '',
        captionText: ''
      }
    });
    setPhotos(getInitialSamplePhotos(12));
    setActiveView('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveMessageAndQR = (msg: BookMessage, qr: BookQRMedia) => {
    setConfig(prev => ({
      ...prev,
      message: msg,
      qrMedia: qr
    }));
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    notes?: string,
    tracking?: string
  ) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.orderId === orderId) {
          return {
            ...o,
            status: newStatus,
            printerNotes: notes || o.printerNotes,
            trackingCode: tracking || o.trackingCode
          };
        }
        return o;
      })
    );
  };

  const handleReassignPrinter = (orderId: string, newPrinterId: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.orderId === orderId) {
          return {
            ...o,
            assignedPrinterId: newPrinterId
          };
        }
        return o;
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917]">
      {/* Top Bar Navigation with Multi-Role Switcher and Track Order Link */}
      <Navbar
        activeRole={activeRole}
        onChangeRole={(role) => {
          setActiveRole(role);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        photosCount={photos.length}
        totalETB={totalETB}
        activeOrdersCount={orders.filter(o => o.status !== 'DELIVERED').length}
        onOpenTrackOrder={() => {
          setTrackingOrderId(undefined);
          setIsTrackOrderModalOpen(true);
        }}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {/* ROLE 1: CUSTOMER ATELIER */}
        {activeRole === 'customer' && (
          <>
            {activeView === 'landing' && (
              <LandingView
                onStartConfig={handleStartConfig}
                onGoToUpload={handleGoToUpload}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {activeView === 'configurator' && (
              <ConfiguratorView
                config={config}
                onChangeConfig={setConfig}
                onProceedToUpload={handleGoToUpload}
                onBackToLanding={() => {
                  setActiveView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeView === 'upload' && (
              <PhotoUploaderView
                photos={photos}
                config={config}
                onUpdatePhotos={setPhotos}
                onUpdateConfig={setConfig}
                onProceedToCheckout={handleProceedToCheckout}
                onBackToConfig={() => {
                  setActiveView('configurator');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenMessageAndQREditor={() => setIsEditingMessageAndQR(true)}
                onPreviewQR={(qr) => setPreviewingQRMedia(qr)}
                onOpenCanvasEditor={(photo) => setActiveEditingPhoto(photo)}
              />
            )}

            {activeView === 'checkout' && (
              <CheckoutView
                config={config}
                photos={photos}
                onBackToUpload={handleGoToUpload}
                onOrderPlaced={handleOrderPlaced}
              />
            )}
          </>
        )}

        {/* ROLE 2: PRINT PROVIDER PORTAL */}
        {activeRole === 'printer' && (
          <PrinterDashboard
            orders={orders}
            currentPrinter={currentPrinter}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onPreviewQR={(qr) => setPreviewingQRMedia(qr)}
          />
        )}

        {/* ROLE 3: ADMIN CONSOLE */}
        {activeRole === 'admin' && (
          <AdminDashboard
            orders={orders}
            printers={printers}
            onReassignPrinter={handleReassignPrinter}
            onUpdateOrderStatus={(orderId, status) => handleUpdateOrderStatus(orderId, status)}
            onPreviewQR={(qr) => setPreviewingQRMedia(qr)}
          />
        )}
      </main>

      {/* In-Book Dedication Message & QR Media Editor Modal */}
      {isEditingMessageAndQR && (
        <MessageAndQREditorModal
          initialMessage={config.message}
          initialQR={config.qrMedia}
          onSave={handleSaveMessageAndQR}
          onClose={() => setIsEditingMessageAndQR(false)}
        />
      )}

      {/* Interactive QR Media Preview & Playback Simulator */}
      {previewingQRMedia && (
        <QRMediaPreviewModal
          qrMedia={previewingQRMedia}
          onClose={() => setPreviewingQRMedia(null)}
        />
      )}

      {/* Interactive Photo Canvas Editor Modal */}
      {activeEditingPhoto && (
        <CanvasEditorModal
          photo={activeEditingPhoto}
          onSave={(updatedPhoto) => {
            setPhotos(prev => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
            setActiveEditingPhoto(null);
          }}
          onClose={() => setActiveEditingPhoto(null)}
        />
      )}

      {/* Customer Track Order Modal */}
      {isTrackOrderModalOpen && (
        <TrackOrderModal
          orders={orders}
          printers={printers}
          onClose={() => {
            setIsTrackOrderModalOpen(false);
            setTrackingOrderId(undefined);
          }}
          onPreviewQR={(qr) => setPreviewingQRMedia(qr)}
          initialOrderId={trackingOrderId}
        />
      )}

      {/* Order Confirmation Modal */}
      {placedOrder && (
        <OrderConfirmationModal
          order={placedOrder}
          onClose={() => setPlacedOrder(null)}
          onCreateNewBook={handleCreateNewBook}
          onTrackOrder={(orderId) => {
            setTrackingOrderId(orderId);
            setIsTrackOrderModalOpen(true);
          }}
        />
      )}

      {/* Minimalist Atelier Footer */}
      <Footer
        onNavigate={(view) => {
          if (activeRole !== 'customer') setActiveRole('customer');
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
