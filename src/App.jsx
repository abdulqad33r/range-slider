import "./App.css"
import Slider from "./components/Slider"

function App() {
  return (
    <div
      className="slider-container"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <Slider />
    </div>
  )
}

export default App
