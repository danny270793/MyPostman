function App() {
  return (
    <>
      <label>Cordova</label>
      <input type="checkbok" value={`${window.cordova !== undefined}`} />
    </>
  )
}

export default App
