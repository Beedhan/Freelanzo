import React from "react";

const Stats = () => {
  const stats = [
    {
      data: "35K",
      title: "Users",
    },
    {
      data: "10K+",
      title: "Downloads",
    },
    {
      data: "40+",
      title: "Countries",
    },
    {
      data: "30M+",
      title: "Total revenue",
    },
  ];
  return (
    <>
      <section className="bg-gray-700 py-28">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-3xl font-semibold text-white sm:text-4xl">
              Elevate your freelancing game – try Freelanzo today!
            </h3>
            <p className="mt-3 text-gray-300">
              Stay organized, boost productivity, and focus on what you do best.
            </p>
          </div>
          <div className="mt-12">
            <ul className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {stats.map((item, idx) => (
                <li
                  key={idx}
                  className="w-full rounded-lg bg-gray-800 px-12 py-4 text-center sm:w-auto"
                >
                  <h4 className="text-4xl font-semibold text-white">
                    {item.data}
                  </h4>
                  <p className="mt-3 font-medium text-gray-400">{item.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Stats;
