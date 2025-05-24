import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"
import styles from "./styles/card.scss"

// Card 컴포넌트 옵션들
interface CardOptions {
  className?: string
  children?: any
}

interface CardHeaderOptions {
  className?: string
  children?: any
}

interface CardTitleOptions {
  className?: string
  children?: any
}

interface CardDescriptionOptions {
  className?: string
  children?: any
}

interface CardContentOptions {
  className?: string
  children?: any
}

interface CardFooterOptions {
  className?: string
  children?: any
}

// Card 메인 컴포넌트
export const Card = ((userOpts?: CardOptions) => {
  const opts = { ...userOpts }
  
  const CardComponent: QuartzComponent = ({ displayClass, children }: QuartzComponentProps) => {
    return (
      <div
        className={classNames(
          displayClass,
          "quartz-card",
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          opts.className || ""
        )}
      >
        {opts.children || children}
      </div>
    )
  }
  
  CardComponent.css = styles
  return CardComponent
}) satisfies QuartzComponentConstructor

// CardHeader 컴포넌트
export const CardHeader = ((userOpts?: CardHeaderOptions) => {
  const opts = { ...userOpts }
  
  const CardHeaderComponent: QuartzComponent = ({ displayClass, children }: QuartzComponentProps) => {
    return (
      <div
        className={classNames(
          displayClass,
          "quartz-card-header",
          "flex flex-col space-y-1.5 p-6",
          opts.className || ""
        )}
      >
        {opts.children || children}
      </div>
    )
  }
  
  CardHeaderComponent.css = styles
  return CardHeaderComponent
}) satisfies QuartzComponentConstructor

// CardTitle 컴포넌트
export const CardTitle = ((userOpts?: CardTitleOptions) => {
  const opts = { ...userOpts }
  
  const CardTitleComponent: QuartzComponent = ({ displayClass, children }: QuartzComponentProps) => {
    return (
      <div
        className={classNames(
          displayClass,
          "quartz-card-title",
          "text-2xl font-semibold leading-none tracking-tight",
          opts.className || ""
        )}
      >
        {opts.children || children}
      </div>
    )
  }
  
  CardTitleComponent.css = styles
  return CardTitleComponent
}) satisfies QuartzComponentConstructor

// CardDescription 컴포넌트
export const CardDescription = ((userOpts?: CardDescriptionOptions) => {
  const opts = { ...userOpts }
  
  const CardDescriptionComponent: QuartzComponent = ({ displayClass, children }: QuartzComponentProps) => {
    return (
      <div
        className={classNames(
          displayClass,
          "quartz-card-description",
          "text-sm text-muted-foreground",
          opts.className || ""
        )}
      >
        {opts.children || children}
      </div>
    )
  }
  
  CardDescriptionComponent.css = styles
  return CardDescriptionComponent
}) satisfies QuartzComponentConstructor

// CardContent 컴포넌트
export const CardContent = ((userOpts?: CardContentOptions) => {
  const opts = { ...userOpts }
  
  const CardContentComponent: QuartzComponent = ({ displayClass, children }: QuartzComponentProps) => {
    return (
      <div
        className={classNames(
          displayClass,
          "quartz-card-content",
          "p-6 pt-0",
          opts.className || ""
        )}
      >
        {opts.children || children}
      </div>
    )
  }
  
  CardContentComponent.css = styles
  return CardContentComponent
}) satisfies QuartzComponentConstructor

// CardFooter 컴포넌트
export const CardFooter = ((userOpts?: CardFooterOptions) => {
  const opts = { ...userOpts }
  
  const CardFooterComponent: QuartzComponent = ({ displayClass, children }: QuartzComponentProps) => {
    return (
      <div
        className={classNames(
          displayClass,
          "quartz-card-footer",
          "flex items-center p-6 pt-0",
          opts.className || ""
        )}
      >
        {opts.children || children}
      </div>
    )
  }
  
  CardFooterComponent.css = styles
  return CardFooterComponent
}) satisfies QuartzComponentConstructor 