import NewHeader from "@/components/common/new-header";
import Footer from "@/components/common/footer";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NewHeader />
      {children}
      <Footer />
    </>
  );
}
