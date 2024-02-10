import React from 'react';
import ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query' // managing the state and behavior of queries within your React application
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools' //This will help us to create a dev tool
import { AuthProvider } from './AuthContext/AuthContext';
import {loadStripe} from "@stripe/stripe-js"; // just for public keys, not for the React, so there is no React here
import { Elements } from "@stripe/react-stripe-js";


const root = ReactDOM.createRoot(document.getElementById('root'));

//Stripe configuration
const stripePromise = loadStripe(
  "pk_test_51OdgvkIWXx3y9REs2JbKb8wGspRmLqkRIDaJr4BCfJZffE1WGdEBtf3sqsXdS9IRJeBbmCN6J192cKikhvth8pic00aRopanEu"
);
const options = {
  mode: "payment",
  currency: "usd",
  amount: 1099,
};

// React query client
const queryClient = new QueryClient();

// allow the class access to the AuthProvider
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Elements stripe={stripePromise} options={options}> 
          <App />
        </Elements>
      </AuthProvider>
   
      <ReactQueryDevtools initialIsOpen={false} />  
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
