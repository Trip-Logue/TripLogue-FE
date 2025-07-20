import { cn } from '@/lib/utils';
import type { CommonBtnProps } from '../../types';

function CommonBtn({ text, type = 'button', onClick, className }: CommonBtnProps) {
  const defaultClass =
    'bg-[#D9D9D9] text-[#1A1A1A] border border-transparent rounded-lg px-4 py-2 font-medium text-base hover:bg-[#C0C0C0] duration-200 w-50 h-10';

  return (
    <button type={type} onClick={onClick} className={cn(defaultClass, className)}>
      {text}
    </button>
  );
}

export default CommonBtn;
