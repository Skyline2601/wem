// This route exists so expo-router registers /demo
// The actual demo is served as a static HTML file via vercel.json rewrite
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
export default function DemoRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/'); }, []);
  return null;
}
