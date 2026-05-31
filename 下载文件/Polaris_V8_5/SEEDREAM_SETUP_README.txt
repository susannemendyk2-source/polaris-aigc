北极星AIGC电影级工业系统 V7 · 火山引擎即梦 / Seedream 生图接入说明

1. 主页面文件
Polaris_AIGC_Cinema_Industrial_System_V7_SEEDREAM_IMAGE_API.js
↓ 改名为
app/page.js

2. 图片生成后端代理
image_generate_route_V7_SEEDREAM.js
↓ 改名为
app/api/image-generate/route.js

3. DeepSeek 后端代理
如果你还没有放过：
deepseek_route_V7_AUDIT_STABLE.js
↓ 改名为
app/api/deepseek/route.js

4. 链接解析后端代理
如果你还没有放过：
link_ingest_route_V7_AUDIT_STABLE.js
↓ 改名为
app/api/link-ingest/route.js

5. 环境变量 .env.local
项目根目录创建 .env.local：

DEEPSEEK_API_KEY=sk-你的DeepSeek密钥
ARK_API_KEY=你的火山方舟API Key

可选：
VOLCENGINE_ARK_API_KEY=你的火山方舟API Key
SEEDREAM_API_KEY=你的火山方舟API Key
ARK_IMAGE_ENDPOINT=https://ark.cn-beijing.volces.com/api/v3/images/generations

6. 推荐图片模型
默认：doubao-seedream-5-0-260128
可选：doubao-seedream-5-0-lite / doubao-seedream-4-5-251128 / doubao-seedream-4-0-250828

7. 重启
rm -rf .next
npm run dev

