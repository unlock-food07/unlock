import { motion, AnimatePresence } from "framer-motion";
import { LockOpen, MapPin, Minus, Phone, Plus, ShoppingBag, Store, Trash2, User, X } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

type OrderMode = "delivery" | "pickup";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, total, isOpen, setIsOpen, clearCart } = useCart();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [mode, setMode] = useState<OrderMode>("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; address?: boolean }>({});

  const closeAll = () => {
    setIsOpen(false);
    setTimeout(() => setStep("cart"), 300);
  };

  const buildMessage = (m: OrderMode, n: string, p: string, a: string) => {
    const lines = items.map(
      (it) => `• ${it.name} x${it.quantity} — ${it.price * it.quantity} DA`,
    );
    return (
      `*UNLOCK FOOD — Nouvelle Commande*\n\n` +
      `${lines.join("\n")}\n\n` +
      `*Total: ${total} DA*\n\n` +
      `*Mode:* ${m === "delivery" ? "Livraison" : "À emporter (Sur place)"}\n` +
      `*Nom:* ${n}\n` +
      `*Téléphone:* ${p}\n` +
      (m === "delivery" ? `*Adresse:* ${a}\n` : `*Retrait:* Quartier Zmala Kima Razi 2\n`)
    );
  };

  const handleQuickWhatsApp = () => {
    const message = buildMessage("delivery", "", "", "");
    const url = `https://wa.me/213770800569?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = true;
    if (!phone.trim()) newErrors.phone = true;
    if (mode === "delivery" && !address.trim()) newErrors.address = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const message = buildMessage(mode, name.trim(), phone.trim(), address.trim());
    const url = `https://wa.me/213770800569?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
    setName("");
    setPhone("");
    setAddress("");
    closeAll();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAll}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 bg-card border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {step === "cart" ? <ShoppingBag size={20} /> : <LockOpen size={20} />}
                </div>
                <h2 className="text-2xl font-display uppercase tracking-wider">
                  {step === "cart" ? "Your Vault" : "Checkout"}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={closeAll} className="rounded-full hover:bg-white/5">
                <X size={24} />
              </Button>
            </div>

            {step === "cart" && (
              <ScrollArea className="flex-1 p-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-20">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                      <LockOpen size={48} strokeWidth={1} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-display text-white">Your vault is empty</h3>
                      <p className="text-muted-foreground">Unlock some flavor and add it here.</p>
                    </div>
                    <Button onClick={closeAll} className="bg-primary text-white hover:bg-primary/90 font-bold uppercase tracking-wider">
                      Browse Menu
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <motion.div layout key={item.id} className="flex gap-4 group">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-card border border-white/5 flex-shrink-0 relative">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <ShoppingBag size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-white uppercase leading-tight line-clamp-2">{item.name}</h4>
                              <p className="text-primary font-bold mt-1">{item.price} DA</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-card border border-white/10 rounded-full h-8">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-full flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-full flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            )}

            {step === "checkout" && (
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                      Mode de commande
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setMode("delivery")}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          mode === "delivery"
                            ? "border-primary bg-primary/10 text-white"
                            : "border-white/10 bg-card text-muted-foreground hover:border-white/20"
                        }`}
                      >
                        <MapPin size={22} />
                        <span className="font-bold uppercase text-sm tracking-wider">Livraison</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("pickup")}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          mode === "pickup"
                            ? "border-primary bg-primary/10 text-white"
                            : "border-white/10 bg-card text-muted-foreground hover:border-white/20"
                        }`}
                      >
                        <Store size={22} />
                        <span className="font-bold uppercase text-sm tracking-wider">Sur place</span>
                      </button>
                    </div>
                    {mode === "pickup" && (
                      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                        Retrait à : <span className="text-amber-400 font-bold">Quartier Zmala Kima Razi 2</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                      Nom complet
                    </label>
                    <div className={`flex items-center gap-3 bg-card border-2 rounded-xl px-4 h-12 transition-colors ${errors.name ? "border-destructive" : "border-white/10 focus-within:border-primary"}`}>
                      <User size={18} className="text-muted-foreground" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Votre nom"
                        className="flex-1 bg-transparent outline-none text-white placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                      Téléphone
                    </label>
                    <div className={`flex items-center gap-3 bg-card border-2 rounded-xl px-4 h-12 transition-colors ${errors.phone ? "border-destructive" : "border-white/10 focus-within:border-primary"}`}>
                      <Phone size={18} className="text-muted-foreground" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07XX XX XX XX"
                        className="flex-1 bg-transparent outline-none text-white placeholder:text-muted-foreground/50"
                      />
                    </div>
                  </div>

                  {mode === "delivery" && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                        Adresse de livraison
                      </label>
                      <div className={`flex items-start gap-3 bg-card border-2 rounded-xl px-4 py-3 transition-colors ${errors.address ? "border-destructive" : "border-white/10 focus-within:border-primary"}`}>
                        <MapPin size={18} className="text-muted-foreground mt-1" />
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Rue, quartier, repère..."
                          rows={3}
                          className="flex-1 bg-transparent outline-none text-white placeholder:text-muted-foreground/50 resize-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-card border border-white/10 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold uppercase text-sm tracking-wider text-white mb-2">Récap</h4>
                    {items.map((it) => (
                      <div key={it.id} className="flex justify-between text-sm text-muted-foreground">
                        <span className="truncate pr-2">{it.name} x{it.quantity}</span>
                        <span className="text-white font-bold whitespace-nowrap">{it.price * it.quantity} DA</span>
                      </div>
                    ))}
                    <Separator className="bg-white/10 my-2" />
                    <div className="flex justify-between font-display text-lg">
                      <span className="text-white">Sous-total</span>
                      <span className="text-primary">
                        {total} DA{mode === "delivery" && <span className="text-amber-400"> + LIVRAISON</span>}
                      </span>
                    </div>
                    {mode === "delivery" && (
                      <p className="text-[11px] text-muted-foreground/80 leading-relaxed pt-1">
                        Le prix de la livraison varie selon votre adresse. Il sera confirmé par le livreur sur WhatsApp.
                      </p>
                    )}
                  </div>
                </div>
              </ScrollArea>
            )}

            {items.length > 0 && step === "cart" && (
              <div className="p-6 bg-card border-t border-border mt-auto">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{total} DA</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <Separator className="bg-white/10 my-2" />
                  <div className="flex justify-between text-white font-display text-2xl uppercase">
                    <span>Total</span>
                    <span className="text-primary">{total} DA</span>
                  </div>
                </div>
                <Button
                  onClick={() => setStep("checkout")}
                  className="w-full h-14 text-lg font-display uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] transition-all"
                >
                  Checkout Now <LockOpen className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  onClick={handleQuickWhatsApp}
                  className="w-full h-14 mt-3 text-lg font-display uppercase tracking-widest bg-[#25D366] hover:bg-[#1ebe5a] text-white shadow-[0_0_20px_rgba(37,211,102,0.35)] hover:shadow-[0_0_35px_rgba(37,211,102,0.6)] transition-all"
                >
                  <SiWhatsapp className="mr-2 w-5 h-5" />
                  Order on WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={closeAll}
                  className="w-full h-12 mt-3 text-sm font-display uppercase tracking-widest bg-transparent border-white/20 text-white hover:bg-white/5 hover:border-white/40 hover:text-white transition-all"
                >
                  Continue Shopping
                </Button>
              </div>
            )}

            {step === "checkout" && (
              <div className="p-6 bg-card border-t border-border mt-auto">
                <Button
                  onClick={handleSubmit}
                  className="w-full h-14 text-lg font-display uppercase tracking-widest bg-[#25D366] hover:bg-[#1ebe5a] text-white shadow-[0_0_20px_rgba(37,211,102,0.35)] hover:shadow-[0_0_35px_rgba(37,211,102,0.6)] transition-all"
                >
                  <SiWhatsapp className="mr-2 w-5 h-5" />
                  Confirmer ({total} DA)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep("cart")}
                  className="w-full h-12 mt-3 text-sm font-display uppercase tracking-widest bg-transparent border-white/20 text-white hover:bg-white/5 hover:border-white/40 hover:text-white transition-all"
                >
                  Retour au panier
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
