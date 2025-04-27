import { useId } from 'react'
import './App.css'

function App() {
  const queryInputId = useId();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    // // Read the form data
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());

    const extensionId = 'fkohmljcbmaeoimogkgaijccidjcdgeh';

    chrome.runtime.sendMessage(extensionId, formJson, (response: any) => {
      console.log('Products from supplier:', response)
    });
  }

  return (
    <>
      <form method="get" onSubmit={handleSubmit}>
        <h1>Chem Crawler</h1>
        <div className="card">
          Query for stuff
        </div>
        <p className="read-the-docs">
          <label htmlFor={queryInputId}>Query: </label>
          <input id={queryInputId} name="query" type="search" />
        </p>
      </form>
    </>
  )
}

export default App
