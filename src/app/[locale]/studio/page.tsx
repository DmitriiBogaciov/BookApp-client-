import { auth0 } from '@/lib/auth0';
import StudioWindow from "@/app/[locale]/studio/components/main";
import { getLocale } from "next-intl/server";

export default async function StudioPage() {
  return (
    <div className="w-full">
      <StudioWindow />
    </div>
  );
}