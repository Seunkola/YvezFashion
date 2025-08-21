// Profile 
import { Suspense } from 'react';
import ProfileContent from './profile-server';

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-black animate-spin" />
            <p>Loading profile...</p>
          </div>
        }
      >
        <ProfileContent />
      </Suspense>
    </div>
  );
}

