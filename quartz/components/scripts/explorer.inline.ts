import { FolderState } from "../ExplorerNode"

// Current state of folders
type MaybeHTMLElement = HTMLElement | undefined
let currentExplorerState: FolderState[]

const observer = new IntersectionObserver((entries) => {
  // If last element is observed, remove gradient of "overflow" class so element is visible
  const explorerUl = document.getElementById("explorer-ul")
  if (!explorerUl) return
  for (const entry of entries) {
    if (entry.isIntersecting) {
      explorerUl.classList.add("no-background")
    } else {
      explorerUl.classList.remove("no-background")
    }
  }
})

function toggleExplorer(this: HTMLElement) {
  // Toggle collapsed state of entire explorer
  this.classList.toggle("collapsed")

  // Toggle collapsed aria state of entire explorer
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )

  const content = (
    this.nextElementSibling?.nextElementSibling
      ? this.nextElementSibling.nextElementSibling
      : this.nextElementSibling
  ) as MaybeHTMLElement
  if (!content) return
  content.classList.toggle("collapsed")
  content.classList.toggle("explorer-viewmode")

  // Prevent scroll under
  if (document.querySelector("#mobile-explorer")) {
    // Disable scrolling on the page when the explorer is opened on mobile
    const bodySelector = document.querySelector("#quartz-body")
    if (bodySelector) bodySelector.classList.toggle("lock-scroll")
  }
}

function toggleFolder(evt: MouseEvent) {
  evt.stopPropagation()

  // Element that was clicked
  const target = evt.target as MaybeHTMLElement
  if (!target) return

  // Find the folder container regardless of which element was clicked
  const folderContainer = target.closest(".folder-container") as MaybeHTMLElement
  if (!folderContainer) return

  // Find the next sibling which is the folder-outer element
  const childFolderContainer = folderContainer.parentElement?.querySelector(
    ".folder-outer"
  ) as MaybeHTMLElement

  // Find the element with the folderpath data attribute
  const currentFolderParent = folderContainer.querySelector(
    "[data-folderpath]"
  ) as MaybeHTMLElement

  if (!(childFolderContainer && currentFolderParent)) return

  // Toggle open class
  childFolderContainer.classList.toggle("open")

  // Update folder state
  const isCollapsed = childFolderContainer.classList.contains("open")
  setFolderState(childFolderContainer, !isCollapsed)

  // Save folder state to localStorage
  const fullFolderPath = currentFolderParent.dataset.folderpath as string
  toggleCollapsedByPath(currentExplorerState, fullFolderPath)
  const stringifiedFileTree = JSON.stringify(currentExplorerState)
  localStorage.setItem("fileTree", stringifiedFileTree)
}

function setupExplorer() {
  // Set click handler for collapsing entire explorer
  const allExplorers = document.querySelectorAll(".explorer > button") as NodeListOf<HTMLElement>

  for (const explorer of allExplorers) {
    // Get folder state from local storage
    const storageTree = localStorage.getItem("fileTree")

    // Convert to bool
    const useSavedFolderState = explorer?.dataset.savestate === "true"

    if (explorer) {
      // Get config
      const collapseBehavior = explorer.dataset.behavior

      // Add click handlers for folder containers (entire folder area)
      if (collapseBehavior === "collapse") {
        for (const item of document.getElementsByClassName(
          "folder-container",
        ) as HTMLCollectionOf<HTMLElement>) {
          item.addEventListener("click", toggleFolder)
          window.addCleanup(() => item.removeEventListener("click", toggleFolder))
        }
      }

      // Add click handler to main explorer
      window.addCleanup(() => explorer.removeEventListener("click", toggleExplorer))
      explorer.addEventListener("click", toggleExplorer)
    }

    // Get folder state from local storage
    const oldExplorerState: FolderState[] =
      storageTree && useSavedFolderState ? JSON.parse(storageTree) : []
    const oldIndex = new Map(oldExplorerState.map((entry) => [entry.path, entry.collapsed]))
    const newExplorerState: FolderState[] = explorer.dataset.tree
      ? JSON.parse(explorer.dataset.tree)
      : []
    currentExplorerState = []

    for (const { path, collapsed } of newExplorerState) {
      currentExplorerState.push({
        path,
        collapsed: oldIndex.get(path) ?? collapsed,
      })
    }

    currentExplorerState.map((folderState) => {
      const folderLi = document.querySelector(
        `[data-folderpath='${folderState.path.replace("'", "-")}']`,
      ) as MaybeHTMLElement
      const folderUl = folderLi?.parentElement?.nextElementSibling as MaybeHTMLElement
      if (folderUl) {
        setFolderState(folderUl, folderState.collapsed)
      }
    })
  }
}

function toggleExplorerFolders() {
  const currentFile = (document.querySelector("body")?.getAttribute("data-slug") ?? "").replace(
    /\/index$/g,
    "",
  )
  const allFolders = document.querySelectorAll(".folder-outer")

  allFolders.forEach((element) => {
    const folderUl = Array.from(element.children).find((child) =>
      child.matches("ul[data-folderul]"),
    )
    if (folderUl) {
      if (currentFile.includes(folderUl.getAttribute("data-folderul") ?? "")) {
        if (!element.classList.contains("open")) {
          element.classList.add("open")
        }
      }
    }
  })
}

window.addEventListener("resize", setupExplorer)

document.addEventListener("nav", () => {
  const explorer = document.querySelector("#mobile-explorer")
  if (explorer) {
    explorer.classList.add("collapsed")
    const content = explorer.nextElementSibling?.nextElementSibling as HTMLElement
    if (content) {
      content.classList.add("collapsed")
      content.classList.toggle("explorer-viewmode")
    }
  }
  setupExplorer()

  observer.disconnect()

  // select pseudo element at end of list
  const lastItem = document.getElementById("explorer-end")
  if (lastItem) {
    observer.observe(lastItem)
  }

  // Hide explorer on mobile until it is requested
  const hiddenUntilDoneLoading = document.querySelector("#mobile-explorer")
  hiddenUntilDoneLoading?.classList.remove("hide-until-loaded")

  toggleExplorerFolders()
})

/**
 * Toggles the state of a given folder
 * @param folderElement <div class="folder-outer"> Element of folder (parent)
 * @param collapsed if folder should be set to collapsed or not
 */
function setFolderState(folderElement: HTMLElement, collapsed: boolean) {
  return collapsed ? folderElement.classList.remove("open") : folderElement.classList.add("open")
}

/**
 * Toggles visibility of a folder
 * @param array array of FolderState (`fileTree`, either get from local storage or data attribute)
 * @param path path to folder (e.g. 'advanced/more/more2')
 */
function toggleCollapsedByPath(array: FolderState[], path: string) {
  const entry = array.find((item) => item.path === path)
  if (entry) {
    entry.collapsed = !entry.collapsed
  }
}
