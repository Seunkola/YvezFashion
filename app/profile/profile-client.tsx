'use client'

import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Customer } from '@/features/user/customer'
import { useQuery } from '@tanstack/react-query'

interface ProfileClientProps {
  customer: Customer | null
  error: Error | null
}

export default function ProfileClient({customer, error}: ProfileClientProps) {
    
    const router = useRouter();

    const {data: customerDetails, isLoading } = useQuery({
      queryKey: ['customer-details'],
      queryFn: () => {
        return customer;
      }
    });
    
    if(error) {
      toast.error(`Fetching User details failed: ${error.message}`)
      router.push('/');
    }

    if (isLoading) {
        <div className="flex items-center justify-center min-h-[50vh]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-t-transparent border-b-transparent border-gold rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-t-gold border-b-gold border-transparent rounded-full animate-spin-slow"></div>
        </div>
      </div>
    }

  if(customerDetails){
    return (
      <div className="p-4 max-w 2x1 mx-auto animate-fadeIn">
        <h1 className="text-2xl font-bold mb4">Welcome, {customerDetails.full_name}</h1>
        <div className="space-y-2 bg-gray-50 p-4 rounded shadow">
          <p><strong>Email:</strong> {customerDetails.email}</p>
          <p><strong>Phone:</strong> {customerDetails.phone}</p>
          <p><strong>Address:</strong> {customerDetails.address}</p>
        </div>
      </div>
    )
  }
}
