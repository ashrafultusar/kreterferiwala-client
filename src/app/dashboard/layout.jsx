'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminNav from './AdminNav';
import LoadingPage from '../loading';

export default function AdminLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login"); 
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setAuthenticated(true);
        setIsLoading(false);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router, pathname]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!authenticated) return null;

  return <AdminNav>{children}</AdminNav>;
}
