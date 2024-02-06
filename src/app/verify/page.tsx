'use client'

import Link from 'next/link'

export default function Verify() {

    return (
        <div className="container flex flex-col justify-content-center align-items-center">
            <h2>Please verify you email</h2>
            <Link href="/api/auth/login">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-3"

                >
                    Verified
                </button>
            </Link>
        </div>
    )
}