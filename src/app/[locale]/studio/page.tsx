import { auth0 } from '@/lib/auth0';
import StudioWindow from "@/app/[locale]/studio/components/main";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function StudioPage() {
  // Получаем сессию пользователя
  const session = await auth0.getSession();
  const locale = await getLocale(); // Получаем текущую локаль

  // Если пользователь не авторизован, перенаправляем его на страницу логина
  // if (!session?.user) {
  //   redirect(`/api/auth/login?returnTo=/${locale}/studio`);
  //   return null; // Не рендерим страницу
  // }

  // Если пользователь авторизован, возвращаем содержимое страницы
  return (
    <div>
      <StudioWindow />
    </div>
  );
}