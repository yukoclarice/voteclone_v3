import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import Layout from './components/Layout'
import Home from './pages/Home'
import Vote from './pages/Vote'
import { ProvinceProvider } from './context/ProvinceContext'

// Import NProgress styles
import './styles/nprogress-custom.css'
import 'nprogress/nprogress.css'

function App() {
  return (
    <Provider store={store}>
      <ProvinceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="vote" element={<Vote />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProvinceProvider>
    </Provider>
  )
}

export default App
