'use client'

import { useState } from "react";
import { adminSignup } from "@/features/auth/auth.service"; 
import toast from "react-hot-toast";

export default function AdminRegisterForm(){
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const form = e.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const full_name = (form.elements.namedItem("full_name") as HTMLInputElement).value;

        const { signUpError } = await adminSignup(email, password, full_name);

        setLoading(false);
        if(signUpError) {
            toast.error(signUpError.message);
        }
        else {
            toast.success("Admin user created successfully!");
            setSuccess(true);
        }
    }

    if (success) {
        return <p className="p-4 text-green-600">Admin registration successful! Verify Registration on email to complete registration process</p>;
    }
    else {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
                <h1 className="mb-6 text-2xl font-bold">Create an Admin Account</h1>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                <input 
                    name="full_name" 
                    placeholder="Full Name" 
                    className="w-full rounded border p-2" 
                    required 
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    className="w-full rounded border p-2" 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    className="w-full rounded border p-2" 
                    required 
                />
                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Register as Admin"}
                </button>
                </form>
                </div>
            </div>
        )
    }
}  