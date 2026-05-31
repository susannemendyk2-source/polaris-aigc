import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "北极星AIGC电影级工业系统 V9.9.2 · DeepSeek Page Canvas UI Repair",
  description: "DeepSeek 提示词准备 + Seedream 图像画布 + 即梦/Seedance 视频智能体 + 交付包的一站式视觉工作流系统",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f8fafc",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <Script
          id="polaris-tailwind-cdn-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.tailwind = window.tailwind || {}; window.tailwind.config = { corePlugins: { preflight: false }, theme: { extend: {} } };`,
          }}
        />
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
