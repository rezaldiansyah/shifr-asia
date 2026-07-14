import type { Metadata } from "next";
import EducationProposal from "../education-client";

export const metadata: Metadata = {
  title: "Transformasi Digital untuk Pendidikan | PT Shifr Asia Inovasi",
  description:
    "Ekosistem Pendidikan Digital Terintegrasi — SSO, LMS, HRIS, Keuangan & Portal Orang Tua. Arsitektur modular untuk sekolah, yayasan, dan institusi pendidikan.",
};

export default function EducationPageID() {
  return <EducationProposal locale="id" />;
}
