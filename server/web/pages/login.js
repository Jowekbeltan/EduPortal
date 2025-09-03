import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const router = useRouter();
  const submit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:4000/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    router.push('/dashboard');
  };
  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Log in</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Log in</button>
      </form>
    </main>
  );
}
