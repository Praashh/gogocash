import type { Metadata } from "next";

const TITLE = "GoGoCash- Get Instant Castback, for every spend.";
const DESCRIPTION =
  "GoGoCash is a smart cashback platform that rewards you with instant cashback in stablecoins for your purchases with partnered merchants. Shop, earn, and save effortlessly with blockchain-powered transparency.";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const seoConfig: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  applicationName: "GoGoCash",
  creator: "praash",

  category: "Web3",
  alternates: {
    canonical: BASE_URL,
  },
  keywords: [
    "GoGoCash",
    "LLM",
    "Fast",
    "User friendly",
    "Customization",
    "Cheap",
    "web3",
    "blockchain",
    "open-source",
  ],
  metadataBase: new URL(BASE_URL!),
};
