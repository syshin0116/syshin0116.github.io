import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Header: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return children.length > 0 ? <header>{children}</header> : null
}

Header.css = `
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 2rem 0;
  gap: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

header h1 {
  margin: 0;
  flex: auto;
  font-weight: 600;
  font-size: 1.875rem;
  line-height: 2.25rem;
  letter-spacing: -0.025em;
  color: var(--foreground);
}
`

export default (() => Header) satisfies QuartzComponentConstructor
