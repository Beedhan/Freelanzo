import { type NextPage } from "next";
import Image from "next/image";
import Footer from "~/components/Footer";
import LogoCloud from "~/components/LogoCloud";
import Stats from "~/components/Stats";

const Home: NextPage = () => {
  return (
    <>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 py-16 lg:flex  lg:items-center">
          <div className="mx-auto max-w-xl text-center">
            <h3 className="font-semibold md:text-lg lg:text-xl ">
              Project Management Tool for Freelancer
            </h3>
            <h1 className="text-3xl font-extrabold sm:text-5xl">
              Everything you do with,
              <strong className="font-extrabold text-[#004aad] sm:block">
                clients now in one place.
              </strong>
            </h1>

            <p className="mt-4 sm:text-xl/relaxed">
              Freelanzo is the smarter, easier, more efficient way <br />
              to manage client projects.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                className="block w-full rounded bg-[#004aad] px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                href="/"
              >
                Get Started
              </a>

              <a
                className="block w-full rounded px-12 py-3 text-sm font-medium text-[#004aad] shadow hover:text-[#004aad] focus:outline-none focus:ring active:text-[#004aad] sm:w-auto"
                href="/about"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
      <LogoCloud />
      <section>
        <h2 className=" text-center text-3xl font-extrabold sm:text-5xl">
          Our Features
        </h2>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
              <img
                src="/assets/Kanban.png"
                className="absolute inset-0 h-full w-full  object-cover"
              />
            </div>

            <div className="lg:py-24">
              <h2 className="mb-3 text-lg font-bold underline sm:text-xl">
                Boards{" "}
              </h2>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Kanban Boards for every workflow
              </h2>

              <p className="mt-4 text-gray-600">
                Visualize your workflow, from leads to completed tasks, with
                easy drag-and-drop functionality. Boost productivity and focus
                on what matters most – delivering exceptional work. Try our
                Kanban Boards in CRM today and take control of your freelance
                business.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-first  lg:h-full">
              <img
                src="/assets/Files.png"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="lg:py-24">
              <h2 className="mb-3 text-lg font-bold underline sm:text-xl">
                Files{" "}
              </h2>

              <h2 className="text-3xl font-bold sm:text-4xl">
                Arrange & Organize Everything
              </h2>

              <p className="mt-4 text-gray-600">
                Upload and download files with ease, keeping all your important
                documents and assets in one secure place. Collaborate
                efficiently, share files with clients, and streamline your
                workflow. Try our CRM's file management feature and take your
                freelance business to the next level.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
              <img
                src="/assets/Chat.png"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="lg:py-24">
              <h2 className="mb-3 text-lg font-bold underline sm:text-xl">
                Chat{" "}
              </h2>

              <h2 className="text-3xl font-bold sm:text-4xl">
                Keep all conversations clean
              </h2>

              <p className="mt-4 text-gray-600">
                Stay connected and collaborate effortlessly with our CRM's
                integrated chat system for freelancers. Communicate with
                clients, team members, and collaborators in real-time, ensuring
                nothing falls through the cracks. Seamlessly discuss projects,
                share updates, and clarify details all within your CRM. Elevate
                your freelancing game with efficient communication.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-first  lg:h-full">
              <img
                src="/assets/Invoices.png"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="lg:py-24">
              <h2 className="mb-3 text-lg font-bold underline sm:text-xl">
                Invoicing and payments
              </h2>

              <h2 className="text-3xl font-bold sm:text-4xl">
                Invoices made easy
              </h2>

              <p className="mt-4 text-gray-600">
                Create and send professional invoices in minutes, keeping your
                cash flow steady. Track payments, set reminders, and stay on top
                of your earnings effortlessly. Elevate your freelancing business
                with our CRM's invoicing feature.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Stats />

      <div className="mt-4 px-20">
        <Footer />
      </div>
    </>
  );
};

export default Home;
