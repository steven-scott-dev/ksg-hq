"use client";

import DailyLog from "@/components/modules/DailyLog";
import { useUser } from "@supabase/auth-helpers-react";
import Projects from '@/components/modules/Projects';
import Files from "@/components/modules/Files";

export default function KsgHq() {
  const user = useUser();

  return (
    <div className="space-y-8">
      <DailyLog user={undefined} />
      <Projects user={user} />
      <Files user={undefined} />
    </div>
  );
}


