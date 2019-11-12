import React from 'react'
import {render} from 'react-dom'
import "./index.css";
import { SearchPanel } from './components/SearchPanel';
const App = () => {
    return <SearchPanel></SearchPanel>
}


render(
    <App/>,
    document.getElementById('app')
)

export default App