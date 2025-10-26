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
  itemsPerPage?: number // 페이지당 아이템 수 (pagination 사용시)
  showPagination?: boolean // pagination 표시 여부
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  limit: 3,
  linkToMore: false,
  showTags: true,
  filter: () => true,
  sort: byDateAndAlphabetical(cfg),
  itemsPerPage: 6,
  showPagination: false,
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
    const displayLimit = opts.showPagination ? opts.itemsPerPage! : opts.limit
    return (
      <div class={classNames(displayClass, "recent-notes")} data-total-pages={pages.length} data-items-per-page={opts.itemsPerPage}>
        <h3>{opts.title ?? i18n(cfg.locale).components.recentNotes.title}</h3>
        <div class="recent-cards" data-pagination={opts.showPagination}>
          {pages.slice(0, displayLimit).map((page) => {
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
        {opts.showPagination && pages.length > displayLimit && (
          <div class="pagination-controls">
            <button class="pagination-btn prev-btn" disabled>이전</button>
            <span class="pagination-info">
              <span class="current-page">1</span> / <span class="total-pages">{Math.ceil(pages.length / opts.itemsPerPage!)}</span>
            </span>
            <button class="pagination-btn next-btn">다음</button>
          </div>
        )}
        {!opts.showPagination && opts.linkToMore && remaining > 0 && (
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
    let currentPage = 1;
    let allPages = [];

    function setupCardListeners() {
      const cards = document.querySelectorAll('.recent-card[data-href]');

      cards.forEach(card => {
        const href = card.getAttribute('data-href');
        const titleLink = card.querySelector('.card-title-link');

        if (href && titleLink) {
          const handleCardClick = (e) => {
            if (e.target.closest('.tag-link')) return;
            if (e.metaKey || e.ctrlKey) {
              window.open(href, '_blank');
            } else {
              window.location.href = href;
            }
          };

          const handleCardHover = (e) => {
            if (!e.target.closest('.tag-link')) {
              titleLink.classList.add('card-hover');
            }
          };

          const handleCardLeave = (e) => {
            titleLink.classList.remove('card-hover');
          };

          card.addEventListener('click', handleCardClick);
          card.addEventListener('mouseenter', handleCardHover);
          card.addEventListener('mouseleave', handleCardLeave);
        }
      });
    }

    function updatePagination() {
      const container = document.querySelector('.recent-notes');
      if (!container) return;

      const cardsContainer = container.querySelector('.recent-cards');
      const isPaginated = cardsContainer?.getAttribute('data-pagination') === 'true';
      if (!isPaginated) return;

      const totalPages = parseInt(container.getAttribute('data-total-pages') || '0');
      const itemsPerPage = parseInt(container.getAttribute('data-items-per-page') || '6');
      const totalPaginationPages = Math.ceil(totalPages / itemsPerPage);

      if (allPages.length === 0) {
        allPages = Array.from(cardsContainer.querySelectorAll('.recent-card'));
      }

      // Hide all cards
      allPages.forEach(card => card.style.display = 'none');

      // Show current page cards
      const startIdx = (currentPage - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      allPages.slice(startIdx, endIdx).forEach(card => card.style.display = '');

      // Update pagination controls
      const prevBtn = container.querySelector('.prev-btn');
      const nextBtn = container.querySelector('.next-btn');
      const currentPageSpan = container.querySelector('.current-page');

      if (prevBtn) prevBtn.disabled = currentPage === 1;
      if (nextBtn) nextBtn.disabled = currentPage === totalPaginationPages;
      if (currentPageSpan) currentPageSpan.textContent = currentPage;
    }

    function setupPagination() {
      const container = document.querySelector('.recent-notes');
      if (!container) return;

      const prevBtn = container.querySelector('.prev-btn');
      const nextBtn = container.querySelector('.next-btn');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentPage > 1) {
            currentPage--;
            updatePagination();
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const totalPages = parseInt(container.getAttribute('data-total-pages') || '0');
          const itemsPerPage = parseInt(container.getAttribute('data-items-per-page') || '6');
          const totalPaginationPages = Math.ceil(totalPages / itemsPerPage);

          if (currentPage < totalPaginationPages) {
            currentPage++;
            updatePagination();
          }
        });
      }
    }

    document.addEventListener("nav", () => {
      currentPage = 1;
      allPages = [];
      setupCardListeners();
      setupPagination();
      updatePagination();
    });
  `;
  
  return RecentNotes
}) satisfies QuartzComponentConstructor
