import { PageLayout, SharedLayout, FullPageLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzPluginData } from "./quartz/plugins/vfile"
import { FullSlug, SimpleSlug } from "./quartz/util/path"
import { getDate } from "./quartz/components/Date"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer(),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer(),
  ],
  right: [],
}

// components for the home page (index.md)
export const homePageLayout: Partial<FullPageLayout> = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.Explorer({
      folderDefaultState: "collapsed", // 모든 폴더 기본 닫힘 상태
      useSavedState: false, // 모바일 성능을 위해 저장된 상태 사용 안함
    }),
  ],
  right: [
    Component.Graph({
      localGraph: {
        depth: 2,  // 2단계 깊이만 보여줌 (모바일 성능 개선)
      }
    }),
    Component.DesktopOnly(Component.TableOfContents()),
  ],
  afterBody: [
    Component.RecentNotes({
      title: "최근 글",
      limit: 15,
      showTags: true,
      linkToMore: false,
      showPagination: true, // pagination 활성화
      itemsPerPage: 6, // 페이지당 6개 아이템 표시
      filter: (f: QuartzPluginData) => f.slug !== "index" // index 페이지 제외
    }),
  ],
}
