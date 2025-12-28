import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

export default function MessageBubble({ message, isUser }) {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleCopy = async (text) => {
    try {
      // Strip markdown formatting for plain text copy
      const plainText = text.replace(/```[\s\S]*?```/g, '').replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1')
      await navigator.clipboard.writeText(plainText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const copyCodeBlock = async (code, language) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div 
      className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-from to-primary-to text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
          AI
        </div>
      )}
      <div className={`relative ${isUser ? 'max-w-[70%]' : 'max-w-[75%]'}`}>
        <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-ai'} ${isUser ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm'}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Code blocks with syntax highlighting
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                const codeString = String(children).replace(/\n$/, '')
                
                if (!inline && match) {
                  return (
                    <div className="code-block-wrapper">
                      <div className="code-block-header">
                        <span className="code-language">{match[1]}</span>
                        <button
                          onClick={() => copyCodeBlock(codeString, match[1])}
                          className="copy-code-btn"
                          title="Copy code"
                          aria-label="Copy code"
                        >
                          {copied ? '✓ Copied' : '📋 Copy'}
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="code-block"
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
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
        {/* Copy button - visible on hover (desktop) or always (mobile) */}
        <button
          onClick={() => handleCopy(message.text)}
          className={`copy-message-btn ${hovered ? 'opacity-100' : 'opacity-0 md:opacity-0'} ${copied ? 'copied' : ''}`}
          title={copied ? 'Copied!' : 'Copy message'}
          aria-label="Copy message"
        >
          {copied ? '✓' : '📋'}
        </button>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
          {message.sender === 'user' ? 'U' : 'AI'}
        </div>
      )}
    </div>
  )
}

