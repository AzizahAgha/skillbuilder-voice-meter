import { AuthContext as AuthC } from "@contexts/AuthContext";
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AppLayout({ children }) {
  const AuthContext = React.useContext(AuthC);
  const router = useRouter();

  useEffect(() => {
      document.body.className = AuthContext.auth?.isAuthenticated ? 'is-authenticated' : '';
  });
  
  useEffect(() => {
    const handler = () => router.push((AuthContext.auth?.isAuthenticated) ? '/dashboard' : '/');
   
    const headerLogo = document.getElementById('header_logo');
    
    headerLogo?.addEventListener('click', handler)
  
    return () => {
      headerLogo?.removeEventListener('click', handler)
    }
  })

  return (
    <>{children}</>
  )
}
