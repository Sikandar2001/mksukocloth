'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/app/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect } from 'react';

export default function SignUpPage() {
  const { user, loading: authLoading } = useAuth();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/profile');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    );
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Save additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: name,
        email: email,
        phone: phone,
        createdAt: new Date(),
      });

      router.push('/'); // Redirect to home after signup
    } catch (err: any) {
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to log in with Google.');
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-extrabold tracking-tight uppercase">Create Account</h1>
      <div className="mt-2 text-xs text-zinc-500 text-right uppercase tracking-widest">*Mandatory fields</div>

      {error && (
        <div className="mt-4 rounded bg-red-50 p-3 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSignUp} className="mx-auto mt-6 max-w-xl space-y-5">
        <div>
          <label htmlFor="name" className="sr-only">Full Name</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name *"
            className="w-full rounded border border-zinc-400 px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-black transition-colors"
          />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your e-mail address *"
            className="w-full rounded border border-zinc-400 px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-black transition-colors"
          />
        </div>
        <div>
          <label htmlFor="phone" className="sr-only">Phone Number</label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number *"
            className="w-full rounded border border-zinc-400 px-4 py-3 text-sm outline-none placeholder:text-zinc-400 focus:border-black transition-colors"
          />
        </div>
        <div className="relative">
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            type={show ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password *"
            className="w-full rounded border border-zinc-400 px-4 py-3 pr-10 text-sm outline-none placeholder:text-zinc-400 focus:border-black transition-colors"
          />
          <button
            type="button"
            aria-label="Toggle password visibility"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-600 hover:bg-black/5"
          >
            {show ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        
        <p className="text-xs text-zinc-500">
          By creating an account, you agree to our Terms & Conditions and Privacy Policy.
        </p>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full rounded bg-black py-4 text-white font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'create account'}
        </button>

        <div className="mx-auto flex items-center gap-4">
          <div className="h-px flex-1 bg-zinc-300" />
          <span className="text-sm font-bold">OR</span>
          <div className="h-px flex-1 bg-zinc-300" />
        </div>

        <button 
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-2 rounded border border-zinc-400 py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt=""
            className="size-5"
          />
          <span>log In with google</span>
        </button>
      </form>

      <div className="mx-auto mt-8 flex max-w-xl items-center gap-4">
        <div className="h-px flex-1 bg-zinc-300" />
        <span className="text-sm font-bold">ALREADY A MEMBER?</span>
        <div className="h-px flex-1 bg-zinc-300" />
      </div>

      <div className="mx-auto mt-6 max-w-xl">
        <Link href="/login" className="block w-full text-center rounded border border-zinc-400 py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors">
          Log In
        </Link>
      </div>
    </main>
  );
}
