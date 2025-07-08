export interface CommonBtnProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

export interface CommonInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}
