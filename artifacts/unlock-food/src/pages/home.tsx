import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Lock, LockOpen, LockKeyhole, ShoppingBag, ChevronRight, ChevronLeft, Star, ArrowRight, Instagram, Facebook, MapPin, Phone, Plus, Hamburger, Sandwich, Salad, Drumstick, CupSoda, UtensilsCrossed, Soup, Wheat, LeafyGreen, ChefHat, Flame, Target, Bike } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ParticleBurst } from "@/components/ui/particle-burst";
import logoUrl from "@assets/unlock_logo_transparent.png";

const BASE = import.meta.env.BASE_URL;
const img = (p: string) => `${BASE}${p.replace(/^\//, "")}`;

const TacoIcon: LucideIcon = (({ className, strokeWidth = 2, ...rest }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...rest}
  >
    <path d="M2 17a10 10 0 0 1 20 0" />
    <path d="M2 17h20" />
    <path d="M6 17c0-2 1.5-3 3-3s2 1 3 1 2-1 3-1 3 1 3 3" />
    <path d="M9 13c.5-1 1.5-1.5 3-1.5s2.5.5 3 1.5" />
    <path d="M12 9.5v2" />
  </svg>
)) as unknown as LucideIcon;

const MalfoufIcon: LucideIcon = (({ className, strokeWidth = 2, ...rest }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...rest}
  >
    <rect x="2.5" y="9" width="19" height="6" rx="3" />
    <path d="M2.5 11 H21.5" />
    <path d="M2.5 13 H21.5" />
    <path d="M6 9 V15" />
    <path d="M12 9 V15" />
    <path d="M18 9 V15" />
  </svg>
)) as unknown as LucideIcon;

const SandwichIcon: LucideIcon = (({ className, strokeWidth = 2, ...rest }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...rest}
  >
    <path d="M3 14c0-2.5 2-4 9-4s9 1.5 9 4-2 4-9 4-9-1.5-9-4Z" />
    <path d="M7 11.5 L8 9.5" />
    <path d="M11 11 L12 9" />
    <path d="M15 11 L16 9" />
    <path d="M19 11.5 L20 9.5" />
    <path d="M5 14.5 L7 14" />
    <path d="M9.5 15 L11 14.5" />
    <path d="M14 15 L15.5 14.5" />
    <path d="M18 14.5 L20 14" />
  </svg>
)) as unknown as LucideIcon;

// Menu Data
const MENU_CATEGORIES: { id: string; name: string; image: string; Icon: LucideIcon }[] = [
  { id: "tacos", name: "TACOS", image: img("images/tacos-v2.png"), Icon: TacoIcon },
  { id: "malfouf", name: "MALFOUF", image: img("images/malfouf-v2.png"), Icon: MalfoufIcon },
  { id: "sandwich", name: "SANDWICH", image: img("images/sandwich-v2.png"), Icon: SandwichIcon },
  { id: "burger", name: "BURGER", image: img("images/burger-v2.png"), Icon: Hamburger },
  { id: "plat", name: "PLAT", image: img("images/plat-v2.png"), Icon: ChefHat },
  { id: "pasta", name: "PASTA", image: img("images/pasta-v2.png"), Icon: Soup },
  { id: "salads", name: "SALADS", image: img("images/salad-v2.png"), Icon: Salad },
  { id: "crispy", name: "CRISPY", image: img("images/crispy-v2.png"), Icon: Drumstick },
  { id: "drinks", name: "DRINKS", image: img("images/drinks-v2.png"), Icon: CupSoda },
];

