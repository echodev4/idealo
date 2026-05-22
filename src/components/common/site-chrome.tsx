import NewHeader from "@/components/common/new-header";
import Footer from "@/components/common/footer";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NewHeader />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
