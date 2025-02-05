"use client"
import { SignIn, useUser } from '@clerk/nextjs'
import React from 'react'


// const Signin = () => {
//   return (
//     <SignIn
     
//     />
//   )
// }

// export default Signin

import { redirect } from 'next/navigation';

const Signin = () => {
  const { user } = useUser();  // Get the user object to check if signed in

  if (user) {
    // Redirect server-side if the user is signed in
    redirect('/');
  }

  return <SignIn />;
};

export default Signin;
