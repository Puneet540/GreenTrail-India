import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { ArrowLeft, ShieldCheck, Leaf, CreditCard, Smartphone, Building2, Lock } from "lucide-react";
import { useGetStay } from "@/lib/mockHooks";
import { useToast } from "@/hooks/use-toast";

const PAYMENT_METHODS = [
  { id:"card",     label:"Card",        icon:CreditCard },
  { id:"upi",      label:"UPI",         icon:Smartphone },
  { id:"netbank",  label:"Net Banking", icon:Building2 },
];

export default function CheckoutPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const search = useSearch();

const params = new URLSearchParams(search);

const stayId = Number(params.get("stayId") || 1);

const { data: stay } = useGetStay(stayId);
  const [step, setStep]           = useState<1|2|3>(1);
  const [payMethod, setPayMethod] = useState("card");
  const [form, setForm] = useState({
    firstName:"", lastName:"", email:"", phone:"",
    checkin:"", checkout:"", guests:"2",
    cardNum:"", expiry:"", cvv:"", cardName:"",
    upi:"",
  });
  const [processing, setProcessing] = useState(false);

  const nights = form.checkin && form.checkout
    ? Math.max(1, Math.round((new Date(form.checkout).getTime()-new Date(form.checkin).getTime())/(1000*60*60*24)))
    : 4;
  const basePrice  = (stay?.pricePerNight||4500) * nights;
  const ecoFee     = 400;
  const taxes      = Math.round(basePrice*0.05);
  const total      = basePrice+ecoFee+taxes;

  const handlePay = () => {
    if (step<3) { setStep(s=>Math.min(s+1,3) as 1|2|3); return; }
    if (!form.email) { toast({title:"Please fill all required fields",variant:"destructive"}); return; }
    setProcessing(true);
    setTimeout(()=>{ setProcessing(false);setLocation(`/booking-confirmed?stayId=${stayId}&total=${total}&guests=${form.guests}&checkin=${form.checkin}&checkout=${form.checkout}`); }, 1200);
  };

  const STEP_LABELS = ["Guest Details","Stay Dates","Payment"];

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-16">
      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 w-full z-50 px-5 pt-4 pb-3 flex items-center gap-3"
        style={{background:"rgba(255,255,255,0.88)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(194,201,187,0.35)"}}>
        <button onClick={()=>step>1?setStep(s=>Math.max(s-1,1) as 1|2|3):window.history.back()}>
          <ArrowLeft className="w-5 h-5 text-primary"/>
        </button>
        <span className="font-serif text-xl text-primary">Checkout</span>
      </header>

      <div className="hidden md:block pt-28 pb-8 px-6 max-w-5xl mx-auto">
        <button onClick={()=>window.history.back()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4"/> Back
        </button>
        <h1 className="font-serif text-4xl text-primary">Secure Your Retreat</h1>
      </div>

      {/* Progress steps */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mt-20 md:mt-0 mb-6">
        <div className="flex items-center justify-center gap-0">
          {STEP_LABELS.map((label,i)=>{
            const stepNum = (i+1) as 1|2|3;
            const active  = step===stepNum;
            const done    = step>stepNum;
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    done?"bg-primary border-primary text-white":active?"border-primary text-primary bg-white":"border-border/50 text-muted-foreground bg-white"
                  }`}>
                    {done?"✓":stepNum}
                  </div>
                  <span className={`text-xs font-semibold mt-1 ${active?"text-primary":"text-muted-foreground"}`}>{label}</span>
                </div>
                {i<2 && <div className={`w-16 md:w-24 h-0.5 mx-2 mb-5 transition-colors ${done?"bg-primary":"bg-border/40"}`}/>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

        {/* Form */}
        <div className="lg:col-span-7">

          {/* Step 1: Guest details */}
          {step===1 && (
            <div className="glass rounded-[24px] p-6 md:p-8 border border-border/30 shadow-sm">
              <h2 className="font-serif text-2xl text-primary mb-6">Guest Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">First Name *</label>
                  <input value={form.firstName} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))}
                    placeholder="Arjun" className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Last Name *</label>
                  <input value={form.lastName} onChange={e=>setForm(f=>({...f,lastName:e.target.value}))}
                    placeholder="Mehta" className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Email Address *</label>
                  <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                    placeholder="arjun@example.com" className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Phone</label>
                  <input type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
                    placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Guests</label>
                  <select value={form.guests} onChange={e=>setForm(f=>({...f,guests:e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none appearance-none">
                    {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} Guest{n>1?"s":""}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Stay dates */}
          {step===2 && (
            <div className="glass rounded-[24px] p-6 md:p-8 border border-border/30 shadow-sm">
              <h2 className="font-serif text-2xl text-primary mb-6">Stay Dates</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Check-in</label>
                  <input type="date" value={form.checkin} onChange={e=>setForm(f=>({...f,checkin:e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Check-out</label>
                  <input type="date" value={form.checkout} onChange={e=>setForm(f=>({...f,checkout:e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                </div>
              </div>
              <div className="mt-5 p-4 bg-surface-container/50 rounded-2xl text-sm text-muted-foreground">
                <span className="material-symbols-outlined text-sm align-middle mr-1 text-secondary">info</span>
                Check-in from 2:00 PM · Check-out by 11:00 AM · Free cancellation up to 48 hours before arrival
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step===3 && (
            <div className="glass rounded-[24px] p-6 md:p-8 border border-border/30 shadow-sm">
              <h2 className="font-serif text-2xl text-primary mb-6">Payment</h2>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {PAYMENT_METHODS.map(pm=>(
                  <button key={pm.id} onClick={()=>setPayMethod(pm.id)}
                    className={`rounded-2xl p-3 border-2 flex flex-col items-center gap-1.5 transition-all ${payMethod===pm.id?"border-primary bg-primary/5":"border-border/40 hover:border-primary/30"}`}>
                    <pm.icon className="w-5 h-5 text-primary"/>
                    <span className="text-xs font-semibold text-primary">{pm.label}</span>
                  </button>
                ))}
              </div>
              {payMethod==="card" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Card Number</label>
                    <input value={form.cardNum} onChange={e=>setForm(f=>({...f,cardNum:e.target.value}))}
                      placeholder="4111 1111 1111 1111" maxLength={19}
                      className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Name on Card</label>
                    <input value={form.cardName} onChange={e=>setForm(f=>({...f,cardName:e.target.value}))}
                      placeholder="ARJUN MEHTA"
                      className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Expiry</label>
                      <input value={form.expiry} onChange={e=>setForm(f=>({...f,expiry:e.target.value}))}
                        placeholder="MM/YY" maxLength={5}
                        className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">CVV</label>
                      <input value={form.cvv} onChange={e=>setForm(f=>({...f,cvv:e.target.value}))}
                        placeholder="•••" maxLength={4} type="password"
                        className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                    </div>
                  </div>
                </div>
              )}
              {payMethod==="upi" && (
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">UPI ID</label>
                  <input value={form.upi} onChange={e=>setForm(f=>({...f,upi:e.target.value}))}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none focus:border-primary/50"/>
                  <p className="text-xs text-muted-foreground mt-2">Accepted: GPay, PhonePe, Paytm, BHIM, Amazon Pay</p>
                </div>
              )}
              {payMethod==="netbank" && (
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Select Bank</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white/60 border border-border/50 text-sm focus:outline-none appearance-none">
                    <option>SBI — State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                    <option>Other Banks</option>
                  </select>
                </div>
              )}
              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5 text-green-600"/>
                <span>256-bit SSL encryption · PCI DSS compliant · Your card details are never stored</span>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-5">
          <div className="glass rounded-[24px] p-6 md:p-7 border border-border/30 shadow-sm sticky top-24 space-y-5">
            {/* Stay image */}
            <div className="rounded-2xl overflow-hidden h-44">
              <img src={stay?.imageUrl||"https://images.unsplash.com/photo-1542314831-c6a4d14272ce?w=600&q=80"} alt="Stay" className="w-full h-full object-cover"/>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Leaf className="w-3.5 h-3.5 text-green-600 fill-green-600"/>
                <span className="text-xs font-bold text-green-700">{stay?.ecoRating||4.8}/5 Eco Rating</span>
              </div>
              <h3 className="font-serif text-xl text-primary">{stay?.name||"The Pine Whispers Sanctuary"}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stay?.destinationName||"Jibhi"}, {stay?.state||"Himachal Pradesh"}</p>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">₹{(stay?.pricePerNight||4500).toLocaleString()} × {nights} nights</span><span className="font-semibold">₹{basePrice.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">🌱 Nature conservancy fee</span><span className="font-semibold">₹{ecoFee}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Taxes & GST (5%)</span><span className="font-semibold">₹{taxes.toLocaleString()}</span></div>
              <div className="flex justify-between pt-3 border-t border-border/30 font-bold text-base">
                <span>Total</span><span className="font-serif text-2xl text-primary">₹{total.toLocaleString()}</span>
              </div>
            </div>
            {/* Desktop CTA */}
            <div className="hidden md:block">
              <button onClick={handlePay} disabled={processing}
                className="w-full py-4 rounded-full text-white font-semibold text-base transition-all hover:scale-[1.02] disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg"
                style={{background:"linear-gradient(to bottom, #386934, #154212)"}}>
                {processing ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Processing…</>
                ) : step<3 ? (
                  <>Continue to {STEP_LABELS[step]}</>
                ) : (
                  <><ShieldCheck className="w-4 h-4"/>Confirm &amp; Pay ₹{total.toLocaleString()}</>
                )}
              </button>
              <p className="text-xs text-muted-foreground text-center mt-2">Free cancellation · 48h before check-in</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-16 left-0 w-full px-4 py-3 z-40 border-t border-border/30"
        style={{background:"rgba(255,255,255,0.95)",backdropFilter:"blur(16px)"}}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-serif text-xl text-primary font-semibold">₹{total.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">Total payable</span>
        </div>
        <button onClick={handlePay} disabled={processing}
          className="w-full py-4 rounded-full text-white font-semibold text-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          style={{background:"linear-gradient(to bottom, #386934, #154212)"}}>
          {processing ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Processing…</>
          ) : step<3 ? `Continue → ${STEP_LABELS[step]}` : <>Pay ₹{total.toLocaleString()} Securely</>}
        </button>
      </div>
    </div>
  );
}
