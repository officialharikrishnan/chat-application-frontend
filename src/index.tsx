import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './Components/Pages/Login';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Signup from './Components/Pages/Signup';
import Profile from './Components/Pages/Profile';
import { Provider } from 'react-redux';
import store from './utils/store';
import { testEnc } from './utils/encrypt';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elementName: string]: any;
    }
  }
}
testEnc()

const router = createBrowserRouter([
  {
    path:'/',
    element:<Login/>
  },
  {
    path:'/chat/:id',
    element:<App/>
  },
  {
    path:'/signup',
    element:<Signup/>
  },
  {
    path:'/profile/:id',
    element:<Profile/>
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
  <RouterProvider router={router}/>
  </Provider>
);