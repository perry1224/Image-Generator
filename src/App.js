import { useState } from "react"
import Modal from "./components/Modal"
import Typewriter from 'typewriter-effect';

const App = () => {
  const [images, setImages] = useState (null)
  const [value, setValue] = useState(null)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const surpriseOptions = [
    'A blue ostrich eating melon',
    'Cartoon drawing of a green Tokyo tower',
    'A pineapple sunbathing on an island',
    'Rainbow french croissant',
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

const uploadImage = async(e) => {
  console.log(e.target.files[0])

  const formData = new FormData()
  formData.append('file', e.target.files[0])
  setModalOpen(true)
  setSelectedImage(e.target.files[0])
  e.target.value = null
    try {
      const options = {
        method: "POST",
        body: formData
      }
   const response = await fetch('http://localhost:8000/upload', options)
   const data = await response.json()
   console.log(data)
    } catch (error) {
      console.error(error)
   
    } 
}

const generateVariations = async() => {
  setImages(null)
  if (selectedImage===null) {
    setError('Error! Must have an existing image')
    setModalOpen(false)
    return
  }
      try {
       const options = {
          method: 'POST'
       }
        const response = await fetch("http://localhost:8000/variations", options)
        const data = await response.json()
        setImages(data)
        setError(null)
        setModalOpen(false)
      } catch(error){
        console.error(error)
      }
}

  console.log(value)
  return (
    <div className="App">
      <section className="search-section">
      <Typewriter className="typewriter"
          onInit={(typewriter) => {
            typewriter
              .typeString("Welcome to Perry's Image Generator")
              .pauseFor(1000)
              .start();
          }}
          
        />
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
          <label htmlFor="files">  upload  </label>
          <input onChange={uploadImage} id="files" accept="image/*" type="file" hidden/>
          </span>   an image to edit.
          </p>
       {error && <p>{error}</p>}
       {modalOpen && <div className="overlay">
        <Modal 
          setModalOpen={setModalOpen} 
          setSelectedImage={setSelectedImage} 
          selectedImage={selectedImage}
          generateVariations={generateVariations}/>
       </div>}
      </section>
      <section className="image-section">
        {images?.map((image, _index) => (
          <img key={_index} src={image.url} alt={`Generated ${value}`}/>
        ))}
      </section>
    </div>
  )
}

export default App;
