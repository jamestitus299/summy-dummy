import React, { ComponentPropsWithoutRef, CSSProperties, Fragment } from 'react'
import { Highlight } from 'prism-react-renderer'
import { Prism as defaultPrism } from 'prism-react-renderer'

import { Language, Theme, PrismLib } from './types'
import defaultTheme from './defaultTheme'

export type CodeBlockProps = Omit<
    ComponentPropsWithoutRef<'pre'>,
    'children'
> & {
    children?: string
    language?: Language
    theme?: Theme
    Prism?: PrismLib
    noWrapper?: boolean
    noWrap?: boolean
    padding?: number
}

export const CodeBlock = ({
    children,
    language = 'jsx',
    theme = defaultTheme,
    Prism = defaultPrism,
    padding = 10,
    noWrapper,
    noWrap,
    className: _className,
    style: _style,
    ...rest
}: CodeBlockProps) => {
    return (
        <Highlight
            code={children || ''}
            language={language}
            prism={Prism}
            theme={theme}
        >
            {({ className, style, tokens, getLineProps, getTokenProps }) => {
                const children = tokens.map((line, i) => {
                    // Destructure the key from line props
                    const { key: lineKey, ...restLineProps } = getLineProps({ line, key: i });
                    return (
                        <Fragment key={lineKey as React.Key}>
                            <span {...restLineProps}>
                                {line.map((token, key) => {
                                    // Destructure the key from token props
                                    const { key: tokenKey, ...restTokenProps } = getTokenProps({ token, key });
                                    return <span key={tokenKey as React.Key} {...restTokenProps} />;
                                })}
                            </span>
                            {'\n'}
                        </Fragment>
                    )
                })

                if (noWrapper) return <>{children}</>

                const wrapperStyle: CSSProperties = {
                    margin: 0,
                    padding: padding,
                    whiteSpace: noWrap ? 'pre' : 'pre-wrap',
                }
                return (
                    <pre
                        className={_className ? `${className} ${_className}` : className}
                        style={{ ...style, ...wrapperStyle, ..._style }}
                        {...rest}
                    >
                        {children}
                    </pre>
                )
            }}
        </Highlight>
    )
}
