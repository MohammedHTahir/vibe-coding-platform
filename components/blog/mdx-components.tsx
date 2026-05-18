import type { ReactNode, AnchorHTMLAttributes } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

function isExternal(href?: string) {
  return !!href && /^https?:\/\//.test(href)
}

function MdxLink({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (!href) return <span {...rest}>{children}</span>
  if (isExternal(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-600 underline underline-offset-4"
        {...rest}
      >
        {children}
      </a>
    )
  }
  return (
    <Link
      href={href}
      className="text-blue-500 hover:text-blue-600 underline underline-offset-4"
    >
      {children}
    </Link>
  )
}

export const mdxComponents = {
  h1: ({ children }: { children: ReactNode }) => (
    <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mt-12 mb-4">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <h2 className="text-2xl sm:text-[1.6rem] font-medium tracking-tight text-gray-900 mt-12 mb-3">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className="text-lg font-medium text-gray-900 mt-8 mb-2">{children}</h3>
  ),
  p: ({ children }: { children: ReactNode }) => (
    <p className="text-[15px] leading-7 text-gray-700 my-4">{children}</p>
  ),
  ul: ({ children }: { children: ReactNode }) => (
    <ul className="list-disc pl-6 my-4 space-y-1.5 text-[15px] text-gray-700">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: ReactNode }) => (
    <ol className="list-decimal pl-6 my-4 space-y-1.5 text-[15px] text-gray-700">
      {children}
    </ol>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="leading-7">{children}</li>
  ),
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className="border-l-2 border-blue-400 pl-4 text-[15px] text-gray-600 italic my-6">
      {children}
    </blockquote>
  ),
  code: ({ children, className }: { children: ReactNode; className?: string }) => (
    <code
      className={cn(
        'rounded-md bg-[#EDEDED] px-1.5 py-0.5 font-mono text-[13px] text-gray-900',
        className
      )}
    >
      {children}
    </code>
  ),
  pre: ({ children }: { children: ReactNode }) => (
    <pre className="rounded-2xl border border-black/5 bg-white overflow-x-auto p-4 my-6 text-[13px] leading-6 font-mono text-gray-900">
      {children}
    </pre>
  ),
  a: MdxLink,
  hr: () => <hr className="my-12 border-black/10" />,
  table: ({ children }: { children: ReactNode }) => (
    <div className="my-6 overflow-x-auto rounded-2xl border border-black/5 bg-white">
      <table className="w-full text-[14px]">{children}</table>
    </div>
  ),
  th: ({ children }: { children: ReactNode }) => (
    <th className="px-4 py-3 text-left text-gray-900 font-medium border-b border-black/5">
      {children}
    </th>
  ),
  td: ({ children }: { children: ReactNode }) => (
    <td className="px-4 py-3 text-gray-700 border-b border-black/5">
      {children}
    </td>
  ),
}
