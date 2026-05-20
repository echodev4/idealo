import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-46px)] max-w-[720px] flex-col items-center justify-center px-4 py-16 text-center text-[#06163a]">
      <h1 className="text-[32px] font-bold leading-tight sm:text-[40px]">Page not found</h1>
      <p className="mt-3 text-[16px] leading-6 text-[#526175]">
        The page you are looking for is not available.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[6px] bg-[#ff6600] px-5 text-[15px] font-bold text-white hover:bg-[#ea5f00]"
      >
        Back to homepage
      </Link>
    </main>
  );
}
