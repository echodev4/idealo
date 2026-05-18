import NewHeader from "@/components/common/new-header";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NewHeader />
      {children}
    </>
  );
}
