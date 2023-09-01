"use client"
import React, { useEffect } from 'react';
import ROUTE_MAP from '../services/routing/routeMap';
import { useRouter } from 'next/navigation'

const SuccessPopup = ({ onClose }) => {
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
            router.push(ROUTE_MAP.assessment_type);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    return (
        <div className="fixed z-10 inset-0 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Form Submitted Successfully!</h2>
                <p className="text-gray-700">Thank you for submitting the form.</p>
            </div>
        </div>
    );
};

export default SuccessPopup;
