import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/shared/ContactForm";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Sparenza & Co. — visit our Surat boutique, call, email or message us on WhatsApp for a personal jewellery consultation.",
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent(siteConfig.contact.address);
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const waLink = `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`;

  return (
    <div className="container-luxury py-16 md:py-24">
      {/* Header */}
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
          We&apos;d Love to Hear From You
        </p>
        <h1 className="font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Get in <em className="italic text-primary">touch</em>
        </h1>
        <p className="mt-6 font-light leading-relaxed text-muted-foreground">
          Visit our boutique, call us, or send a message on WhatsApp — our team is
          happy to help you find the perfect piece or answer any question.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left — Details */}
        <div className="space-y-6">
          <div className="rounded-[2px] border border-border p-6">
            <MapPin size={22} className="mb-4 text-gold" />
            <h2 className="mb-2 font-heading text-xl text-foreground">Visit Us</h2>
            <p className="text-sm font-light leading-relaxed text-muted-foreground">
              {siteConfig.contact.address}
            </p>
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-gold hover-underline"
            >
              Open in Google Maps →
            </a>
          </div>

          <div className="rounded-[2px] border border-border p-6">
            <Phone size={22} className="mb-4 text-gold" />
            <h2 className="mb-3 font-heading text-xl text-foreground">Call Us</h2>
            <div className="space-y-2">
              {siteConfig.contact.phones.map((num) => (
                <a
                  key={num}
                  href={`tel:${num.replace(/\s+/g, "")}`}
                  className="block text-sm font-light text-muted-foreground transition-colors hover:text-gold"
                >
                  {num}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-[2px] border border-border p-6">
              <Mail size={22} className="mb-4 text-gold" />
              <h2 className="mb-2 font-heading text-lg text-foreground">Email</h2>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-sm font-light text-muted-foreground transition-colors hover:text-gold break-all"
              >
                {siteConfig.contact.email}
              </a>
            </div>
            <div className="rounded-[2px] border border-border p-6">
              <Clock size={22} className="mb-4 text-gold" />
              <h2 className="mb-2 font-heading text-lg text-foreground">Hours</h2>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">
                Mon – Sat<br />10 AM – 8 PM
              </p>
            </div>
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-medium text-onyx transition-all duration-300 hover:bg-gold-light hover:shadow-gold"
          >
            <MessageCircle size={16} />
            Chat with us on WhatsApp
          </a>
        </div>

        {/* Right — Enquiry form */}
        <ContactForm />
      </div>

      {/* Map — full width */}
      <div className="mt-8 min-h-[380px] overflow-hidden rounded-[2px] border border-border">
        <iframe
          title="Sparenza & Co. boutique location"
          src={mapSrc}
          className="h-full min-h-[380px] w-full"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
