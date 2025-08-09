import React from 'react';

export default async function StudioBookLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ bookId: string }>;
}) {

    return (
        <div className="h-full">
                {children}
        </div>
    )
}