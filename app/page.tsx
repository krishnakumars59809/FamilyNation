// "use client";
// import Link from "next/link";

// export default function HomePage() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Header */}
//       <header className="sticky top-0 z-50 bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
//           <h1 className="text-xl font-bold text-gray-800">FamilyNation</h1>
//           <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
//             <Link href="#about">About</Link>
//             <Link href="#solutions">Solutions</Link>
//             <Link href="#community">Community</Link>
//             <Link href="#resources">Resources</Link>
//             <Link href="#events">Events</Link>
//             <Link href="#contact">Contact</Link>
//           </nav>
//           {/* Exit button */}
//           <button className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded-lg shadow hover:bg-red-700">
//             EXIT
//           </button>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-blue-50 to-white">
//         <h2 className="text-4xl font-bold text-gray-800 mb-4">
//           Supporting Families in Crisis
//         </h2>
//         <p className="text-lg text-gray-600 max-w-2xl mb-6">
//           FamilyNation connects parents and caregivers to trusted resources,
//           professionals, and communities to overcome challenges like substance
//           use, bullying, learning difficulties, and family conflict.
//         </p>
//     <Link href="/chat">
//   <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700">
//     We Need Help Now!
//   </button>
// </Link>
//       </section>

//       {/* Solutions / Features */}
//       <section id="solutions" className="py-16 bg-gray-100">
//         <div className="max-w-6xl mx-auto px-6">
//           <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
//             What FamilyNation Offers
//           </h3>
//           <div className="grid md:grid-cols-3 gap-6">
//             <div className="p-6 bg-white rounded-xl shadow">
//               <h4 className="text-lg font-semibold mb-2 text-gray-800">
//                 Private Network of Resources
//               </h4>
//               <p className="text-gray-600 text-sm">
//                 Professionally curated, trusted resources tailored to your
//                 family’s circumstances—like substance use, learning challenges,
//                 and conflict resolution.
//               </p>
//             </div>
//             <div className="p-6 bg-white rounded-xl shadow">
//               <h4 className="text-lg font-semibold mb-2 text-gray-800">
//                 AI-Driven Guidance
//               </h4>
//               <p className="text-gray-600 text-sm">
//                 Get smart recommendations and referrals to professionals—mental
//                 health, education, and family support—powered by technology and
//                 expert input.
//               </p>
//             </div>
//             <div className="p-6 bg-white rounded-xl shadow">
//               <h4 className="text-lg font-semibold mb-2 text-gray-800">
//                 Crisis Stabilization Tools
//               </h4>
//               <p className="text-gray-600 text-sm">
//                 Tools to navigate conflict, improve communication, and support
//                 teenagers struggling with bullying, drug use, or academic
//                 setbacks.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Community Section */}
//       <section id="community" className="py-16">
//         <div className="max-w-6xl mx-auto px-6 text-center">
//           <h3 className="text-2xl font-bold text-gray-800 mb-8">
//             Community & Resources
//           </h3>
//           <div className="grid md:grid-cols-3 gap-6">
//             <div className="p-6 bg-white rounded-xl shadow">
//               <h4 className="font-semibold text-gray-800 mb-2">Groups</h4>
//               <p className="text-gray-600 text-sm">
//                 Join groups dedicated to topics like teenage addiction,
//                 parenting, and learning differences.
//               </p>
//             </div>
//             <div className="p-6 bg-white rounded-xl shadow">
//               <h4 className="font-semibold text-gray-800 mb-2">Discussions</h4>
//               <p className="text-gray-600 text-sm">
//                 Engage in conversations, ask questions, and connect with other
//                 families facing similar challenges.
//               </p>
//             </div>
//             <div className="p-6 bg-white rounded-xl shadow">
//               <h4 className="font-semibold text-gray-800 mb-2">Resources</h4>
//               <p className="text-gray-600 text-sm">
//                 Access podcasts, webinars, research documents, and events to
//                 stay informed and supported.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Why Us Section */}
//       <section id="why-us" className="py-16 bg-blue-600 text-white text-center">
//         <div className="max-w-3xl mx-auto px-6">
//           <h3 className="text-2xl font-bold mb-4">Why FamilyNation?</h3>
//           <p className="mb-6 text-lg">
//             Families need support today. With our trusted partnerships,
//             AI-powered guidance, and community-driven solutions, we help you
//             take action—right now.
//           </p>
//           <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold shadow hover:bg-gray-100">
//             Get Started
//           </button>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-gray-300 py-6 mt-10">
//         <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
//           <p>&copy; {new Date().getFullYear()} FamilyNation. All rights reserved.</p>
//           <nav className="flex gap-4 mt-4 md:mt-0 text-sm">
//             <Link href="#about">About</Link>
//             <Link href="#solutions">Solutions</Link>
//             <Link href="#community">Community</Link>
//             <Link href="#resources">Resources</Link>
//             <Link href="#events">Events</Link>
//           </nav>
//         </div>
//       </footer>
//     </div>
//   );
// }

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  // Handle EXIT button
  const handleExit = () => {
    router.push("/"); // Redirect to home or safe page
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-blue-50 to-white">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Supporting Families in Crisis
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-6">
          FamilyNation connects parents and caregivers to trusted resources,
          professionals, and communities to overcome challenges like substance
          use, bullying, learning difficulties, and family conflict.
        </p>
        <Link href="/chat">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700">
            We Need Help Now!
          </button>
        </Link>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-100 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            About FamilyNation
          </h3>
          <p className="text-gray-600 text-lg">
            FamilyNation provides families with resources, guidance, and
            community support for challenges like teenage substance use,
            bullying, learning difficulties, and family conflict. Our mission
            is to help families navigate crises safely and effectively.
          </p>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            What FamilyNation Offers
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl shadow">
              <h4 className="text-lg font-semibold mb-2 text-gray-800">
                Private Network of Resources
              </h4>
              <p className="text-gray-600 text-sm">
                Professionally curated, trusted resources tailored to your
                family’s circumstances—like substance use, learning challenges,
                and conflict resolution.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl shadow">
              <h4 className="text-lg font-semibold mb-2 text-gray-800">
                AI-Driven Guidance
              </h4>
              <p className="text-gray-600 text-sm">
                Get smart recommendations and referrals to professionals—mental
                health, education, and family support—powered by technology and
                expert input.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl shadow">
              <h4 className="text-lg font-semibold mb-2 text-gray-800">
                Crisis Stabilization Tools
              </h4>
              <p className="text-gray-600 text-sm">
                Tools to navigate conflict, improve communication, and support
                teenagers struggling with bullying, drug use, or academic
                setbacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">
            Community & Support
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl shadow">
              <h4 className="font-semibold text-gray-800 mb-2">Groups</h4>
              <p className="text-gray-600 text-sm">
                Join groups dedicated to topics like teenage addiction,
                parenting, and learning differences.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              <h4 className="font-semibold text-gray-800 mb-2">Discussions</h4>
              <p className="text-gray-600 text-sm">
                Engage in conversations, ask questions, and connect with other
                families facing similar challenges.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              <h4 className="font-semibold text-gray-800 mb-2">Connect</h4>
              <p className="text-gray-600 text-sm">
                Reach out to professionals, access podcasts, webinars, and
                research resources to stay informed and supported.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Resources</h3>
          <p className="text-gray-600 mb-4">
            Access research documents, webinars, podcasts, and guides for
            parenting and adolescent challenges.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Research on learning differences</li>
            <li>Webinars on bullying and substance use</li>
            <li>Podcasts for parents and caregivers</li>
            <li>Local Family Resource Centers</li>
          </ul>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 bg-gray-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Events</h3>
          <p className="text-gray-600 mb-4">
            Join upcoming workshops, webinars, and community events designed to
            support families.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>Parent Project® online workshops</li>
            <li>Local Family Support meetups</li>
            <li>Webinar series on adolescent mental health</li>
          </ul>
        </div>
      </section>

      {/* Why Us Section */}
      <section
        id="why-us"
        className="py-16 bg-blue-600 text-white text-center"
      >
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-2xl font-bold mb-4">Why FamilyNation?</h3>
          <p className="mb-6 text-lg">
            Families need support today. With our trusted partnerships,
            AI-powered guidance, and community-driven solutions, we help you
            take action—right now.
          </p>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold shadow hover:bg-gray-100">
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6 mt-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} FamilyNation. All rights reserved.</p>
          <nav className="flex gap-4 mt-4 md:mt-0 text-sm">
            <a href="#about">About</a>
            <a href="#solutions">Solutions</a>
            <a href="#community">Community</a>
            <a href="#resources">Resources</a>
            <a href="#events">Events</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

