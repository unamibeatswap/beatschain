'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Beat } from '@/types/data';
import { toast } from 'react-hot-toast';
import PurchaseModal from '@/components/PurchaseModal.enhanced';

interface PurchaseContextType {
  selectedBeat: Beat | null;
  showPurchaseModal: boolean;
  selectBeatForPurchase: (beat: Beat) => void;
  closePurchaseModal: () => void;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [selectedBeat, setSelectedBeat] = useState<Beat | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const selectBeatForPurchase = (beat: Beat) => {
    setSelectedBeat(beat);
    setShowPurchaseModal(true);
  };

  const closePurchaseModal = () => {
    setShowPurchaseModal(false);
  };

  return (
    <PurchaseContext.Provider
      value={{
        selectedBeat,
        showPurchaseModal,
        selectBeatForPurchase,
        closePurchaseModal,
      }}
    >
      {children}
      {showPurchaseModal && selectedBeat && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={closePurchaseModal}
          beat={selectedBeat}
        />
      )}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
}