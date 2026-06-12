import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { InicioJuego } from './components/InicioJuego';
import { TableroJuego } from './components/TableroJuego';
function App() {

  return (
    <Router>
      <Routes>
        <Route>
          {/* El Socket por Predeterminado esta en False */}
          <Route path="/" element={<InicioJuego isSocketActivo={false}/>}/>
          <Route path="/juego" element={<TableroJuego/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
