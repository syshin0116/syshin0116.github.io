import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"
import styles from "./styles/button.scss"

interface Options {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg"
  children: string
  href?: string
}

const defaultOptions: Options = {
  variant: "default",
  size: "md",
  children: "Button",
}

export default ((userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }
  
  const Button: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const className = classNames(
      displayClass,
      "quartz-button",
      `quartz-button--${opts.variant}`,
      `quartz-button--${opts.size}`
    )
    
    if (opts.href) {
      return (
        <a href={opts.href} class={className}>
          {opts.children}
        </a>
      )
    }
    
    return (
      <button class={className} type="button">
        {opts.children}
      </button>
    )
  }

  Button.css = styles
  return Button
}) satisfies QuartzComponentConstructor 