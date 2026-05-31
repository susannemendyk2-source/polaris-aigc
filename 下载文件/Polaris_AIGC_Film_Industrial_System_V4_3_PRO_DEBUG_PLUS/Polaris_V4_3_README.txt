Polaris AIGC Film Industrial System V4.3

Files:
1. Polaris_AIGC_Film_Industrial_System_V4_3_PRO_DEBUG_PLUS.js
   - Main React / Next.js page component. Replace your app/page.js or src/app/page.js with this content.

2. deepseek_proxy_route.js
   - Optional Next.js API proxy route. Put it at app/api/deepseek/route.js.
   - Add DEEPSEEK_API_KEY=sk-xxxx to .env.local.
   - In the page, choose API Mode: proxy / 后端代理.

Important:
- If your page still shows deepseek-chat, you are running old code.
- This V4.3 file has a fixed bottom-left badge: V4.3 PATCH ACTIVE / 增强功能已生效.
- It includes Test DeepSeek API, API Debug Console, right-side progress panel, JSON auto repair, prompt quality score, generation history, and storyboard timeline.
