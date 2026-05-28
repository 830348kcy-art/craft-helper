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

## 추가 방법

1. 위 경로에 `<id>.png` 형식으로 파일을 떨군다
2. (시트 사용 중이면) 60초 캐시 만료 또는 dev 서버 재시작
3. 끝 — 별도 코드 수정 불필요
