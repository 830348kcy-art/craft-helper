"use client";

type WikiSectionData = {
  id: string;
  heading: string;
  html: string;
};

/** HTML 섹션 렌더 */
export function WikiSectionContent({ section }: { section: WikiSectionData }) {
  return <div dangerouslySetInnerHTML={{ __html: section.html }} />;
}
