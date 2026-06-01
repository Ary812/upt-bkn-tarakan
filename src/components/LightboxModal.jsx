"use client";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

export default function LightboxModal(props) {
  return (
    <Lightbox 
      plugins={[Zoom]} 
      zoom={{
        maxZoomPixelRatio: 3,
        zoomInMultiplier: 2,
      }}
      render={{
        slideHeader: () => null,
        slideFooter: ({ slide }) => (
          <div className="bg-black/50 backdrop-blur-md p-4 text-white w-full absolute bottom-0 left-0">
            <p className="font-bold text-lg mb-1">{slide.title}</p>
            <p className="text-sm text-white/80">{slide.description}</p>
          </div>
        )
      }}
      {...props} 
    />
  );
}
