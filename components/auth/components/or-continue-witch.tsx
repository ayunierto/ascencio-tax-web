'use client';
interface OrContinueWithProps {
  text: string;
}

const OrContinueWith: React.FC<OrContinueWithProps> = ({ text }) => {
  return (
    <div className="flex items-center gap-2 justify-center">
      <span className="border-b border-b-border w-full"> </span>
      <span className="whitespace-nowrap text-border">{text}</span>
      <span className="border-b border-b-border w-full"> </span>
    </div>
  );
};

export default OrContinueWith;
