import Autocomplete from './autoComplete';
import type { SearchBarProps } from '@/types';

export default function SearchBar({ onSearch, className }: SearchBarProps) {
  return (
    <div className={className}>
      <Autocomplete onPlaceSelect={onSearch} />
    </div>
  );
}
