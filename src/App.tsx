import { Route, Routes } from 'react-router-dom'
import Login from './pages/superadmin/Login'
import { Toaster } from './components/ui/toaster'
import Dashboard from './pages/superadmin/Dashboard'
function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login></Login>}></Route>
         <Route path="/superadmin" element={<Dashboard></Dashboard>}></Route>
         <Route path="/superadmin/managers" element={<Dashboard></Dashboard>}></Route>
         <Route path="/superadmin/addmanager" element={<Dashboard></Dashboard>}></Route>
         <Route path="/superadmin/editmanager/:managerid" element={<Dashboard></Dashboard>}></Route>
         <Route path="/superadmin/myprofile" element={<Dashboard></Dashboard>}></Route>
      </Routes>
    </>
  )
}

export default App
