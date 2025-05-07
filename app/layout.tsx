import { Inter } from "next/font/google";
import "antd/dist/reset.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "./css/system.css";
import "./css/common.css";
import "./css/style.css";
import { headers } from "next/headers";
import { defaultLocale } from "@/next-intl-config";
import { NextIntlClientProvider } from "next-intl";
import AuthLayout from "@/common/layouts/AuthLayout";
import MainLayout from "@/common/layouts/MainLayout";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
};
export const metadata = {
  title: 'My Website Title',
  description: 'Mô tả trang web của bạn',
  icons: {
    icon: '/favicon.png', // hoặc favicon.png nếu dùng PNG
  },
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = headers().get("x-pathname") || "/";

  let Layout = MainLayout;
  if (pathname === "/login") {
    Layout = AuthLayout;
  }
  // if (pathname === "/") {
  //   Layout = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  //   Layout.displayName = "RootOnlyLayout"; // Thêm displayName cho layout không có tên
  // }

  const locale = headers().get("locale") || defaultLocale;
  const messages = require(`@/locales/${locale}.json`);

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Layout>{children}</Layout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

RootLayout.displayName = "RootLayout"; // Thêm displayName cho RootLayout

export default RootLayout;
