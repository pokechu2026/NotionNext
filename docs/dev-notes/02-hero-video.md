# 02 — 首頁 Hero 背景替換為全螢幕影片

## 需求

將首頁 Hero 區域的 WebGL Shader 動畫背景替換為一段全螢幕循環播放的 MP4 影片，其他文字、按鈕、版面完全不動。

## 修改的檔案

### 1. `themes/proxio/config.js`

新增影片 URL 設定，並將 Shader 預設關閉：

```js
// 新增
PROXIO_HERO_VIDEO_URL: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',

// 修改（原本是 true）
PROXIO_HERO_SHADER_ENABLE: false,
```

### 2. `themes/proxio/components/Hero.js`

在背景 fallback 邏輯的最前面加入影片判斷：

```jsx
{videoUrl ? (
  <video
    autoPlay
    loop
    muted
    playsInline
    className='absolute inset-0 w-full h-full object-cover z-0'>
    <source src={videoUrl} type='video/mp4' />
  </video>
) : shaderEnabled ? (
  <ShaderAnimation fallbackImage={bannerImage} />
) : /* 原有的 iframe / image fallback */ }
```

**重點屬性解釋：**
- `autoPlay`: 自動播放
- `loop`: 循環播放
- `muted`: 靜音（瀏覽器要求：自動播放必須靜音）
- `playsInline`: 在 iOS 上不全螢幕播放
- `object-cover`: 影片填滿整個容器並裁切

## 背景優先級

```
影片 (videoUrl) > Shader (shaderEnabled) > iframe (HERO_BODY) > 圖片 (bannerImage)
```

## PR 流程

```bash
git checkout -b feat/hero-video-bg   # 建立分支
git add ...                           # 加入修改的檔案
git commit -m "feat: Hero 背景改用全螢幕循環影片"
git push -u origin feat/hero-video-bg
gh pr create --title "..." --body "..."
gh pr merge 1                         # 合併 PR
```

## 注意事項

- 影片檔案放在 CloudFront CDN，不佔用網站空間
- 如果未來想換回 Shader，只要把 `PROXIO_HERO_SHADER_ENABLE` 改回 `true` 並清空 `PROXIO_HERO_VIDEO_URL`
