"use client";

import { FarmViewer3D } from "./FarmViewer3D";

type WikiSectionData = {
  id: string;
  heading: string;
  html: string;
  farmId?: string;
};

const FARM_MARKER = "<!-- FARM_3D -->";

/** HTML 섹션 + 3D 농장 뷰어 (마커 위치에 삽입) */
export function WikiSectionContent({ section }: { section: WikiSectionData }) {
  if (!section.farmId || !section.html.includes(FARM_MARKER)) {
    return <div dangerouslySetInnerHTML={{ __html: section.html }} />;
  }

  const [before, after] = section.html.split(FARM_MARKER);
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: before }} />
      <FarmViewer3D farmId={section.farmId} />
      <div dangerouslySetInnerHTML={{ __html: after }} />
    </>
  );
}