const MENU_ITEMS: Record<string, { name: string; price: number; highlight?: boolean; badge?: string }[]> = {
  tacos: [
    { name: "Tacos Chawarma", price: 350 },
    { name: "Tacos Poulet Crispy", price: 350 },
    { name: "Tacos Mix", price: 450 },
    { name: "Tacos Kabda", price: 400 },
    { name: "Tacos Viande Hachée", price: 400 },
  ],
  malfouf: [
    { name: "Malfouf Chawarma", price: 250 },
    { name: "Malfouf Poulet Crispy", price: 250 },
    { name: "Malfouf Mix", price: 350 },
    { name: "Malfouf Kabda", price: 300 },
    { name: "Malfouf Viande Hachée", price: 300 },
    { name: "Malfouf Frites", price: 400 },
  ],
  sandwich: [
    { name: "Sandwich Frit", price: 100 },
    { name: "Sandwich Frit Omelette", price: 150 },
    { name: "Sandwich Chawarma", price: 250 },
    { name: "Sandwich Poulet Crispy", price: 250 },
    { name: "Sandwich Mix", price: 350 },
    { name: "Sandwich Kabda", price: 300 },
    { name: "Sandwich Viande Hachée", price: 300 },
  ],
  burger: [
    { name: "Burger Classic", price: 250 },
    { name: "Burger Crispy", price: 250 },
    { name: "Burger Mix", price: 500 },
    { name: "Burger Double Crispy", price: 500 },
    { name: "Burger Unloock", price: 650, highlight: true, badge: "SIGNATURE" },
    { name: "Burger Double Viande Hachée", price: 500 },
  ],
  plat: [
    { name: "Plat Crispy", price: 500 },
    { name: "Plat Viande Hachée", price: 500 },
    { name: "Plat Chawarma", price: 500 },
    { name: "Plat Kabda", price: 600 },
    { name: "Plat Mexicain", price: 650 },
    { name: "Plat Escalope à la Crème", price: 700 },
    { name: "Plat Suprême", price: 700 },
    { name: "Plat Unlock", price: 800, highlight: true, badge: "UNLOCK PICK" },
  ],
  pasta: [
    { name: "Pasta 3 Fromag", price: 500 },
    { name: "Pasta 3 Fromag Crispy", price: 700 },
    { name: "Pasta Alfredo", price: 700 },
  ],
  salads: [
    { name: "Healthy Salad", price: 250 },
    { name: "Camembert Salad", price: 350 },
    { name: "Caesar Salad", price: 350 },
    { name: "Unlock Salad", price: 500, highlight: true, badge: "SIGNATURE" },
  ],
  crispy: [
    { name: "3 Pieces Crispy", price: 250 },
    { name: "3 Crispy + Frit", price: 350 },
    { name: "12 Crispy + Frit + Sauce", price: 1000 },
    { name: "24 Crispy + Frit + Sauce", price: 1800 },
  ],
  drinks: [
    { name: "Boisson 25 CL", price: 70 },
    { name: "Boisson 1L", price: 130 },
    { name: "Canette Coca-Cola", price: 100 },
    { name: "Canette Fanta", price: 100 },
    { name: "Canette Sprite", price: 100 },
    { name: "Hamoud Boualem", price: 100 },
    { name: "Selecto", price: 100 },
    { name: "Ifri Fruity", price: 120 },
    { name: "Red Bull", price: 350, highlight: true, badge: "ENERGY" },
    { name: "Eau Minérale 1L", price: 50 },
    { name: "Eau 50 CL", price: 30 },
    { name: "Café Express", price: 80 },
  ],
};

const HOT_DEALS = [
  { name: "Burger Mix", price: 400, originalPrice: 500 },
  { name: "Tacos Frites", price: 500, originalPrice: 650 },
  { name: "Tower", price: 950, originalPrice: 1200 },
];

const SECRET_ITEMS = [
  { name: "The Blackout Burger", price: 850, desc: "Double smash patty, truffle mayo, charcoal bun" },
  { name: "Golden Crispy Volcano", price: 1200, desc: "Mountain of crispy chicken drenched in molten cheddar" },
  { name: "Midnight Tacos", price: 700, desc: "Secret spice blend, smoked meat, pure flavor" },
];

