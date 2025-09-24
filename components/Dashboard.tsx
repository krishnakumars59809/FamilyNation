// import React, { useEffect, useState } from "react";
// import type { View } from "../types";
// import { Location } from "../types/location";
// import { getLocation } from "../api/locationApi";
// import HappyFamilyImg from "../assets/images/happy-family.png";

// interface DashboardProps {
//   setView: (view: View) => void;
//   setChatbotOpen: (open: boolean) => void;
// }

// export const Dashboard: React.FC<DashboardProps> = ({
//   setView,
//   setChatbotOpen,
// }) => {
//   const [location, setLocation] = useState<Location | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchLocation = async () => {
//     try {
//       setLoading(true);
//       const response = await getLocation();
//       setLocation(response);
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLocation();
//   }, []);

//   return (
//     <div className="relative min-h-screen">
//       {/* Content */}
//       <div className="relative z-20 p-6 min-h-screen">
//         {/* Main Card */}
//         <div className="p-12 lg:p-16 rounded-2xl shadow-xl  mb-12 lg:mb-16 border bg-white/90 ">
//           <div className="flex flex-col lg:flex-row items-center justify-between mb-10">
//             <div className="text-center lg:text-left mb-6 lg:mb-0">
//               <h1 className="text-5xl lg:text-6xl font-bold text-[#1E3A8A] font-montserrat bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] bg-clip-text text-transparent">
//                 Welcome to FamilyNation
//               </h1>
//               <p className="text-2xl text-[#0D9488] mt-4 font-lato italic">
//                 "It Starts at Home."
//               </p>
//             </div>
//           </div>

//           <p className="text-gray-700 text-lg leading-relaxed font-lato text-center lg:text-left max-w-4xl">
//             You're in a safe space. We believe{" "}
//             <strong className="text-[#1E3A8A]">
//               stronger families build a stronger future
//             </strong>
//             . Our AI agent Hazel and curated network of professionals are here to
//             guide you every step of the way.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-6 mt-12 justify-center">
//             <button
//               onClick={() => setChatbotOpen(true)}
//               className="bg-gradient-to-r from-[#F87171] to-[#EF4444] hover:from-[#EF4444] hover:to-[#DC2626] text-white font-bold py-5 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-xl flex items-center justify-center"
//             >
//               💬 We Need Help Now! Talk to Hazel
//             </button>
//           </div>

//           {/* --- Location card --- */}
//           <div className="p-6 mt-12">
//             <h1 className="text-2xl font-bold mb-4">📍 Your Location</h1>

//             {loading && <p>⏳ Loading...</p>}
//             {error && <p className="text-red-500">⚠️ {error}</p>}
// {location && (
//               <div className="">
//                 {/* City */}
//                 <div className="flex items-center">
//                   <svg
//                     className="w-5 h-5 text-blue-500 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M3 21v-2a4 4 0 014-4h10a4 4 0 014 4v2M16 3h4v4h-4V3zM8 3h4v4H8V3zM3 9h4v4H3V9z"
//                     />
//                   </svg>
//                   <strong>City:</strong> {location.city}
//                 </div>

//                 {/* Region */}
//                 <div className="flex items-center">
//                   <svg
//                     className="w-5 h-5 text-green-500 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M12 3v18m9-9H3"
//                     />
//                   </svg>
//                   <strong>Region:</strong> {location.region}
//                 </div>

//                 {/* Country */}
//                 <div className="flex items-center">
//                   <svg
//                     className="w-5 h-5 text-red-500 mr-2"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M21 10h-6V4H9v6H3l9 9 9-9z"
//                     />
//                   </svg>
//                   <strong>Country:</strong> {location.country}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useEffect, useState } from "react";
import type { View } from "../types";
import { Location } from "../types/location";
import { getLocation } from "../api/locationApi";
import HappyFamilyImg from "../assets/images/happy-family.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icon issue for React + Vite
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

interface DashboardProps {
  setView: (view: View) => void;
  setChatbotOpen: (open: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setView,
  setChatbotOpen,
}) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const response = await getLocation();
      setLocation(response);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${HappyFamilyImg})` }}
      />
      <div className="fixed inset-0 bg-black/20 -z-10" />

      {/* Content */}
      <div className="relative z-20 p-[2px] md:p-6 min-h-screen">
        {/* Main Card */}
        <div className="p-6 lg:p-16 rounded-2xl shadow-xl mb-12 lg:mb-16 border bg-white/90">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-10">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <h1 className="text-4xl lg:text-6xl font-bold text-[#1E3A8A] font-montserrat bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] bg-clip-text text-transparent">
                Welcome to FamilyNation
              </h1>
              <p className="text-2xl text-[#0D9488] mt-4 font-lato italic">
                "It Starts at Home."
              </p>
            </div>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed font-lato text-center lg:text-left max-w-4xl">
            You're in a safe space. We believe{" "}
            <strong className="text-[#1E3A8A]">
              stronger families build a stronger future
            </strong>
            . Our AI agent Hazel and curated network of professionals are here to
            guide you every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 mt-12 justify-center">
            <button
              onClick={() => setChatbotOpen(true)}
              className="bg-gradient-to-r from-[#F87171] to-[#EF4444] hover:from-[#EF4444] hover:to-[#DC2626] text-white font-bold py-5 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-xl flex items-center justify-center"
            >
              💬 We Need Help Now! Talk to Hazel
            </button>
          </div>

          {/* Location card */}
          <div className="p-6 mt-12">
            <h1 className="text-2xl font-bold mb-4">📍 Your Location</h1>

            {loading && <p>⏳ Loading...</p>}
            {error && <p className="text-red-500">⚠️ {error}</p>}

            {location && (
              <div className="space-y-4">

                {/* Map */}
                <div className="h-64 w-full rounded-lg overflow-hidden mt-4 shadow-lg">
                  <MapContainer
                    center={[location.lat, location.lon]}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[location.lat, location.lon]}>
                      <Popup>
                        {location.city}, {location.region}, {location.country}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
