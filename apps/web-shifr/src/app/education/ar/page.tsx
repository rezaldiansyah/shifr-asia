import type { Metadata } from "next";
import EducationProposal from "../education-client";

export const metadata: Metadata = {
  title: "التحول الرقمي للتعليم | PT Shifr Asia Inovasi",
  description:
    "نظام تعليمي رقمي متكامل — تسجيل دخول موحد، نظام إدارة التعلم، نظام الموارد البشرية، المالية وبوابة أولياء الأمور. هندسة معمارية نمطية للمدارس والمؤسسات التعليمية.",
};

export default function EducationPageAR() {
  return <EducationProposal locale="ar" />;
}
