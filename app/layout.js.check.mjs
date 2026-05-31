import "./globals.css";
import Script from "next/script";
export const metadata = {
    title: "北极星AIGC电影级工业系统 V10.4 · DeepSeek Page Repair",
    description: "DeepSeek API 接入后创作驾驶舱修复版：清爽页面、工作流入口、无限画布生产中心、即梦/可灵视频接口。",
};
export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: "#f8fafc",
};
export default function RootLayout({ children }) {
    return (React.createElement("html", { lang: "zh-CN", suppressHydrationWarning: true },
        React.createElement("head", null,
            React.createElement(Script, { id: "polaris-tailwind-cdn-config", strategy: "beforeInteractive", dangerouslySetInnerHTML: {
                    __html: `window.tailwind = window.tailwind || {}; window.tailwind.config = { corePlugins: { preflight: false }, theme: { extend: {} } };`,
                } }),
            React.createElement(Script, { src: "https://cdn.tailwindcss.com", strategy: "beforeInteractive" })),
        React.createElement("body", { suppressHydrationWarning: true }, children)));
}
