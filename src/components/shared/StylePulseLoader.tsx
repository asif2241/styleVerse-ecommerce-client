"use client";
import { ShoppingBag } from "lucide-react";

interface StylePulseLoaderProps {
    text?: string;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    animated?: boolean;
}

const SIZE_CLASSES = {
    sm: { container: "w-20 h-20", text: "text-[10px]", icon: 20 },
    md: { container: "w-32 h-32", text: "text-[14px]", icon: 32 },
    lg: { container: "w-48 h-48", text: "text-[18px]", icon: 48 },
    xl: { container: "w-64 h-64", text: "text-[24px]", icon: 64 },
} as const;

export default function StylePulseLoader({
    text = "StyleVerse is preparing...",
    size = "md",
    className = "",
    animated = true,
}: StylePulseLoaderProps) {
    const { container, text: textSize, icon: iconSize } = SIZE_CLASSES[size];

    return (
        <div className={`flex flex-col items-center gap-6 ${className} justify-center min-h-screen bg-white`}>
            <style jsx>{`
        @keyframes ring-expand {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        @keyframes bag-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes text-shimmer {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }

        .ring-animation {
          animation: ring-expand 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .bag-animation {
          animation: bag-bounce 2s ease-in-out infinite;
        }

        .shimmer-text {
          animation: text-shimmer 2s ease-in-out infinite;
          letter-spacing: 0.05em;
        }
      `}</style>

            <div className={`relative ${container} flex items-center justify-center`}>
                {/* Animated Background Rings */}
                {animated && (
                    <>
                        <div className="ring-animation absolute inset-0 rounded-full border border-zinc-200" />
                        <div className="ring-animation absolute inset-0 rounded-full border border-zinc-100" style={{ animationDelay: '0.5s' }} />
                    </>
                )}

                {/* Central Icon Container */}
                <div className="relative z-10 bg-white p-4 rounded-full shadow-sm border border-zinc-50">
                    <div className={animated ? "bag-animation" : ""}>
                        <ShoppingBag
                            size={iconSize}
                            className="text-zinc-900"
                            strokeWidth={1.5}
                        />
                    </div>
                </div>

                {/* Decorative Progress Dot */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-zinc-900 rounded-full" />
            </div>

            {/* Branding Text */}
            <div className="space-y-1 text-center">
                <h2 className={`font-bold text-zinc-900 uppercase tracking-tighter ${size === 'xl' ? 'text-3xl' : 'text-xl'}`}>
                    StyleVerse
                </h2>
                {text && (
                    <p className={`${textSize} text-zinc-500 font-medium shimmer-text`}>
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
}