"use client"
import "./App.css";
import { Toaster } from 'react-hot-toast';
import Login from "./pages/Default/page";
import 'semantic-ui-css/semantic.min.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <div className="App">
      <Login />
      <Toaster />
      <div className="color-halo-1"></div>
      <div className="color-halo-2"></div>
    </div >
  );

}

export default App;
