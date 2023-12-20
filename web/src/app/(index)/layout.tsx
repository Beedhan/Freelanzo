import Navbar from "~/components/Navbar";
import { getSession } from "~/utils/session";

interface HomeLayoutProps {
  children: React.ReactNode;
}
export default  function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div className=" w-full  py-2">
      <div className="shadow-md">
        <Navbar />
      </div>
      {children}
    </div>
  );
}
