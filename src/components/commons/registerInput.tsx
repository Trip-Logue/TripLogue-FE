import { cn } from '@/lib/utils';
import type { RegisterInputProps } from '../../types';

function RegisterInput({
  id,
  type,
  value,
  placeholder,
  onChange,
  autoFocus = false,
  className,
}: RegisterInputProps) {
  const defaultClass =
    'bg-white border rounded-lg px-4 py-2 font-medium text-base focus:outline-none focus:ring-2 focus:ring-blue-500 duration-200 w-full h-10';

  return (
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      maxLength={100}
      autoFocus={autoFocus}
      className={cn(defaultClass, className)}
    />
  );
}

export default RegisterInput;
