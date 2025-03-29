function App() {
  return (
    <>
      <input type="checkbox" checked={window.cordova !== undefined}/>
      <label>Cordova</label>
    </>
  )
}

export default App
