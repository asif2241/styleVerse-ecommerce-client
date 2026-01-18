import { Card, CardContent } from "@/components/ui/card";

export default function ProfilePageSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-8">
            <div className="animate-pulse space-y-6">
                <div className="h-8 w-40 bg-gray-200 rounded"></div>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex gap-6 items-center">
                            <div className="h-28 w-28 rounded-full bg-gray-200"></div>
                            <div className="space-y-3">
                                <div className="h-6 w-40 bg-gray-200 rounded"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 grid grid-cols-2 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                <div className="h-5 w-40 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
