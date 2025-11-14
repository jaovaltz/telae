import './App.css'

function App() {
  return (
    <div className="app-container">
      <div className="hello-world-wrapper">
        <h1 className="hello-world-text">
          <span className="letter letter-1">H</span>
          <span className="letter letter-2">e</span>
          <span className="letter letter-3">l</span>
          <span className="letter letter-4">l</span>
          <span className="letter letter-5">o</span>
          <span className="space"> </span>
          <span className="letter letter-6">W</span>
          <span className="letter letter-7">o</span>
          <span className="letter letter-8">r</span>
          <span className="letter letter-9">l</span>
          <span className="letter letter-10">d</span>
          <span className="letter letter-11">!</span>
        </h1>
        <div className="subtitle-wrapper">
          <p className="subtitle">Bem-vindo ao React</p>
        </div>
      </div>
      <div className="particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>
    </div>
  )
}

export default App