export default function Home() {
  const { addItem, itemCount, setIsOpen } = useCart();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0].id);
  const [isSecretUnlocked, setIsSecretUnlocked] = useState(false);
  const [showHeroBurst, setShowHeroBurst] = useState(false);
  const [showSecretBurst, setShowSecretBurst] = useState(false);
  const [vaultPulse, setVaultPulse] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const scrollStrip = (dir: 1 | -1) => {
    stripRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  const { scrollYProgress } = useScroll();
  const heroBurgerY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const heroBurgerRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  const handleAddToCart = (item: any, categoryImage: string) => {
    addItem({
      id: `${item.name}-${Date.now()}`,
      name: item.name,
      price: item.price,
      image: categoryImage,
    });
    setVaultPulse((p) => p + 1);
    toast({
      title: "Unlocked & Added",
      description: `${item.name} is in your vault.`,
      duration: 2000,
    });
  };

  const unlockHero = () => {
    setShowHeroBurst(true);
    setTimeout(() => {
      setShowHeroBurst(false);
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
  };

  const unlockSecretMenu = () => {
    setShowSecretBurst(true);
    setTimeout(() => {
      setIsSecretUnlocked(true);
      setShowSecretBurst(false);
    }, 500);
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Sticky Nav */}
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="w-11 h-11 md:w-14 md:h-14 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:drop-shadow-[0_0_18px_rgba(255,46,46,0.65)]">
            <img src={logoUrl} alt="Unlock Food" className="w-full h-full object-contain" />
          </div>
          <span className="font-display text-lg sm:text-2xl tracking-wider group-hover:text-primary transition-colors">UNLOCK FOOD</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          <a href="#menu" className="hover:text-white transition-colors">Menu</a>
          <a href="#deals" className="hover:text-primary transition-colors">Hot Deals</a>
          <a href="#story" className="hover:text-white transition-colors">Story</a>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-3 pl-2 pr-5 h-14 rounded-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/10 hover:border-primary/60 transition-all shadow-[0_0_0_1px_rgba(255,46,46,0)] hover:shadow-[0_0_30px_rgba(255,46,46,0.45)]"
          aria-label="Open vault"
        >
          {/* Vault disc */}
          <span className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary to-[#b81818] flex items-center justify-center shadow-[inset_0_0_0_2px_rgba(255,255,255,0.18),inset_0_-6px_12px_rgba(0,0,0,0.45),0_0_20px_rgba(255,46,46,0.35)] group-hover:shadow-[inset_0_0_0_2px_rgba(255,255,255,0.25),inset_0_-6px_12px_rgba(0,0,0,0.45),0_0_36px_rgba(255,46,46,0.7)] transition-shadow">
            {/* Dial notches */}
            <span className="absolute inset-1 rounded-full border border-dashed border-white/25 group-hover:[animation:spin_4s_linear_infinite]" />
            {/* Lock icon swap on hover */}
            <Lock className="w-4 h-4 text-white drop-shadow group-hover:opacity-0 transition-opacity absolute" strokeWidth={2.5} />
            <LockOpen className="w-4 h-4 text-amber-300 drop-shadow opacity-0 group-hover:opacity-100 transition-opacity absolute" strokeWidth={2.5} />
            {/* Glint */}
            <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/60 blur-[1px]" />
          </span>

          <span className="flex flex-col items-start leading-none">
            <span className="text-[9px] font-bold tracking-[0.25em] text-amber-300/80 uppercase">The</span>
            <span className="font-display text-lg tracking-wider text-white group-hover:text-primary transition-colors">VAULT</span>
          </span>

          {itemCount > 0 && (
            <motion.span
              key={itemCount}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="absolute -top-2 -right-2 min-w-[26px] h-[26px] px-1.5 bg-amber-400 text-black text-xs font-black rounded-full flex items-center justify-center shadow-[0_0_18px_rgba(255,195,0,0.85)] border-2 border-background"
            >
              {itemCount}
            </motion.span>
          )}

          {/* Pulse ring when items exist */}
          {itemCount > 0 && (
            <span className="absolute inset-0 rounded-full ring-2 ring-primary/40 animate-ping pointer-events-none" />
          )}

          {/* Add-to-cart shockwave */}
          <AnimatePresence>
            {vaultPulse > 0 && (
              <>
                <motion.span
                  key={`r1-${vaultPulse}`}
                  initial={{ scale: 0.9, opacity: 0.9 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full ring-4 ring-amber-300 pointer-events-none"
                />
                <motion.span
                  key={`r2-${vaultPulse}`}
                  initial={{ scale: 0.9, opacity: 0.7 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1.1, ease: "easeOut", delay: 0.12 }}
                  className="absolute inset-0 rounded-full ring-2 ring-primary pointer-events-none"
                />
                <motion.span
                  key={`flash-${vaultPulse}`}
                  initial={{ opacity: 0.85, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.15 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-amber-300/40 blur-md pointer-events-none"
                />
              </>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-24 pb-12 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none mix-blend-overlay" />
        
        <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center relative z-10">
          <div className="space-y-10 relative z-20 pt-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <h1 className="font-display text-[5rem] sm:text-[6rem] md:text-[8rem] lg:text-[9rem] leading-[0.85] tracking-tighter uppercase">
                <span className="block text-white">UNLOCK</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary pb-4">YOUR MEAL</span>
                <span className="inline-block mt-2 relative">
                  <Lock className="inline w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 text-white -mt-6 opacity-20 absolute -z-10" />
                  <Lock className="inline w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 text-secondary -mt-6 animate-pulse" />
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground font-medium max-w-md border-l-4 border-primary pl-6 py-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Not just food… it's an experience. Dive into the flavor vault and unlock the ultimate satisfaction.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="relative inline-block"
            >
              <Button 
                size="lg" 
                className="h-20 px-12 text-2xl font-display uppercase tracking-widest bg-white text-black hover:bg-primary hover:text-white rounded-none shadow-[10px_10px_0px_rgba(255,0,0,1)] hover:shadow-[15px_15px_0px_rgba(255,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all group overflow-hidden"
                onClick={unlockHero}
              >
                <span className="relative z-10 flex items-center">
                  Start Unlocking <LockOpen className="ml-4 w-8 h-8 group-hover:rotate-12 group-hover:scale-110 transition-transform" />
                </span>
              </Button>
              <ParticleBurst isActive={showHeroBurst} />
            </motion.div>
          </div>
          
          <div className="relative h-[50vh] min-h-[400px] lg:h-[800px] w-full flex items-center justify-center -mt-10 lg:mt-0">
            <div className="absolute w-[80%] h-[80%] bg-primary/40 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute w-[60%] h-[60%] bg-secondary/30 rounded-full blur-[80px] mix-blend-screen" />
            
            <motion.img 
              src={img("images/hero-burger-v2.png")} 
              alt="Unlock Signature Burger" 
              className="relative z-10 w-[120%] h-[120%] object-contain object-center lg:translate-x-10 drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
              style={{ y: heroBurgerY, rotate: heroBurgerRotate }}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
            />
          </div>
        </div>
      </section>

      {/* Marquee Strip */}
      <div className="w-full overflow-hidden bg-primary py-6 border-y-4 border-black relative z-20">
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center text-black font-display text-4xl md:text-6xl uppercase tracking-widest mx-6 drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
              <span>FRESH DAILY</span>
              <span className="mx-8 text-white">•</span>
              <span>UNLOCK THE FLAVOR</span>
              <span className="mx-8 text-white">•</span>
              <span>100% HALAL</span>
              <span className="mx-8 text-white">•</span>
              <span>SINCE 2020</span>
              <span className="mx-8 text-white">•</span>
              <span>UNLOCK YOUR MEAL</span>
              <span className="mx-8 text-white">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Menu Section - Editorial Layout */}
      <section id="menu" className="py-32 px-6 md:px-12 bg-background relative">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div>
              <h2 className="font-display text-[4rem] md:text-[6rem] uppercase leading-none mb-4">
                THE <span className="text-primary">VAULT</span>
              </h2>
              <div className="h-2 w-32 bg-secondary" />
            </div>
            <p className="text-muted-foreground md:text-xl max-w-md md:justify-self-end text-left md:text-right pb-2">
              Every item engineered for maximum impact. Choose your category to unlock the menu.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Category Sidebar */}
            <div className="lg:w-[30%] relative sticky top-32 h-fit">
              <button
                type="button"
                onClick={() => scrollStrip(-1)}
                aria-label="Previous categories"
                className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/80 border border-white/20 text-white shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:bg-primary hover:border-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => scrollStrip(1)}
                aria-label="Next categories"
                className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/80 border border-white/20 text-white shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:bg-primary hover:border-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <div className="lg:hidden absolute left-10 top-0 bottom-6 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="lg:hidden absolute right-10 top-0 bottom-6 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            <div ref={stripRef} className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-6 lg:pb-0 gap-3 hide-scrollbar scroll-smooth lg:px-0 px-12">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`group relative flex items-center justify-between p-6 rounded-none font-display text-2xl md:text-3xl uppercase tracking-widest transition-all flex-shrink-0 lg:flex-shrink-1 text-left ${
                    activeCategory === cat.id 
                      ? "bg-white text-black" 
                      : "bg-transparent text-white/50 border border-white/10 hover:text-white hover:border-white/30"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-4">
                    <span className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full transition-all ${
                      activeCategory === cat.id
                        ? "bg-primary text-white shadow-[0_0_24px_rgba(255,46,46,0.7)] rotate-[-6deg] scale-110"
                        : "bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white border border-white/10"
                    }`}>
                      <cat.Icon className="w-7 h-7 md:w-8 md:h-8" strokeWidth={2.2} />
                      {activeCategory === cat.id && (
                        <span className="absolute inset-0 rounded-full ring-2 ring-amber-300/70 animate-ping" />
                      )}
                    </span>
                    <span>{cat.name}</span>
                  </span>
                  <div className={`absolute left-0 top-0 bottom-0 w-2 bg-primary transition-all ${activeCategory === cat.id ? "opacity-100" : "opacity-0"}`} />
                  <ChevronRight className={`w-8 h-8 hidden lg:block transition-transform ${activeCategory === cat.id ? "text-primary translate-x-2" : "opacity-0 -translate-x-4 group-hover:opacity-50 group-hover:translate-x-0"}`} />
                </button>
              ))}
            </div>
            </div>

            {/* Menu Items Grid */}
            <div className="lg:w-[70%]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {/* Featured Image for the category */}
                  <div className="md:col-span-2 aspect-[21/9] rounded-none overflow-hidden relative group border-2 border-white/10 mb-4 bg-card">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                    <img 
                      src={MENU_CATEGORIES.find(c => c.id === activeCategory)?.image} 
                      alt={activeCategory} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 mix-blend-luminosity"
                    />
                    <div className="absolute bottom-8 left-8 z-20">
                      <h3 className="font-display text-5xl text-white uppercase">{MENU_CATEGORIES.find(c => c.id === activeCategory)?.name}</h3>
                    </div>
                  </div>

                  {MENU_ITEMS[activeCategory].map((item, idx) => (
                    <motion.div 
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`group relative flex flex-col p-8 transition-all ${
                        item.highlight 
                          ? "bg-[#111] border-l-4 border-primary shadow-[0_0_40px_rgba(255,0,0,0.1)]" 
                          : "bg-card/50 border border-white/5 hover:border-white/20 hover:bg-card"
                      }`}
                    >
                      {item.badge && (
                        <div className="absolute -top-3 -right-3 bg-secondary text-black font-display text-sm px-4 py-2 uppercase tracking-widest shadow-[0_5px_15px_rgba(255,195,0,0.4)] rotate-3 z-20 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" strokeWidth={3} />
                          {item.badge}
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h4 className="font-display text-3xl uppercase text-white mb-3 pr-8">{item.name}</h4>
                        <div className="h-px w-full bg-white/10 mb-6" />
                      </div>
                      
                      <div className="flex items-end justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Price</span>
                          <span className={`text-3xl font-display uppercase tracking-wider ${item.highlight ? "text-primary" : "text-white"}`}>
                            {item.price} DA
                          </span>
                        </div>
                        <Button 
                          className={`rounded-none h-14 w-14 p-0 flex items-center justify-center transition-all ${
                            item.highlight 
                              ? "bg-primary hover:bg-primary/80 text-white" 
                              : "bg-white text-black hover:bg-gray-200"
                          }`}
                          onClick={() => handleAddToCart(item, MENU_CATEGORIES.find(c => c.id === activeCategory)?.image || "")}
                        >
                          <Plus size={24} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Deals */}
      <section id="deals" className="py-32 px-6 md:px-12 bg-primary relative overflow-hidden">
        {/* Editorial half-tone background effect */}
        <div className="absolute inset-0 opacity-[0.15] mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <h2 className="font-display text-[5rem] md:text-[8rem] uppercase text-black drop-shadow-[4px_4px_0px_rgba(255,255,255,1)] leading-none">
                HOT <br /> DEALS <Flame className="inline-block w-20 h-20 md:w-28 md:h-28 -mt-4 align-middle" strokeWidth={2.5} />
              </h2>
            </div>
            <div className="bg-black text-white px-8 py-4 uppercase font-bold tracking-widest text-xl mb-4 self-start md:self-end">
              Limited time. Maximum flavor.
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {HOT_DEALS.map((deal, idx) => (
              <motion.div 
                key={deal.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                className="bg-background border-4 border-black p-10 transform transition-transform hover:-translate-y-4 hover:shadow-[20px_20px_0px_rgba(0,0,0,1)] relative group"
              >
                <div className="absolute top-6 right-6 bg-secondary text-black px-4 py-2 font-display text-xl uppercase rotate-[-5deg] group-hover:rotate-0 transition-transform">
                  Save {deal.originalPrice - deal.price} DA
                </div>
                <h3 className="font-display text-4xl text-white uppercase mb-8 mt-12">{deal.name}</h3>
                <div className="flex items-end gap-4 mb-10 border-t border-white/10 pt-6">
                  <span className="font-display text-6xl text-primary">{deal.price}</span>
                  <span className="text-xl text-muted-foreground line-through pb-2 font-bold">{deal.originalPrice} DA</span>
                </div>
                <Button 
                  className="w-full h-16 bg-white text-black hover:bg-black hover:text-white border-2 border-transparent hover:border-white font-display text-2xl uppercase tracking-widest transition-all rounded-none"
                  onClick={() => handleAddToCart({ ...deal, highlight: true }, "/images/burger-v2.png")}
                >
                  Claim Deal
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story / How it works */}
      <section id="story" className="py-32 px-6 md:px-12 bg-background border-t border-white/5 relative">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-display text-[4rem] md:text-[6rem] uppercase text-white">The Process</h2>
            <div className="h-1 w-24 bg-primary mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-white/20 border-t border-dashed" />
            
            {[
              { step: "01", title: "CHOOSE", desc: "Browse the vault. Find your craving. Don't hold back.", Icon: Target },
              { step: "02", title: "UNLOCK", desc: "Secure your order. We prepare it fresh, fast, and flawless.", Icon: LockOpen },
              { step: "03", title: "DEVOUR", desc: "Experience flavor without limits. Repeat as necessary.", Icon: Flame },
            ].map((s, i) => (
              <motion.div 
                key={s.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-32 h-32 rounded-full bg-card border border-white/10 flex items-center justify-center relative z-10 mb-8 group-hover:border-primary group-hover:bg-primary/5 transition-all">
                  <s.Icon className="w-14 h-14 text-primary group-hover:scale-110 transition-transform" strokeWidth={2.2} />
                  <div className="absolute -bottom-5 bg-primary text-white px-4 py-1 font-display text-xl">{s.step}</div>
                </div>
                <h3 className="font-display text-4xl uppercase text-white mb-4">{s.title}</h3>
                <p className="text-muted-foreground text-lg max-w-[280px]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Secret Menu */}
      <section className="py-40 px-6 md:px-12 bg-[#050505] relative overflow-hidden flex items-center justify-center min-h-[80vh] border-y border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        <div className="relative z-10 w-full max-w-[1000px] mx-auto">
          {!isSecretUnlocked ? (
            <motion.div 
              className="text-center bg-black/60 backdrop-blur-xl border border-white/10 p-12 md:p-24 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-32 h-32 mx-auto bg-white/5 flex items-center justify-center mb-10 relative">
                <div className="absolute inset-0 border-2 border-primary/50 animate-pulse" />
                <Lock className="w-16 h-16 text-white" />
              </div>
              <h2 className="font-display text-6xl md:text-[5rem] text-white uppercase mb-6 tracking-tighter leading-none">
                CLASSIFIED <br/><span className="text-primary">VAULT</span>
              </h2>
              <p className="text-muted-foreground text-xl mb-12 max-w-lg mx-auto font-medium">
                Items deemed too intense for the public menu. Proceed with caution.
              </p>
              <div className="relative inline-block">
                <Button 
                  size="lg" 
                  className="h-20 px-12 bg-white text-black hover:bg-secondary font-display text-2xl tracking-widest uppercase transition-all rounded-none"
                  onClick={unlockSecretMenu}
                >
                  Unlock Secret Menu
                </Button>
                <ParticleBurst isActive={showSecretBurst} />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-[#111] border border-primary p-10 md:p-16 rounded-none relative overflow-hidden"
            >
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-16 border-b border-white/10 pb-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary/20 flex items-center justify-center rounded-full">
                    <LockOpen className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-display text-5xl text-white uppercase">Vault Unlocked</h2>
                </div>
                <div className="hidden md:block bg-primary text-white font-bold text-xs tracking-widest px-4 py-2 uppercase">
                  Top Secret
                </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                {SECRET_ITEMS.map((item, i) => (
                  <motion.div 
                    key={item.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 + 0.2 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-black border border-white/5 hover:border-primary/50 transition-colors group"
                  >
                    <div className="flex-1">
                      <h3 className="font-display text-3xl text-white uppercase mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-muted-foreground text-lg">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8 mt-4 md:mt-0">
                      <span className="text-3xl font-display tracking-wider text-secondary">{item.price} DA</span>
                      <Button 
                        className="bg-white text-black hover:bg-primary hover:text-white rounded-none h-14 px-8 font-bold uppercase tracking-wider transition-all"
                        onClick={() => handleAddToCart({ ...item, highlight: true }, "/images/secret.png")}
                      >
                        Add
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Word on the Street */}
      <section className="py-32 px-6 bg-card border-y border-white/5 overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center text-center gap-8">
          <span className="text-xs uppercase tracking-[0.5em] text-primary font-bold">Live Feed</span>
          <h2 className="font-display text-[4rem] md:text-[7rem] uppercase text-white leading-none">Word on the Street</h2>
          <div className="h-1 w-24 bg-primary" />
          <p className="text-white/60 text-lg max-w-xl">
            Suivez l'aventure, les nouveautés et les drops sur Instagram.
          </p>
          <a
            href="https://www.instagram.com/unlock_food07/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black font-display uppercase tracking-widest text-xl px-8 py-4 hover:bg-primary hover:text-white transition-colors"
          >
            <Instagram className="w-6 h-6" />
            @unlock_food07
          </a>
        </div>
      </section>

      {/* Big Closing CTA */}
      <section className="py-40 px-6 bg-primary flex items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto space-y-12">
          <h2 className="font-display text-[6rem] md:text-[9rem] lg:text-[12rem] text-black uppercase leading-[0.8] tracking-tighter drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]">
            READY TO <br /> DEVOUR?
          </h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="h-24 px-16 bg-black text-white hover:bg-white hover:text-black font-display text-3xl tracking-widest uppercase rounded-none shadow-[10px_10px_0px_rgba(255,255,255,0.3)] transition-all group"
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
            >
              Order Now <ArrowRight className="ml-6 w-10 h-10 group-hover:translate-x-4 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background pt-24 pb-12 px-6 md:px-12 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          <div className="md:col-span-5 space-y-8">
            <div className="w-24 h-24 flex items-center justify-center mb-8 drop-shadow-[0_0_28px_rgba(255,46,46,0.5)]">
              <img src={logoUrl} alt="Unlock Food" className="w-full h-full object-contain" />
            </div>
            <p className="text-muted-foreground text-xl max-w-md font-medium">
              Premium fast food redefined. Bold flavors, massive portions, unforgettable experience. Unlocking daily.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/unlock_food07/" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-14 h-14 bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all"><Instagram size={24} /></a>
              <a href="https://www.facebook.com/people/UNLOckfood/61567042610497/" target="_blank" rel="noreferrer" aria-label="Facebook" className="w-14 h-14 bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all"><Facebook size={24} /></a>
              <a href="https://www.tiktok.com/@unlock_food07" target="_blank" rel="noreferrer" aria-label="TikTok" className="w-14 h-14 bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all"><SiTiktok size={24} /></a>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="font-display text-2xl uppercase mb-8 text-white">Hours</h4>
            <ul className="space-y-4 text-muted-foreground font-medium text-base">
              <li className="flex flex-col">
                <span className="text-amber-300 font-bold tracking-wider text-xs uppercase">Sat – Thu</span>
                <span className="text-white text-lg">11:00 — 22:00</span>
              </li>
              <li className="flex flex-col">
                <span className="text-amber-300 font-bold tracking-wider text-xs uppercase">Friday</span>
                <span className="text-white text-lg">16:00 — 22:00</span>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-primary/20 text-primary px-3 py-2 border border-primary/30">
                  <Bike className="w-4 h-4" strokeWidth={2.5} /> Livraison disponible
                </span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-display text-2xl uppercase mb-8 text-white">Contact</h4>
            <ul className="space-y-6 text-muted-foreground font-medium text-lg">
              <li className="flex items-start gap-4">
                <MapPin size={22} className="text-primary flex-shrink-0 mt-1" />
                <span className="leading-snug">Quartier Zmala<br/>Kima Razi 2</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={22} className="text-primary flex-shrink-0" />
                <a href="tel:+213770800569" className="hover:text-white transition-colors">0770 80 05 69</a>
              </li>
              <li className="flex items-center gap-4">
                <Instagram size={22} className="text-primary flex-shrink-0" />
                <a href="https://www.instagram.com/unlock_food07/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">@unlock_food07</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground font-medium">
          <p>© {new Date().getFullYear()} UNLOCK FOOD. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
