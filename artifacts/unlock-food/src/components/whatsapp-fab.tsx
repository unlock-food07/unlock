import { motion } from "framer-motion";
import { SiWhatsapp } from "react-icons/si";

const WHATSAPP_URL =
  "https://wa.me/213770800569?text=" +
  encodeURIComponent("Salam ! Je viens de UNLOCK FOOD, je voudrais commander :");

export function WhatsAppFab() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, scale: 0, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
      <span className="absolute inset-0 rounded-full bg-[#25D366] blur-xl opacity-50" />
      <span className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.5)] hover:bg-[#1ebe5a] transition-colors">
        <SiWhatsapp className="w-7 h-7 sm:w-8 sm:h-8" />
      </span>
      <span className="hidden md:flex absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/85 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none">
        Commander sur WhatsApp
      </span>
    </motion.a>
  );
}
