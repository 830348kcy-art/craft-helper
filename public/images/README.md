# 이미지 컨벤션

각 JSON 항목의 `id`와 파일명을 일치시켜 자동으로 표시됩니다.
이미지가 없는 항목은 자동으로 이모지로 폴백됩니다.

## 경로 규칙

- 블록: `public/images/blocks/<id>.png` (예: `diamond_ore.png`)
- 아이템: `public/images/items/<id>.png` (예: `diamond.png`)

## 권장 사양

- 정사각형 PNG, 64x64 ~ 128x128
- 투명 배경 권장 (다크모드에서도 잘 보임)
- 픽셀 아트는 `image-rendering: pixelated` 자동 적용

## 로컬 텍스처 동기화

`c:\minecraft_textures\minecraft_assets` 에서 블록 PNG를 복사합니다:

```bash
npm run sync
```

- 로컬 개발/빌드: `public/images/blocks/<id>.png` 사용
- CI/GitHub Pages: CDN `@1.21.4` 사용 (PNG 미포함)

## 배포

1. `deploy.bat.example` 을 `deploy.bat` 으로 복사 (`.gitignore`로 Git 제외)
2. `deploy.bat` 실행 → [830348kcy-art/craft-helper](https://github.com/830348kcy-art/craft-helper) push
3. GitHub Actions → https://830348kcy-art.github.io/craft-helper/

