import React from 'react';

const MemorySourceTags = ({ children }: { children: React.ReactNode; }) => {
  return (
    <span className="flex gap-2 items-center w-fit p-2 rounded-sm bg-[#2d2d2d] text-xs">
      Memory Sources:
      {children}
    </span>
  );
};

export default MemorySourceTags;