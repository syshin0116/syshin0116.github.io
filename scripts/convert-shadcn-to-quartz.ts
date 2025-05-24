#!/usr/bin/env ts-node

import * as fs from 'fs'
import * as path from 'path'

interface ConversionOptions {
    inputFile: string
    outputFile: string
    componentName: string
}

/**
 * shadcn/ui 컴포넌트를 Quartz 컴포넌트로 변환
 */
function convertShadcnToQuartz(options: ConversionOptions): string {
    const { inputFile, componentName } = options

    if (!fs.existsSync(inputFile)) {
        throw new Error(`Input file not found: ${inputFile}`)
    }

    const content = fs.readFileSync(inputFile, 'utf8')

    // 변환 규칙들
    const conversions = [
        // React imports 제거/변경
        {
            pattern: /import \* as React from ['"]react['"];?\n?/g,
            replacement: ''
        },
        {
            pattern: /import React from ['"]react['"];?\n?/g,
            replacement: ''
        },

        // Quartz 타입 import 추가
        {
            pattern: /^/,
            replacement: `import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"\nimport { classNames } from "../../util/lang"\n`
        },

        // SCSS import 추가
        {
            pattern: /^/,
            replacement: `import styles from "./styles/${componentName.toLowerCase()}.scss"\n\n`
        },

        // React.forwardRef를 Quartz 형식으로 변환
        {
            pattern: /const (\w+) = React\.forwardRef<([^,]+),\s*([^>]+)>\(\s*\(\s*\{([^}]+)\},\s*ref\s*\)\s*=>\s*\{/g,
            replacement: (match: string, name: string, refType: string, propsType: string, props: string) => {
                return `interface Options {\n  ${props.split(',').map(p => p.trim()).join('\n  ')}\n}\n\nconst defaultOptions: Partial<Options> = {}\n\nexport default ((userOpts?: Partial<Options>) => {\n  const opts = { ...defaultOptions, ...userOpts }\n  \n  const ${name}: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {`
            }
        },

        // displayName 제거
        {
            pattern: /\w+\.displayName = ['"][^'"]+['"];?\n?/g,
            replacement: ''
        },

        // export 구문 변경
        {
            pattern: /export \{ (\w+), ([^}]+) \}/g,
            replacement: (match: string, compName: string, others: string) => {
                return `  ${compName}.css = styles\n  return ${compName}\n}) satisfies QuartzComponentConstructor`
            }
        },

        // className을 classNames로 변경
        {
            pattern: /className=\{cn\(/g,
            replacement: 'className={classNames(displayClass, '
        },

        // asChild 처리 제거 (Quartz에서는 불필요)
        {
            pattern: /const Comp = asChild \? Slot : ['"](\w+)['"];?\n?\s*return \(\s*<Comp/g,
            replacement: 'return (<$1'
        },
        {
            pattern: /<\/Comp>/g,
            replacement: '</$1>'
        }
    ]

    let result = content

    // 순차적으로 변환 적용
    conversions.forEach(({ pattern, replacement }) => {
        result = result.replace(pattern, replacement as string)
    })

    return result
}

/**
 * 실제 shadcn/ui 컴포넌트 다운로드 및 변환
 */
async function downloadAndConvert(componentName: string) {
    const shadcnUrl = `https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/registry/default/ui/${componentName}.tsx`

    try {
        // 다운로드
        const response = await fetch(shadcnUrl)
        if (!response.ok) {
            throw new Error(`Failed to download: ${response.statusText}`)
        }

        const content = await response.text()

        // 임시 파일에 저장
        const tempFile = `/tmp/shadcn-${componentName}.tsx`
        fs.writeFileSync(tempFile, content)

        // 변환
        const outputFile = `quartz/components/ui/${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.tsx`
        const converted = convertShadcnToQuartz({
            inputFile: tempFile,
            outputFile,
            componentName
        })

        // 결과 저장
        fs.writeFileSync(outputFile, converted)
        console.log(`✅ Converted ${componentName} -> ${outputFile}`)

        // 스타일 파일도 생성
        const scssFile = `quartz/components/ui/styles/${componentName}.scss`
        const scssContent = generateDefaultSCSS(componentName)
        fs.writeFileSync(scssFile, scssContent)
        console.log(`✅ Generated ${scssFile}`)

        // 임시 파일 삭제
        fs.unlinkSync(tempFile)

    } catch (error) {
        console.error(`❌ Failed to convert ${componentName}:`, error)
    }
}

/**
 * 기본 SCSS 파일 생성
 */
function generateDefaultSCSS(componentName: string): string {
    return `// ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} 컴포넌트 스타일
.quartz-${componentName} {
  // 기본 스타일들이 Tailwind CSS를 통해 적용됩니다
  // 필요시 추가 커스텀 스타일을 여기에 작성하세요
}
`
}

// CLI 실행
if (require.main === module) {
    const componentName = process.argv[2]

    if (!componentName) {
        console.log('Usage: ts-node convert-shadcn-to-quartz.ts <component-name>')
        console.log('Example: ts-node convert-shadcn-to-quartz.ts button')
        process.exit(1)
    }

    downloadAndConvert(componentName)
}

export { convertShadcnToQuartz, downloadAndConvert } 