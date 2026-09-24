'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CompetitionRoute() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/?view=competition');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh] text-slate-500 text-xs">
      Loading competition details...
    </div>
  );
}
