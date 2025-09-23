export interface Customer {
  full_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city?: string | null;
  country?: string | null;
  postal_code?: string | null;
  created_at: string;
}
