import React from 'react';
import { Truck, RefreshCcw, Gift, Headset } from 'lucide-react';

// StyleVerse primary color for accents
const primaryColor = 'text-yellow-500';

export default function ServiceFeaturesSection() {
    const features = [
        {
            icon: <Truck size={40} className={`${primaryColor} mb-4`} />,
            title: 'Worldwide Shipping',
            description: 'Fast and reliable delivery to over 200 countries. Enjoy free shipping on orders over $100.',
        },
        {
            icon: <RefreshCcw size={40} className={`${primaryColor} mb-4`} />,
            title: 'Money Back Guarantee',
            description: 'Shop with confidence. If you are not completely satisfied, return it within 30 days for a full refund.',
        },
        {
            icon: <Gift size={40} className={`${primaryColor} mb-4`} />,
            title: 'Offers And Discounts',
            description: 'Sign up for our newsletter to get exclusive deals, early access to sales, and special promotions.',
        },
        {
            icon: <Headset size={40} className={`${primaryColor} mb-4`} />,
            title: '24/7 Support Services',
            description: 'Our dedicated support team is available around the clock to assist you with any questions or concerns.',
        },
    ];

    return (
        <section className="py-16 px-4 md:px-8 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our Commitment to You
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Experience the best in fashion with services designed to make your StyleVerse journey seamless and enjoyable.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center p-6 transition-transform duration-300 hover:-translate-y-2 rounded-xl">
                            {feature.icon}
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}