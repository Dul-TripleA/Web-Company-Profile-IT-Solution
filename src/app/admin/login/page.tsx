import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getCurrentUser } from '@/features/admin/auth';
import { LoginForm } from '@/features/admin/components/login-form';

export const metadata: Metadata = { title: 'Masuk' };

// Bagian yang membaca cookie dipisah agar kerangka halaman tetap statis.
async function RedirectIfSignedIn() {
  if (await getCurrentUser()) redirect('/admin');
  return null;
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-forest-deep p-4 sm:p-6">
      <Suspense>
        <RedirectIfSignedIn />
      </Suspense>
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
        <div className="relative hidden flex-col justify-between bg-forest p-10 text-white md:flex">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
          <Image
            src="/images/logo/logo-full.png"
            alt="Do It"
            width={886}
            height={293}
            className="relative h-10 w-auto self-start"
          />
          <div className="relative space-y-3">
            <p className="text-3xl font-extrabold tracking-tight">
              Kelola situs <span className="text-brand">Do It</span> di satu tempat.
            </p>
            <p className="text-sm text-slate-300">
              Artikel blog, kategori, dan pesan dari calon klien.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-6 flex md:hidden">
            <span className="rounded-xl bg-forest-deep px-3 py-2">
              <Image
                src="/images/logo/logo-full.png"
                alt="Do It"
                width={886}
                height={293}
                className="h-7 w-auto"
              />
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Masuk admin</h1>
          <p className="mt-1 mb-6 text-sm text-slate-600">Gunakan email atau username akun Anda.</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
