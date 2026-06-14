import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ArrowRight } from "lucide-react";

const FAQ_ITEMS = [
  {
    category: "Booking & Stays",
    items: [
      {
        q: "How does GreenTrail ensure the eco-credentials of partner retreats?",
        a: "Every retreat on GreenTrail undergoes a rigorous 50-point verification covering energy sources, waste management, local employment, water conservation, and wildlife impact. We conduct annual on-site audits, and our eco-rating reflects real, verified data — not self-reported claims."
      },
      {
        q: "What is your cancellation policy?",
        a: "Most retreats offer free cancellation up to 48 hours before check-in. Individual properties may have different policies, which are clearly displayed on each listing. We always show the most flexible options first and never hide fees at checkout."
      },
      {
        q: "Do you offer group travel planning?",
        a: "Yes. For groups of 6 or more, we offer personalized consultation to design custom itineraries, arrange group accommodations, and coordinate local experiences. Contact us at journey@greentrail.in."
      },
      {
        q: "Can I modify my booking after confirmation?",
        a: "Date modifications are free up to 7 days before check-in, subject to availability. Modifications within 7 days may be subject to a small rebooking fee. Contact the property directly through our messaging platform."
      },
    ]
  },
  {
    category: "AI Planner",
    items: [
      {
        q: "Can I customize an AI-generated itinerary?",
        a: "Absolutely. After our AI crafts your initial trail, you have full freedom to add, remove, or swap destinations, stays, and experiences. Think of it as a curated starting point that you tailor to your exact rhythm."
      },
      {
        q: "How accurate is the AI Planner for off-season travel?",
        a: "The AI Planner factors in real-time seasonal data for each destination, including weather windows, road accessibility, and retreat availability. It will flag any destination that may be inaccessible during your chosen travel period."
      },
    ]
  },
  {
    category: "Community & Stories",
    items: [
      {
        q: "How do I write and share a travel story?",
        a: "Once signed in, navigate to the Journal section and click 'Share Your Story'. You can write about any destination you've visited, add photos, and publish for the entire GreenTrail community to discover."
      },
      {
        q: "Are user stories moderated?",
        a: "Yes. All stories go through a brief editorial review to ensure they meet our community standards — authentic, respectful, and ecologically conscious. We don't edit your voice, only screen for policy compliance."
      },
    ]
  },
  {
    category: "Payments & Security",
    items: [
      {
        q: "Are payments secure on GreenTrail?",
        a: "Yes. All transactions are processed through PCI DSS-compliant payment gateways with 256-bit SSL encryption. We never store card details on our servers. You can also pay via UPI, net banking, or wallets."
      },
      {
        q: "What currency does GreenTrail use?",
        a: "All prices are displayed and charged in Indian Rupees (₹). International cards are accepted with no additional conversion fee on our end, though your bank may apply standard international transaction charges."
      },
    ]
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/50 last:border-none">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-serif text-lg text-primary">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[400px] pb-5" : "max-h-0"}`}>
        <p className="text-muted-foreground leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80"
          alt="Forest"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-background" />
        <div className="relative z-10 text-center pt-16">
          <h1 className="font-serif text-5xl md:text-6xl text-white drop-shadow-lg mb-3">Common Trails</h1>
          <p className="text-white/80 text-lg">Frequently asked questions</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-16">
        {FAQ_ITEMS.map((section) => (
          <div key={section.category} className="mb-14">
            <h2 className="font-serif text-2xl text-primary mb-6 pb-3 border-b border-border">
              {section.category}
            </h2>
            <div className="glass rounded-[24px] px-6 divide-y divide-border/30 border border-border/30">
              {section.items.map((item) => (
                <AccordionItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}

        <div className="glass rounded-[32px] p-10 text-center border border-border/30 mt-8">
          <h3 className="font-serif text-2xl text-primary mb-3">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Our team of nature enthusiasts are always happy to help.
          </p>
          <Link href="/contact">
            <button className="btn-primary px-8 py-3 inline-flex items-center gap-2">
              Contact Us <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
