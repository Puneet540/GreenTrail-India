import { useState } from "react";
import { MapPin, Mail, Phone, Clock, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message sent!", description: "We'll respond within 24 hours." });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Form */}
          <div className="glass rounded-[32px] p-10 md:p-14 border border-border/30 shadow-sm">
            <h1 className="font-serif text-5xl text-primary mb-2">Connect</h1>
            <p className="text-muted-foreground text-lg mb-10 font-light">
              Reach out to plan your journey or simply say hello. We tread lightly and respond thoughtfully.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  required
                  placeholder="Your Name"
                  className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-3 text-base focus-visible:ring-0 focus-visible:border-primary transition-colors"
                />
              </div>
              <div>
                <Input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-3 text-base focus-visible:ring-0 focus-visible:border-primary transition-colors"
                />
              </div>
              <div>
                <Select>
                  <SelectTrigger className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-3 text-base focus:ring-0 focus:border-primary transition-colors">
                    <SelectValue placeholder="Select Inquiry Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">Retreat Booking</SelectItem>
                    <SelectItem value="custom">Custom Experience</SelectItem>
                    <SelectItem value="group">Group Travel</SelectItem>
                    <SelectItem value="press">Press & Media</SelectItem>
                    <SelectItem value="other">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Textarea
                  required
                  rows={5}
                  placeholder="Your Message"
                  className="bg-transparent border-0 border-b border-border/60 rounded-none px-0 py-3 text-base focus-visible:ring-0 focus-visible:border-primary transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full py-4 text-base disabled:opacity-70"
              >
                {sending ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending...</>
                ) : (
                  <><Send className="w-4 h-4 mr-2" /> Send Message</>
                )}
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Map card */}
            <div className="rounded-[24px] overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1570259476260-75efd20efb31?w=800&q=80"
                alt="Dharamshala"
                className="w-full h-52 object-cover"
              />
              <div className="bg-white/85 backdrop-blur-md p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-serif text-xl text-primary mb-1">Basecamp</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The Old Bakery Building,<br />
                      McLeod Ganj, Dharamshala,<br />
                      Himachal Pradesh 176219
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-2 gap-5">
              <div className="glass rounded-[20px] p-5 border border-border/30">
                <Mail className="w-6 h-6 text-secondary mb-3" />
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Write to us</div>
                <p className="text-sm text-primary font-medium">journey@greentrail.in</p>
              </div>
              <div className="glass rounded-[20px] p-5 border border-border/30">
                <Phone className="w-6 h-6 text-secondary mb-3" />
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Call us</div>
                <p className="text-sm text-primary font-medium">+91 98765 43210</p>
              </div>
            </div>

            {/* Hours */}
            <div className="glass rounded-[20px] p-6 border border-border/30">
              <Clock className="w-5 h-5 text-secondary mb-3" />
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Response Hours (IST)</div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday – Friday</span>
                  <span className="font-semibold text-primary">9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-semibold text-primary">10:00 AM – 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-semibold text-primary">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
