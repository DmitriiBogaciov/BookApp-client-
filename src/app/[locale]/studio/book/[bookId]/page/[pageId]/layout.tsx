import React from 'react';

export default async function StudioPageLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className=''>
            {children}
        </div>
    )
}