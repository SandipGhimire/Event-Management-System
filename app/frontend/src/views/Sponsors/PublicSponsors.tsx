import { useEffect, useState } from "react";
import api from "@/core/app/api";
import endpoints from "@/core/app/endpoints";
import { getBackendFile } from "@/core/utils/common.utils";
import type { SponsorDetail } from "shared-types";
import { ExternalLink, Globe, LayoutGrid, Loader2 } from "lucide-react";
import Modal from "@/components/common/Modal";
import Footer from "@/layout/components/Footer";

export default function PublicSponsors() {
  const [sponsors, setSponsors] = useState<SponsorDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState<SponsorDetail | null>(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await api.get(endpoints.sponsor.publicList);
        if (response.data.success) {
          setSponsors(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch sponsors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading our amazing sponsors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Hero Section */}
      <section className="py-4 flex flex-col items-center text-center justify-center border-b bg-white">
        <div className="text-2xl md:text-4xl font-bold text-primary">Sponsor List</div>
        <div className="text-secondary mt-2 text-md">
          Meet our sponsors who made this event possible.
          <br />
          <span className="text-primary text-xs">(Click on any sponsor to view their links)</span>
        </div>
      </section>

      {/* Sponsors Grid */}
      <section className="pt-4 md:pt-8 container mx-auto px-4 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sponsors.length > 0 ? (
            sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                onClick={() => setSelectedSponsor(sponsor)}
                className="group relative items-center border rounded-sm text-center bg-white cursor-pointer"
              >
                {/* Sponsor Logo Container */}
                <div className="relative mb-4 px-4 pt-4 md:px-4 md:pt-4 flex justify-center">
                  {sponsor.logo ? (
                    <img
                      src={getBackendFile(sponsor.logo)}
                      alt={sponsor.name}
                      className="w-full h-full object-contain filte border rounded-sm"
                    />
                  ) : (
                    <div className="w-full h-full object-contain filte border rounded-sm flex justify-center p-10">
                      <LayoutGrid size={40} />
                    </div>
                  )}
                </div>

                {/* Sponsor Info */}
                <div className="flex-1 w-full">
                  <h3 className="text-3xl font-bold mb-3 group-hover:text-primary transition-colors">{sponsor.name}</h3>
                </div>

                {/* Interactive Footer */}
                <div className="p-4 mt-auto w-full border-t flex items-center justify-center gap-2 text-lg font-semibold text-primary/80 group-hover:text-primary">
                  <span>View Links</span>
                  <ExternalLink size={18} className="transition-transform group-hover:translate-x-1" />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-ping" />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl">
              <div className="mb-4 text-muted-foreground">
                <LayoutGrid size={48} className="mx-auto opacity-20" />
              </div>
              <p className="text-xl font-semibold opacity-50">Stay tuned! Sponsors are being announced soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Sponsor Links Modal */}
      <Modal
        isOpen={!!selectedSponsor}
        onClose={() => setSelectedSponsor(null)}
        title={selectedSponsor ? `${selectedSponsor.name}'s Links` : "Sponsor Details"}
        size="md"
      >
        <div className="">
          {selectedSponsor?.links && selectedSponsor.links.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Explore these links to learn more about our sponsor, {selectedSponsor.name}.
              </p>
              <div className="grid gap-3">
                {selectedSponsor.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Globe size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {link.label}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-xs">{link.url}</p>
                    </div>
                    <ExternalLink
                      size={18}
                      className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                    />
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <LayoutGrid size={32} className="text-muted-foreground" />
                </div>
              </div>
              <p className="font-medium text-muted-foreground">No links available for this sponsor.</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Footer Decoration */}
      <Footer />

      {/* Custom Styles for extra polish */}
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
