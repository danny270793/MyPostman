import { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, MouseEventHandler, useState } from 'react';
import './styles/w3css.css'

function App() {
  const methods: string[] = [
    'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'
  ]

  const [method, setMethod] = useState<string>('GET')
  const onMethodChange: ChangeEventHandler<HTMLSelectElement> = (event: ChangeEvent<HTMLSelectElement>) => {
    setMethod(event.target.value)
  }

  const [url, setUrl] = useState<string>('')
  const onUrlChange: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value)
  }

  const onFormSubmit: FormEventHandler<HTMLFormElement> = (event: FormEvent) => {
    event.preventDefault()

    alert(`${method} ${url}`)
  }

  return (
    <>
      <form onSubmit={onFormSubmit}>
        <select className="w3-select w3-border" value={method} onChange={onMethodChange}>
          {methods.map(method => <option value={method} key={method}>
            {method}
          </option>)}
        </select>
        <input className="w3-input w3-border" type="text" placeholder="URL" value={url} onChange={onUrlChange}/>
        <button className='w3-button w3-blue'>
          Send
        </button>
      </form>
    </>
  )
}

export default App
