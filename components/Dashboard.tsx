import React, { useEffect, useState } from 'react';
import type { View } from '../types';
import { Location } from '../types/location';
import { getLocation } from '../api/locationApi';
import HappyFamilyImg from '../assets/images/happy-family.png';
import FamilyImage from '../assets/images/FamilyImage.jpg';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix marker icon issue for React + Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { useUser } from '../api/userApi';
import { useNavigate } from 'react-router-dom';
import { Globe, Heart, MapPin, MessageCircle, Users } from 'lucide-react';
import { Button } from './ui/button';

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
  const { user } = useUser();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
// audioUnlock.ts
  let audioUnlocked = false;

  const unlockIOSAudio = async () => {
  if (audioUnlocked) return;

  try {
    const AudioCtx =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      await ctx.resume(); // ✅ must happen during a user gesture (tap)
    }
    ctx.close();
    audioUnlocked = true;
    console.log("🔓 iOS audio unlocked");
  } catch (err) {
    console.warn("Audio unlock failed:", err);
  }
};

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

  function ResizeMap() {
    const map = useMap();
    useEffect(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }, [map]);
    return null;
  }

  useEffect(() => {
    fetchLocation();
  }, []);

  const handleChatbotOpen = async () => {
  setChatbotOpen(true);
  await unlockIOSAudio();
};

  return (
    // <div className="relative min-h-screen">
    //   {/* Background Image */}
    //   <div
    //     className="fixed inset-0 w-full h-full bg-cover bg-center -z-10"
    //     style={{ backgroundImage: `url(${FamilyImage})` }}
    //   />
    //   <div className="fixed inset-0 bg-black/20 -z-10" />

    //   {/* Content */}
    //   <div className="relative z-20 p-[2px] md:p-6 min-h-screen">
    //     {/* Main Card */}
    //     <div className="p-6 lg:p-16 rounded-2xl shadow-xl mb-12 lg:mb-16 border bg-white/90">
    //       <div className="flex flex-col lg:flex-row items-center justify-between mb-10">
    //         <div className="text-center lg:text-left mb-6 lg:mb-0">
    //           <h1 className="text-4xl lg:text-6xl font-bold text-[#1E3A8A] font-montserrat bg-gradient-to-r from-[#1E3A8A] to-[#0D9488] bg-clip-text text-transparent">
    //             Welcome to FamilyNation
    //           </h1>
    //           <p className="text-2xl text-[#0D9488] mt-4 font-lato italic">
    //             "It Starts at Home."
    //           </p>
    //         </div>
    //       </div>

    //       <p className="text-gray-700 text-lg leading-relaxed font-lato text-center lg:text-left max-w-4xl">
    //         You're in a safe space. We believe{' '}
    //         <strong className="text-[#1E3A8A]">
    //           stronger families build a stronger future
    //         </strong>
    //         . Our AI agent Hazel and curated network of professionals are here
    //         to guide you every step of the way.
    //       </p>

    //       <div className="flex flex-col sm:flex-row gap-6 mt-12 justify-center">
    //         <button
    //           onClick={() =>
    //             !user ? navigate('/login') : setChatbotOpen(true)
    //           }
    //           className="bg-gradient-to-r from-[#F87171] to-[#EF4444] hover:from-[#EF4444] hover:to-[#DC2626] text-white font-bold py-5 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-xl flex items-center justify-center"
    //         >
    //           💬 We Need Help Now! Talk to Hazel
    //         </button>
    //       </div>

    //       {/* Location card */}
    //       <div className="flex flex-col lg:flex-row justify-start items-stretch mt-12 gap-8">
    //         {/* Location Card */}
    //         <div className="w-full p-6 rounded-xl shadow-md bg-white/80 backdrop-blur flex flex-col lg:flex-row gap-6">
    //           {/* Left: Location Details */}
    //           <div className="w-full lg:w-1/4">
    //             <h1 className="text-2xl font-bold mb-4">📍 Your Location</h1>

    //             {loading && <p>⏳ Loading...</p>}
    //             {error && <p className="text-red-500">⚠️ {error}</p>}

    //             {location && (
    //               <div className="bg-gray-100 rounded-lg p-4 shadow-sm space-y-2">
    //                 {location.city && (
    //                   <p className="text-sm">
    //                     <strong>City:</strong> {location.city}
    //                   </p>
    //                 )}
    //                 {location.region && (
    //                   <p className="text-sm">
    //                     <strong>Region:</strong> {location.region}
    //                   </p>
    //                 )}
    //                 {location.country && (
    //                   <p className="text-sm">
    //                     <strong>Country:</strong> {location.country}
    //                   </p>
    //                 )}
    //               </div>
    //             )}
    //           </div>

    //           {/* Right: Map */}
    //           {location && (
    //             <div className="w-full lg:w-3/4">
    //               <div className="h-64 w-full rounded-lg overflow-hidden shadow-lg border">
    //                 <MapContainer
    //                   center={[location.lat, location.lon]}
    //                   zoom={13}
    //                   scrollWheelZoom={false}
    //                   className="h-full w-full"
    //                 >
    //                   <TileLayer
    //                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //                   />
    //                   <Marker position={[location.lat, location.lon]}>
    //                     <Popup>
    //                       {location.city}, {location.region}, {location.country}
    //                     </Popup>
    //                   </Marker>
    //                   <ResizeMap />
    //                 </MapContainer>
    //               </div>
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div>
      <div className="relative min-h-screen flex items-center justify-center text-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center -z-10"
          style={{ backgroundImage: `url(${FamilyImage})` }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 -z-10" />

        {/* Content */}
        <div className="relative z-20 p-[2px] md:p-6 min-h-screen w-full max-w-7xl mx-auto">
          {/* Main Card */}
          <div className="p-6 lg:p-16 mb-12 lg:mb-16 text-start">
            {' '}
            {/* Changed text-center to text-start */}
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row items-center justify-between mb-10">
              <div className="text-start lg:text-start mb-6 lg:mb-0 w-full">
                {' '}
                {/* Changed text-center to text-start */}
                <h1 className=" text-4xl lg:text-6xl text-white font-bold font-montserrat">
                  Welcome to FamilyNation
                </h1>
                <p className=" text-2xl text-white mt-4 font-lato italic">
                  "It Starts at Home..."
                </p>
              </div>
            </div>
            {/* Description Text */}
            <div className=" w-full">
              {' '}
              {/* Added text-start wrapper */}
              <p className="text-white text-lg leading-relaxed font-lato max-w-4xl">
                You're in a safe space. We believe{' '}
                <strong className="text-green-500">
                  stronger families build a stronger future
                </strong>
                . Our AI agent Hazel and curated network of professionals are
                here to guide you through every step of the way.
              </p>
            </div>
            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-6 mt-12 justify-start">
              {' '}
              {/* Changed justify-center to justify-start */}
              <button
                // onClick={() =>
                //   !user ? navigate('/login') : setChatbotOpen(true)
                // }
                onClick={handleChatbotOpen}
                className="border border-white hover:bg-red-500 text-white py-5 px-10 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg flex items-center justify-center"
              >
                💬 Need Help Now ? Talk to Hazel !
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Location card */}

      {/* <div className="w-full bg-[#737373] flex flex-col lg:flex-row justify-start items-stretch gap-8"> */}
      {/* Location Card */}
      {/* <div className="w-full p-6 backdrop-blur flex flex-col lg:flex-row gap-6"> */}
      {/* Left: Location Details */}
      {/* <div className="w-full lg:w-1/4 text-start">

            {loading && <p>⏳ Loading...</p>}
            {error && <p className="text-red-500">⚠️ {error}</p>}

            {location && (
              <div className="h-full bg-gray-100 p-4 shadow-sm space-y-2 text-start">
                <h1 className="flex text-black gap-2 text-2xl font-bold mb-4">
                  <MapPin className="mt-1 text-red-500 h-6 w-6" />
                  Your Location
                </h1>
                {' '}
            
                {location.city && (
                  <p className="text-sm">
                    <strong>City :</strong> {location.city}
                  </p>
                )}
                {location.region && (
                  <p className="text-sm">
                    <strong>Region :</strong> {location.region}
                  </p>
                )}
                {location.country && (
                  <p className="text-sm">
                    <strong>Country :</strong> {location.country}
                  </p>
                )}
              </div>
            )}
          </div> */}

      {/* Right: Map */}
      {/* {location && (
            <div className="w-full lg:w-3/4">
              <div className="h-64 w-full overflow-hidden shadow-lg border">
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
                  <ResizeMap />
                </MapContainer>
              </div>
            </div>
          )} */}
      {/* </div>
      </div> */}

      {/* About Section */}
      <div className="py-20 bg-white">
        <div className="mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
          <img
            src={FamilyImage}
            alt="About FamilyNation"
            width={700}
            height={400}
            className="shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-bold mb-6">About FamilyNation</h2>
            <p className="text-gray-700 leading-relaxed">
              FamilyNation is dedicated to building stronger family bonds by
              fostering connection, support, and shared values. Our mission is
              to empower families through community, resources, and global
              engagement.FamilyNation is dedicated to building stronger family
              bonds by fostering connection, support, and shared values. Our
              mission is to empower families through community, resources, and
              global engagement.
            </p>
            <br />
            <p className="text-gray-700 leading-relaxed">
              FamilyNation is dedicated to building stronger family bonds by
              fostering connection, support, and shared values. Our mission is
              to empower families through community, resources, and global
              engagement.
            </p>
            <button className="p-4 mt-6 text-md font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-800 hover:from-emerald-600 hover:to-emerald-800">
              More Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
