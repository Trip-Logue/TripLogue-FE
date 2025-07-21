import { useEffect, useRef } from 'react';
import type { PlaceAutocompleteProps } from '@/types';

export default function AutoComplete({ onPlaceSelect }: PlaceAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place) {
        onPlaceSelect(place);
      }
    });

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [onPlaceSelect]);

  return (
    <div className='flex items-center justify-center w-full h-full'>
      <input
        ref={inputRef}
        type='text'
        placeholder='검색할 장소를 입력하세요'
        className='w-full px-3 py-2 rounded focus:outline-none'
      />
    </div>
  );
}
