import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.less';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyLogin from './myComponent/myLogin';
import CusLogin from './myComponent/cusLogin';

const root = ReactDOM.createRoot(document.getElementById('root'));
const NotFound = () => {
  return <div>Not exist</div>
}
root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<MyLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();