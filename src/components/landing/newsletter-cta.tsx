"use client";

export default function NewsletterCTA() {
  return (
    <section className="bg-[#F0F0F0] border-t border-black/10 py-12">
      <div className="container max-w-[1280px] mx-auto flex flex-col items-center justify-center text-center px-3">
        <h2 className="text-[20px] font-bold leading-[1.25] text-[#212121] m-0">
          Receive idealo deals, promotions & news via email.
        </h2>

        <div className="mt-5">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center justify-center h-[40px] px-6 rounded-[4px] border border-[#0474BA] bg-white text-[#0474BA] text-[14px] font-medium cursor-not-allowed hover:no-underline"
          >
            Subscribe to the newsletter
          </a>
        </div>
      </div>
    </section>
  );
}