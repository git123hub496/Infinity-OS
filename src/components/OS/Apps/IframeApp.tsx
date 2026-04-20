import React from 'react';

interface IframeAppProps {
  url: string;
}

export const IframeApp: React.FC<IframeAppProps> = ({ url }) => {
  return (
    <div className="h-full bg-black">
      <iframe 
        src={url} 
        className="w-full h-full border-none bg-black"
        title="App Viewport"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
