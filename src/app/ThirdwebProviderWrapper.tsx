"use client"; // Ensure this is a client-side component

import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import Header from "./header/Header"; // Import the Header component
import "./styles/ThirdwebProviderWrapper.css"; // Import custom styles for the wallet

// Access the clientId from the environment variable
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

export default function ThirdwebProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider clientId={clientId}> {/* Pass clientId here */}
      <Header /> {/* Add the Header component here */}
      <div className="connect-wallet-container">
        <ConnectWallet className="connect" /> {/* Add the custom class here */}
      </div>
      {children} {/* This renders the content of the page */}
    </ThirdwebProvider>
  );
}
