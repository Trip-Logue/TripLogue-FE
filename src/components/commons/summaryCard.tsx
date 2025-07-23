type SummaryCardProps = {
  label: string;
  value: string;
};

export default function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className='bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center text-center'>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='text-xl font-bold text-blue-600'>{value}</p>
    </div>
  );
}
