import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/recentNotes.scss"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  limit: number
  linkToMore: SimpleSlug | false
  showTags: boolean
  filter: (f: QuartzPluginData) => boolean
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  limit: 3,
  linkToMore: false,
  showTags: true,
  filter: () => true,
  sort: byDateAndAlphabetical(cfg),
})

export default ((userOpts?: Partial<Options>) => {
  const RecentNotes: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }
    const pages = allFiles.filter(opts.filter).sort(opts.sort)
    const remaining = Math.max(0, pages.length - opts.limit)
    return (
      <div class={classNames(displayClass, "recent-notes")}>
        <h3>{opts.title ?? i18n(cfg.locale).components.recentNotes.title}</h3>
        <div class="recent-cards">
          {pages.slice(0, opts.limit).map((page) => {
            const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
            const tags = page.frontmatter?.tags ?? []

            return (
              <article class="recent-card" data-href={resolveRelative(fileData.slug!, page.slug!)}>
                <div class="card-content">
                  <div class="card-header">
                    <h4>
                      <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal card-title-link" data-no-popover="true">
                        {title}
                      </a>
                    </h4>
                  </div>
                  {page.dates && (
                    <div class="card-meta">
                      <Date date={getDate(cfg, page)!} locale={cfg.locale} />
                    </div>
                  )}
                  {opts.showTags && tags.length > 0 && (
                    <div class="card-tags">
                      {tags.map((tag) => (
                        <a
                          class="tag-link"
                          href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                        >
                          {tag}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
        {opts.linkToMore && remaining > 0 && (
          <div class="recent-more">
            <a href={resolveRelative(fileData.slug!, opts.linkToMore)} class="more-link">
              {i18n(cfg.locale).components.recentNotes.seeRemainingMore({ remaining })}
            </a>
          </div>
        )}
      </div>
    )
  }

  RecentNotes.css = style
  RecentNotes.afterDOMLoaded = `
    document.addEventListener("nav", () => {
      // Handle card click events for recent notes
      const cards = document.querySelectorAll('.recent-card[data-href]');
      
      cards.forEach(card => {
        const href = card.getAttribute('data-href');
        const titleLink = card.querySelector('.card-title-link');
        
        if (href && titleLink) {
          // Remove existing listeners to prevent duplicates
          card.removeEventListener('click', handleCardClick);
          card.removeEventListener('mouseenter', handleCardHover);
          card.removeEventListener('mouseleave', handleCardLeave);
          
          // Add click handler for the card
          function handleCardClick(e) {
            // Don't navigate if user clicked on a tag
            if (e.target.closest('.tag-link')) {
              return;
            }
            
            // Trigger the title link click to get popover functionality
            if (e.metaKey || e.ctrlKey) {
              window.open(href, '_blank');
            } else {
              window.location.href = href;
            }
          }
          
          // Add hover handlers for visual feedback only (no popover)
          function handleCardHover(e) {
            if (!e.target.closest('.tag-link')) {
              titleLink.classList.add('card-hover');
            }
          }
          
          function handleCardLeave(e) {
            titleLink.classList.remove('card-hover');
          }
          
          card.addEventListener('click', handleCardClick);
          card.addEventListener('mouseenter', handleCardHover);
          card.addEventListener('mouseleave', handleCardLeave);
        }
      });
    });
  `;
  
  return RecentNotes
}) satisfies QuartzComponentConstructor
