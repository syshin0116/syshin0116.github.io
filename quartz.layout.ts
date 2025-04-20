import { PageLayout, SharedLayout } from "./quartz/cfg"
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

// 파일을 날짜순으로 정렬하는 함수
const sortByDate = (f1: QuartzPluginData, f2: QuartzPluginData) => {
  // 날짜 정보 확인
  if (f1.dates && f2.dates) {
    // 두 파일 모두 날짜가 있는 경우, 최신순으로 정렬
    const f1Date = f1.dates.created || f1.dates.modified
    const f2Date = f2.dates.created || f2.dates.modified
    if (f1Date && f2Date) {
      return f2Date.getTime() - f1Date.getTime()
    }
  } else if (f1.dates && !f2.dates) {
    // f1에만 날짜가 있는 경우 f1을 앞에 배치
    return -1
  } else if (!f1.dates && f2.dates) {
    // f2에만 날짜가 있는 경우 f2를 앞에 배치
    return 1
  }

  // 날짜가 없는 경우 제목으로 알파벳순 정렬
  const f1Title = f1.frontmatter?.title?.toLowerCase() ?? ""
  const f2Title = f2.frontmatter?.title?.toLowerCase() ?? ""
  return f1Title.localeCompare(f2Title)
}

// Filter out index.md and tags folder
const filterIndexAndTags = (f: QuartzPluginData) => {
  if (!f.slug) return false
  if (f.slug === "index") return false
  if (f.slug.startsWith("tags/")) return false
  return true
}

// Add special layout for index page
export const customLayouts = {
  "index": {
    ...defaultContentPageLayout,
    beforeBody: [
      Component.Breadcrumbs(),
      Component.ArticleTitle(),
      Component.RecentNotes({
        title: "최근 작성한 글",
        limit: 5,
        showTags: true
      })
    ],
    pageBody: Component.FolderContent({
      sort: sortByDate,
      showFolderCount: false,
      filterFn: filterIndexAndTags
    }),
  }
}
