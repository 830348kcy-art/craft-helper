import Link from "next/link";
import { getArmorTrims, getTrimMaterials } from "@/lib/smithing";
import { SmithingTrimGallery } from "@/app/components/SmithingTrimGallery";
import { SmartIcon } from "@/app/components/SmartIcon";
import { WikiArticle } from "@/app/components/PageShell";
import { getBlockTexture } from "@/lib/textures";

export default function SmithingPage() {
  const trims = getArmorTrims();
  const materials = getTrimMaterials();

  return (
    <div className="wiki-page-bg min-h-[80vh] flex-1 w-full">
      <div className="wiki-page-mesh" aria-hidden />
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <WikiArticle>
          <div className="wiki-hero-banner !border-0">
            <nav className="text-[12px] text-white/70 mb-3">
              <Link href="/" className="hover:text-white transition-colors">대문</Link>
              <span className="mx-1.5">›</span>
              <span className="text-white">대장장이 작업</span>
            </nav>
            <h1 className="wiki-hero-title flex items-center gap-3">
              <SmartIcon
                image={getBlockTexture("smithing_table")}
                emoji="⚒️"
                size="lg"
                alt="대장장이 작업"
              />
              대장장이 작업
            </h1>
            <p className="wiki-hero-sub">
              갑옷 장식 형판과 광물·수정으로 갑옷 무늬와 색을 꾸밀 수 있습니다.
            </p>
          </div>

          <div className="px-6 sm:px-8 py-6 sm:py-8 prose-wiki">
            <p className="text-[14px] leading-relaxed mb-6">
              <strong>대장장이 작업</strong>은 대장장이 작업대에서 장비를 네더라이트로 강화하거나
              갑옷에 장식을 입히는 기능입니다. 아래에서 <em>형판</em>과 <em>장식 재료</em>를 선택하면
              갑옷 풀샷 미리보기에 재료 색이 바로 반영됩니다.
            </p>

            <SmithingTrimGallery trims={trims} materials={materials} />

            <h2 className="!mt-10">네더라이트 강화</h2>
            <p>
              <code>네더라이트 강화</code> 형판과 네더라이트 주괴로 다이아몬드 장비를
              네더라이트로 업그레이드할 수 있습니다. 모루와 달리 경험치가 소모되지 않습니다.
            </p>
          </div>
        </WikiArticle>
      </div>
    </div>
  );
}
