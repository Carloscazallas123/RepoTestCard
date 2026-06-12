import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { InicioJuego } from './components/InicioJuego';
function App() {

  return (
    <Router>
      <Routes>
        <Route>
          {/* El Socket por Predeterminado esta en False */}
          <Route path="/" element={<InicioJuego isSocketActivo={false}/>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
