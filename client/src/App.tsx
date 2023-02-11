import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import { LandingPage } from './features/components/LandingPage';
import {Navbar}  from './features/components/common/Navbar'
import { Pagination } from './features/components/common/Pagination';
import { Trending } from './features/components/Trending';
import { TopPicks } from './features/components/TopPicks';
import { TopRated } from './features/components/TopRated';
import { ULogin } from './features/components/User/ULogin';
import { HLogin } from './features/components/Host/HLogin';
import {  HostSignUp} from './features/components/Host/HostSignUp';
import { MyFavourites } from './features/components/User/MyFavourites';
import { SearchListing } from './features/components/SearchListing';
import { ViewDetails } from './features/components/ViewDetails';
import { MyUserProfile } from './features/components/User/MyUserProfile';
import { MyHostProfile } from './features/components/Host/MyHostProfile';
import { MyListing } from './features/components/Host/MyListing';
import { UpdateListingPage } from './features/components/Host/UpdateListingPage';
import { StripePayment } from './features/components/User/StripePayment';
import { MyBookings } from './features/components/User/MyBookings';
import { UChangePassword } from './features/components/User/UChangePassword';
import { HChangePassword } from './features/components/Host/HChangePassword';
import {  USignUp } from './features/components/User/USignUp';
import { VerifyHostEmail } from './features/components/Host/VerifyHostEmail';
import { UForgotPassword } from './features/components/User/UForgotPassword';

import { HForgotPassword } from './features/components/Host/HForgotPassword';

import { UserFChangePassword } from './features/components/User/UserFChangePassword';
import { HostFChangePassword } from './features/components/Host/HostFChangePassword';
import { VerifyUserEmail } from './features/components/User/VerifyUserEmail';

// import { AdvanceFiltersModal } from './features/AdvanceFiltersModal';

function App() {

 
  return (
    <>
     <Navbar />
    <div className="App">
    <div className='customContainer'>
    <div className='row justify-content-center'> 
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/trending' element={<Trending />} />
      <Route path='/topPicks' element={<TopPicks />} />
      <Route path='/topRated' element={<TopRated />} />
      <Route path='/searchListing' element={<SearchListing />} />
      <Route path='/viewDetails' element={<ViewDetails />} />
      <Route path='/user/login' element={<ULogin />} />
      <Route path='/user/signUp' element={<USignUp />} />
      <Route path='/user/verifyEmail' element={<VerifyUserEmail />} />
      <Route path='/user/forgotPassword' element={<UForgotPassword />} />
      <Route path='/user/enterVerificationCode' element={<UserFChangePassword />} />
     
      <Route path='/user/changePassword' element={<UChangePassword />} />
      <Route path='/user/favourites' element={<MyFavourites />} />
      <Route path='/user/MyUserProfile' element={<MyUserProfile />} />
      <Route path='/user/payment' element={<StripePayment />} />
      <Route path='/user/bookings' element={<MyBookings />} />
      <Route path='/host/MyHostProfile' element={<MyHostProfile />} />
      <Route path='/host/MyListing' element={<MyListing />} />
      <Route path='/host/UpdateListing' element={<UpdateListingPage />} />
      <Route path='/host/login' element={<HLogin />} />
      <Route path='/host/signUp' element={<HostSignUp />} />
      <Route path='/host/verifyEmail' element={<VerifyHostEmail/>} />
      <Route path='/host/forgotPassword' element={<HForgotPassword/>} />
      <Route path='/host/enterVerificationCode' element={<HostFChangePassword/>} />
      
      <Route path='/host/changePassword' element={<HChangePassword />} />

     
      
      </Routes>
    </div>
    </div>
   
    </div>
    </>
  );
}

export default App;
 