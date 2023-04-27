import { useState, useRef } from "react"

const Modal = ({setModalOpen, setSelectedImage, selectedImage, generateVariations}) => {
  const [error, setError] = useState(null)
   const ref = useRef(null)

  const closeModal = () => {
    setModalOpen(false)
    setSelectedImage(null)
  }

  const checkSize = () => {
    if ((ref.current.width === 256 && ref.current.height === 256) || 
        (ref.current.width === 512 && ref.current.height === 512)) {
      generateVariations()
    } else {
      setError('Error: Choose an image size of 256x256 or 512x512')
    }
  }
  return (
    <div className="modal">
      <div onClick={closeModal}>✖</div>
      <div className="img-container">
        {selectedImage && <img ref={ref} src={URL.createObjectURL(selectedImage)} alt =""/>}
      </div>
      <p>{error || "* Image must be 256x256 or 512x512"}</p>
      {!error && <button onClick={checkSize}>Generate</button>}
      {error && <button onClick={closeModal}>Close this and try again</button>}
    </div>
  )
}

export default Modal