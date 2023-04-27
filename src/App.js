import { useState } from "react"

const App = () => {
  const [images, setImages] = useState (null)
  const [value, setValue] = useState(null)
  const [error, setError] = useState(null)
  const surpriseOptions = [
    'A blue ostrich eating melon',
    'Cartoon drawing of a green Tokyo tower',
    'A pineapple sunbathing on an island'
  ]

  const surpriseMe = () => {
    setImages(null)
    const randomValue = surpriseOptions[Math.floor(Math.random()* surpriseOptions.length)]
    setValue(randomValue)
  }

  const getImages = async () => {
    setImages(null)
    if (value ===null) {
      setError('Error! Must have a search term')
      return
    }
    try {
        const options = {
          method: "POST",
          body: JSON.stringify({
            message: value,
          }),
          headers: {
            "Content-type": "application/json"
          }
        }
      const response = await fetch ('http://localhost:8000/images', options)
      const data = await response.json()
      console.log(data)
      setImages(data)
    } catch (error) {
      console.error(error)
    }
  }

  console.log(value)
  return (
    <div className="App">
      <section className="search-section">
        <h1>Perry's Image Generator</h1>
        <p>Start with a detailed description 
        <span className="surprise" onClick={surpriseMe}>Surprise me</span>
        </p>
        <div className="input-container">
          <input 
          value = {value}
          placeholder="Use your imagination...."
          onChange={e => setValue(e.target.value)}
          />
          <button onClick={getImages}>Generate</button>
        </div>
        <p className="extra-info">Or,  
        <span>
          <label htmlFor="files"> upload an image </label>
          <input id="files" accept="image/*" type="file" hidden/>
          </span> to edit.
          </p>
       {error && <p>{error}</p>}
      </section>
      <section className="image-section">
        {images?.map((image, _index) => (
          <img key={_index} src={image.url} alt={`Generated image of ${value}`}/>
        ))}
      </section>
    </div>
  )
}

export default App;
