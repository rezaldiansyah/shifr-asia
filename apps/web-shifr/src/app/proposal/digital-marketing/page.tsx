import type { Metadata } from "next";
import DigitalMarketingProposal from "./digital-marketing-client";

export const metadata: Metadata = {
  title: "Digital Growth & Social Media Management Strategy | PT Shifr Asia Inovasi",
  description:
    "A comprehensive B2B digital marketing proposal for building brand authority through strategic social media management, content execution, and digital growth.",
  openGraph: {
    title: "Digital Growth & Social Media Management Strategy",
    description:
      "Building Brand Authority and Dominating Your Industry's Narrative. Prepared by PT Shifr Asia Inovasi.",
    type: "website",
    url: "https://shifr.asia/proposal/digital-marketing",
  },
};

export default function DigitalMarketingPage() {
  return <DigitalMarketingProposal />;
}
