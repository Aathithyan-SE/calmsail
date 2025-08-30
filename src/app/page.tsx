import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function Home() {
  const user = await getCurrentUser();
  
  if (user) {
    if (user.role === 'management') {
      redirect('/dashboard/management');
    } else {
      redirect('/dashboard/employee');
    }
  } else {
    redirect('/landing');
  }
}
