import React, { useMemo } from 'react';

export type MemorySource = {
  tag: string;
  href: string;
};

const MemorySourceTag = ({ source }: { source: MemorySource; }) => {
  const tagColor = useMemo(() => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }, []);

  const styles = {
    backgroundColor: tagColor,
  };

  return (
    <a className="p-2 pt-1 pb-1 rounded" style={styles} href={source.href}>{source.tag}</a>
  );
};

export default MemorySourceTag;