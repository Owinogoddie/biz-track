// components/SchoolsMarquee.tsx
const schools = [
    {
      name: "Harvard University",
      logo: "/logos/harvard.png",
    },
    {
      name: "Stanford University",
      logo: "/logos/stanford.png",
    },
    {
      name: "MIT",
      logo: "/logos/mit.png",
    },
    // Add more schools...
  ];
  
  export default function SchoolsMarquee() {
    return (
      <div className="py-12 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-xl text-gray-600 dark:text-gray-400 mb-8">
            Trusted by leading institutions worldwide
          </h3>
          
          <div className="flex overflow-hidden">
            <div className="flex space-x-16 animate-marquee-slow">
              {schools.map((school, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center w-[150px] h-[80px] grayscale hover:grayscale-0 transition-all"
                >
                  <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
              ))}
            </div>
            <div className="flex space-x-16 animate-marquee-slow" aria-hidden="true">
              {schools.map((school, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center w-[150px] h-[80px] grayscale hover:grayscale-0 transition-all"
                >
                  <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }