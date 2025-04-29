const userPref = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
const currentTheme = localStorage.getItem("theme") ?? userPref
document.documentElement.setAttribute("saved-theme", currentTheme)

// Set the initial theme class on the HTML element
if (currentTheme === "dark") {
  document.documentElement.classList.add("dark")
} else {
  document.documentElement.classList.remove("dark")
}

const emitThemeChangeEvent = (theme: "light" | "dark") => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  const switchTheme = (e: Event) => {
    const currentTheme = document.documentElement.getAttribute("saved-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    // Toggle dark class on HTML element for shadcn/ui
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  const themeChange = (e: MediaQueryListEvent) => {
    const newTheme = e.matches ? "dark" : "light"

    // Toggle dark class on HTML element for shadcn/ui
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  // Darkmode toggle
  const themeButton = document.querySelector("#darkmode") as HTMLButtonElement
  if (themeButton) {
    themeButton.addEventListener("click", switchTheme)
    window.addCleanup(() => themeButton.removeEventListener("click", switchTheme))
  }

  // Listen for changes in system preference
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)")
  prefersDarkMode.addEventListener("change", themeChange)
  window.addCleanup(() => prefersDarkMode.removeEventListener("change", themeChange))
})
