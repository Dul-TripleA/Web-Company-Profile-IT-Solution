import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getCurrentUser } from '@/features/admin/auth';
import { LoginForm } from '@/features/admin/components/login-form';
import { CARD } from '@/features/admin/components/ui';

export const metadata: Metadata = { title: 'Masuk' };

// Bagian yang membaca cookie dipisah agar kerangka halaman tetap statis.
async function RedirectIfSignedIn() {
  if (await getCurrentUser()) redirect('/admin');
  return null;
}

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-12">
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
      <div className={CARD}>
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-forest">Masuk admin</h1>
        <p className="mb-5 text-sm text-slate-700">Area khusus tim Do It.</p>
        <LoginForm />
      </div>
    </main>
  );
}
