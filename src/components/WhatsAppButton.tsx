import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const WHATSAPP_NUMBER = "256767910420";

const WhatsAppButton = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Hide on admin pages
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hello gXchange, I need help!"
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-3 shadow-lg transition-all duration-300 hover:scale-105 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <svg viewBox="0 0 32 32" className="w-6 h-6 fill-current" aria-hidden="true">
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.117.553 4.107 1.518 5.833L4 29l8.34-1.482A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 21.667c-1.816 0-3.51-.484-4.977-1.33l-.354-.2-4.952.88.907-4.76-.234-.394A9.562 9.562 0 0 1 6.333 15c0-5.327 4.339-9.667 9.667-9.667S25.667 9.673 25.667 15s-4.34 9.667-9.667 9.667zm5.484-7.226c-.297-.15-1.76-.869-2.033-.968-.273-.1-.472-.15-.67.15-.199.297-.768.968-.941 1.166-.174.199-.347.224-.644.075-.297-.15-1.257-.463-2.394-1.476-.885-.789-1.484-1.762-1.657-2.06-.174-.297-.02-.458.13-.607.134-.133.297-.347.446-.52.15-.174.199-.298.299-.497.099-.199.05-.372-.05-.52-.1-.15-.67-1.612-.917-2.21-.242-.582-.488-.504-.67-.512l-.572-.01c-.199 0-.52.075-.793.372-.273.298-1.041 1.017-1.041 2.48 0 1.462 1.066 2.875 1.215 3.074.15.199 2.095 3.198 5.073 4.486.709.306 1.263.489 1.695.626.712.226 1.36.194 1.872.118.571-.086 1.76-.72 2.008-1.414.247-.695.247-1.29.173-1.414-.075-.125-.273-.199-.57-.349z" />
      </svg>
      <span className="text-sm font-semibold hidden sm:inline">WhatsApp Help</span>
    </a>
  );
};

export default WhatsAppButton;
