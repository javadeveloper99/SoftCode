import React, { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

export default function MessageBubble({ message, isUser }) {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [codeCopied, setCodeCopied] = useState({})
  const codeBlockCounterRef = useRef(0)

  const handleCopy = async (text) => {
    try {
      // Strip markdown formatting for plain text copy
      const plainText = text
        .replace(/```[\s\S]*?```/g, (match) => {
          // Extract code from code blocks
          return match.replace(/```[\w]*\n?/g, '').replace(/```/g, '')
        })
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/#{1,6}\s+/g, '')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .trim()
      await navigator.clipboard.writeText(plainText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const copyCodeBlock = async (code, language, blockId) => {
    try {
      await navigator.clipboard.writeText(code)
      setCodeCopied(prev => ({ ...prev, [blockId]: true }))
      setTimeout(() => {
        setCodeCopied(prev => ({ ...prev, [blockId]: false }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  // Reset counter for each message render
  codeBlockCounterRef.current = 0

  return (
    <div 
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-from to-primary-to text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
          AI
        </div>
      )}
      <div className={`relative ${isUser ? 'max-w-[70%]' : 'max-w-[75%]'} flex flex-col`}>
        <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-ai'} ${isUser ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm'} p-4`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Code blocks with syntax highlighting
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                const codeString = String(children).replace(/\n$/, '')
                const blockId = `code-${++codeBlockCounterRef.current}`
                
                if (!inline && match) {
                  return (
                    <div className="code-block-wrapper">
                      <div className="code-block-header">
                        <span className="code-language">{match[1]}</span>
                        <button
                          onClick={() => copyCodeBlock(codeString, match[1], blockId)}
                          className="copy-code-btn"
                          title="Copy code"
                          aria-label="Copy code"
                        >
                          {codeCopied[blockId] ? '✓ Copied' : '📋 Copy'}
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="code-block"
                        customStyle={{
                          margin: 0,
                          borderRadius: '0 0 0.5rem 0.5rem',
                        }}
                        {...props}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  )
                }
                
                // Inline code
                return (
                  <code className="inline-code" {...props}>
                    {children}
                  </code>
                )
              },
              // Links open in new tab
              a({ node, ...props }) {
                return <a target="_blank" rel="noopener noreferrer" className="markdown-link" {...props} />
              },
              // Lists
              ul({ node, ...props }) {
                return <ul className="markdown-list" {...props} />
              },
              ol({ node, ...props }) {
                return <ol className="markdown-list markdown-list-ordered" {...props} />
              },
              li({ node, ...props }) {
                return <li className="markdown-list-item" {...props} />
              },
              // Headings
              h1({ node, ...props }) {
                return <h1 className="markdown-h1" {...props} />
              },
              h2({ node, ...props }) {
                return <h2 className="markdown-h2" {...props} />
              },
              h3({ node, ...props }) {
                return <h3 className="markdown-h3" {...props} />
              },
              // Paragraphs
              p({ node, ...props }) {
                return <p className="markdown-p" {...props} />
              },
              // Bold text
              strong({ node, ...props }) {
                return <strong className="markdown-strong" {...props} />
              },
              // Italic text
              em({ node, ...props }) {
                return <em className="markdown-em" {...props} />
              },
              // Blockquotes
              blockquote({ node, ...props }) {
                return <blockquote className="markdown-blockquote" {...props} />
              },
              // Horizontal rule
              hr({ node, ...props }) {
                return <hr className="markdown-hr" {...props} />
              },
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
        {/* Copy button - visible on hover (desktop) or always (mobile) */}
        <button
          onClick={() => handleCopy(message.text)}
          className={`copy-message-btn ${hovered || copied ? 'opacity-100' : 'opacity-0'} md:${hovered || copied ? 'opacity-100' : 'opacity-0'} ${copied ? 'copied' : ''}`}
          title={copied ? 'Copied ✓' : 'Copy message'}
          aria-label="Copy message"
        >
          {copied ? '✓' : '📋'}
        </button>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
          U
        </div>
      )}
    </div>
  )
}

