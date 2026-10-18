import { DEMO_WALLET_PARCELS } from '../data/demo';
import { WalletParcel, WalletDocument } from '../types';

/**
 * In-Memory Session Wallet Store
 * Keeps state coherent across tab navigation during current browser session.
 * Stores zero sensitive data in localStorage.
 */
let sessionParcels: WalletParcel[] = [...DEMO_WALLET_PARCELS];
let listeners: Array<() => void> = [];

export const WalletStore = {
  getParcels: (): WalletParcel[] => {
    return sessionParcels;
  },

  getParcel: (id: string): WalletParcel => {
    return sessionParcels.find((p) => p.id === id) || sessionParcels[0];
  },

  addParcel: (parcel: WalletParcel) => {
    sessionParcels = [parcel, ...sessionParcels];
    notify();
  },

  updateParcel: (id: string, updated: Partial<WalletParcel>) => {
    sessionParcels = sessionParcels.map((p) =>
      p.id === id ? { ...p, ...updated } : p
    );
    notify();
  },

  deleteParcel: (id: string) => {
    sessionParcels = sessionParcels.filter((p) => p.id !== id);
    notify();
  },

  addDocument: (parcelId: string, doc: WalletDocument) => {
    sessionParcels = sessionParcels.map((p) =>
      p.id === parcelId ? { ...p, documents: [doc, ...p.documents] } : p
    );
    notify();
  },

  deleteDocument: (parcelId: string, docId: string) => {
    sessionParcels = sessionParcels.map((p) => {
      if (p.id === parcelId) {
        // Clean up temporary object URL if applicable
        const target = p.documents.find((d) => d.id === docId);
        if (target?.fileUrl && target.fileUrl.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(target.fileUrl);
          } catch {
            // ignore
          }
        }
        return {
          ...p,
          documents: p.documents.filter((d) => d.id !== docId),
        };
      }
      return p;
    });
    notify();
  },

  subscribe: (callback: () => void) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter((cb) => cb !== callback);
    };
  },
};

function notify() {
  listeners.forEach((callback) => callback());
}
