import { getCompanion } from "@/lib/actions/companion.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSubjectColor } from "@/lib/utils";
import Image from "next/image";
import CompanionComponent from "@/components/CompanionComponent";

interface CompanionSessionPageProps {
    params: Promise<{ id: string }>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
    try {
        const { id } = await params;
        const user = await currentUser();

        if (!user) redirect('/sign-in');

        const companion = await getCompanion(id);

        // Check if companion exists and has required properties
        if (!companion || !companion.name || !companion.subject || !companion.topic) {
            console.error('Companion data is incomplete:', companion);
            redirect('/companions');
        }

        const { name, subject, topic, duration } = companion;

        return (
            <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Card */}
                    <article className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-primary/20 p-6 mb-8 transition-all duration-300 hover:shadow-xl">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* Left Section - Companion Info */}
                            <div className="flex items-center gap-4 flex-1">
                                {/* Subject Icon */}
                                <div 
                                    className="size-20 lg:size-24 flex items-center justify-center rounded-2xl shadow-lg border-2 border-white transition-all duration-300 hover:scale-105"
                                    style={{ backgroundColor: getSubjectColor(subject) }}
                                >
                                    <Image 
                                        src={`/icons/${subject}.png`} 
                                        alt={subject} 
                                        width={40} 
                                        height={40} 
                                        className="lg:w-12 lg:h-12 filter brightness-0 invert drop-shadow-md"
                                    />
                                </div>

                                {/* Text Info */}
                                <div className="flex flex-col gap-3 flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <h1 className="font-bold text-2xl lg:text-3xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                            {name}
                                        </h1>
                                        <div className="flex items-center gap-3">
                                            <div className="subject-badge text-sm lg:text-base px-4 py-2 rounded-2xl shadow-md bg-gradient-to-r from-primary to-primary-hover text-white font-semibold">
                                                {subject}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                                        {topic}
                                    </p>
                                </div>
                            </div>

                            {/* Right Section - Duration */}
                            <div className="flex flex-col items-center lg:items-end gap-3 border-t lg:border-t-0 lg:border-l border-primary/20 pt-4 lg:pt-0 lg:pl-6 lg:min-w-[140px]">
                                <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl px-4 py-3 border-2 border-primary/20">
                                    <div className="animate-spin-slow">
                                        <Image 
                                            src="/icons/chronometer.png" 
                                            alt="duration" 
                                            width={20} 
                                            height={20} 
                                            className="filter brightness-0 invert"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <span className="font-bold text-2xl lg:text-3xl text-primary block leading-none">
                                            {duration}
                                        </span>
                                        <span className="text-sm lg:text-base text-gray-600 font-medium whitespace-nowrap">
                                            minutes
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 text-center lg:text-right">
                                    Estimated session time
                                </p>
                            </div>
                        </div>

                        {/* Mobile Duration - Hidden on desktop */}
                        <div className="flex lg:hidden items-center justify-center gap-3 mt-4 pt-4 border-t border-primary/20">
                            <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl px-4 py-2 border-2 border-primary/20">
                                <div className="animate-spin-slow">
                                    <Image 
                                        src="/icons/chronometer.png" 
                                        alt="duration" 
                                        width={16} 
                                        height={16} 
                                        className="filter brightness-0 invert"
                                    />
                                </div>
                                <div className="text-center">
                                    <span className="font-bold text-xl text-primary block leading-none">
                                        {duration}
                                    </span>
                                    <span className="text-xs text-gray-600 font-medium">
                                        minutes
                                    </span>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Companion Component */}
                    <CompanionComponent
                        {...companion}
                        companionId={id}
                        userName={user.firstName!}
                        userImage={user.imageUrl!}
                    />
                </div>
            </main>
        )
    } catch (error) {
        console.error('Error loading companion session:', error);
        redirect('/companions');
    }
}

export default CompanionSession;