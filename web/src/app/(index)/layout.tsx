"use client"
import Footer from "~/components/Footer";
import Navbar from "~/components/Navbar";

interface HomeLayoutProps {
  children: React.ReactNode;
}
export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className="w-full py-2">
      <div className="shadow-md">
        <Navbar />
      </div>
      {children}
      <div className="mt-4 px-20">
        <Footer />
      </div>
    </div>
  );
}
