"use client";

import Header from "@/components/Header";
import { useEffect, useState } from "react";

const Account = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if the user is on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
      // Regex to detect mobile devices (Android, iPhone, etc.)
      const mobile = Boolean(userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      ));
      setIsMobile(mobile);
    };

    checkMobile();
  }, []);

  // 1. Desktop Link: Forces Gmail Website
  const desktopLink = "https://mail.google.com/mail/?view=cm&fs=1&to=shettyullas645@gmail.com&su=Spotify+Clone+Support+Request";
  
  // 2. Mobile Link: Opens Default App (Reliable)
  const mobileLink = "mailto:shettyullas645@gmail.com?subject=Spotify%20Clone%20Support%20Request";

  return ( 
    <div 
      className="
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      "
    >
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">
            Account Settings
          </h1>
        </div>
      </Header>
      
      <div className="px-6 pb-6">
        <div className="flex flex-col gap-y-4">
          <p className="text-white">
            You are currently on the <span className="font-bold text-green-500">Free Plan</span>.
          </p>
          <p className="text-neutral-400 text-sm">
            (Stripe integration is currently disabled for this demo).
          </p>
        </div>

        <div className="flex flex-col gap-y-4 mt-10">
          <h2 className="text-white text-2xl font-semibold">
            Support
          </h2>
          <p className="text-neutral-400 text-sm">
            Found a bug or have a question? Reach out to our team.
          </p>
          
          {/* SMART LINK: Swaps href based on device type */}
          <a 
            href={isMobile ? mobileLink : desktopLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              w-[200px]
              rounded-full 
              bg-white 
              border 
              border-transparent 
              px-3 
              py-3 
              disabled:cursor-not-allowed 
              disabled:opacity-50 
              text-black 
              font-bold 
              hover:opacity-75 
              transition
              text-center
            "
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
   );
}
 
export default Account;