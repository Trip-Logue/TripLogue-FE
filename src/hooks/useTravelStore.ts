import { create } from 'zustand';
import type { TravelRecordData, Photo } from '@/types';

interface TravelState {
  travelRecords: TravelRecordData[];
  addRecord: (record: Omit<TravelRecordData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecord: (
    recordId: string,
    updatedData: Partial<Omit<TravelRecordData, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => void;
  addPhotoToRecord: (recordId: string, photo: Photo) => void;
  removePhotoFromRecord: (recordId: string, photoId: string) => void;
  getRecordsByUser: (userId: string) => TravelRecordData[];
  getPhotosByUser: (userId: string) => Photo[];
  deleteRecord: (recordId: string) => void;
  deletePhoto: (photoId: string) => void;
  updatePhotoFavorite: (photoId: string, isFavorite: boolean) => void;
  updatePhotoDetails: (recordId: string, photoId: string, updatedDetails: Partial<Photo>) => void;
}

const useTravelStore = create<TravelState>((set, get) => ({
  travelRecords: JSON.parse(localStorage.getItem('travelRecords') || '[]'),

  addRecord: (record) => {
    const newRecord: TravelRecordData = {
      ...record,
      id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => {
      const updatedRecords = [...state.travelRecords, newRecord];
      localStorage.setItem('travelRecords', JSON.stringify(updatedRecords));
      return { travelRecords: updatedRecords };
    });
  },

  updateRecord: (recordId, updatedData) => {
    set((state) => {
      const updatedRecords = state.travelRecords.map((record) =>
        record.id === recordId
          ? {
              ...record,
              ...updatedData,
              updatedAt: new Date().toISOString(),
            }
          : record,
      );
      localStorage.setItem('travelRecords', JSON.stringify(updatedRecords));
      return { travelRecords: updatedRecords };
    });
  },

  addPhotoToRecord: (recordId, photo) => {
    set((state) => {
      const updatedRecords = state.travelRecords.map((record) =>
        record.id === recordId
          ? {
              ...record,
              photos: [...record.photos, { ...photo, travelRecordId: recordId }],
              updatedAt: new Date().toISOString(),
            }
          : record,
      );
      localStorage.setItem('travelRecords', JSON.stringify(updatedRecords));
      return { travelRecords: updatedRecords };
    });
  },

  removePhotoFromRecord: (recordId, photoId) => {
    set((state) => {
      const updatedRecords = state.travelRecords.map((record) =>
        record.id === recordId
          ? {
              ...record,
              photos: record.photos.filter((photo) => photo.id !== photoId),
              updatedAt: new Date().toISOString(),
            }
          : record,
      );
      localStorage.setItem('travelRecords', JSON.stringify(updatedRecords));
      return { travelRecords: updatedRecords };
    });
  },

  getRecordsByUser: (userId) => {
    const state = get();
    return state.travelRecords.filter((record) => record.userId === userId);
  },

  getPhotosByUser: (userId) => {
    const state = get();
    return state.travelRecords
      .filter((record) => record.userId === userId)
      .flatMap((record) => record.photos);
  },

  deleteRecord: (recordId) => {
    set((state) => {
      const updatedRecords = state.travelRecords.filter((record) => record.id !== recordId);
      localStorage.setItem('travelRecords', JSON.stringify(updatedRecords));
      return { travelRecords: updatedRecords };
    });
  },

  deletePhoto: (photoId) => {
    set((state) => {
      const updatedRecords = state.travelRecords.map((record) => ({
        ...record,
        photos: record.photos.filter((photo) => photo.id !== photoId),
        updatedAt: new Date().toISOString(),
      }));
      localStorage.setItem('travelRecords', JSON.stringify(updatedRecords));
      return { travelRecords: updatedRecords };
    });
  },

  updatePhotoFavorite: (photoId, isFavorite) => {
    set((state) => {
      const updatedRecords = state.travelRecords.map((record) => ({
        ...record,
        photos: record.photos.map((photo) =>
          photo.id === photoId ? { ...photo, isFavorite } : photo,
        ),
        updatedAt: new Date().toISOString(),
      }));
      localStorage.setItem('travelRecords', JSON.stringify(updatedRecords));
      return { travelRecords: updatedRecords };
    });
  },

  updatePhotoDetails: (recordId, photoId, updatedDetails) => {
    set((state) => {
      const updatedRecords = state.travelRecords.map((record) => {
        if (record.id === recordId) {
          return {
            ...record,
            photos: record.photos.map((photo) =>
              photo.id === photoId ? { ...photo, ...updatedDetails } : photo,
            ),
            updatedAt: new Date().toISOString(),
          };
        }
        return record;
      });
      localStorage.setItem('travelRecords', JSON.stringify(updatedRecords));
      return { travelRecords: updatedRecords };
    });
  },
}));

export default useTravelStore;
