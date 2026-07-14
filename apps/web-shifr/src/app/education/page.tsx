import type { Metadata } from "next";
import EducationProposal from "./education-client";

export const metadata: Metadata = {
  title: "Digital Transformation for Education | PT Shifr Asia Inovasi",
  description:
    "Integrated Digital Education Ecosystem — SSO, LMS, HRIS, Finance & Parent Portal. Modular architecture for schools, foundations, and educational institutions.",
  openGraph: {
    title: "Digital Transformation Masterplan for Educational Institutions",
    description:
      "An Integrated Information System & IT Governance Proposal by PT Shifr Asia Inovasi.",
    type: "website",
  },
};

export default function EducationPage() {
  return <EducationProposal />;
}
