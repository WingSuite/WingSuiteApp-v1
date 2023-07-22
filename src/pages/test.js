import ReactMarkdown from 'react-markdown'

export default function MyComponent() {
  const markdown = `# This is a header
  ## This is a smaller header
  Here's some **bold** text.
  `

  return (
    <div className='p-10'>
      <ReactMarkdown className="prose">{markdown}</ReactMarkdown>
    </div>
  )
}