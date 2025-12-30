import React from 'react';

interface FooterProps {
  version?: string;
  repo?: string;
}

export const Footer: React.FC<FooterProps> = ({
  version = '1.0',
  repo = 'gmc-matrimony',
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <footer className="py-4 text-center">
      <p className="text-xs text-footer">
        v{version} | {currentDate} | {repo}
      </p>
    </footer>
  );
};
