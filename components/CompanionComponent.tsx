'use client';

import { useEffect, useRef, useState } from 'react';
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import soundwaves from '@/constants/soundwaves.json';
import { addToSessionHistory } from "@/lib/actions/companion.actions";
import { motion, AnimatePresence } from 'framer-motion';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (lottieRef.current) {
            if (isSpeaking) {
                lottieRef.current.play();
            } else {
                lottieRef.current.stop();
            }
        }
    }, [isSpeaking]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            addToSessionHistory(companionId);
        };

        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = { role: message.role, content: message.transcript };
                setMessages((prev) => [newMessage, ...prev]);
            }
        };

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => console.log('Error', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('error', onError);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('error', onError);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
        };
    }, []);

    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted);
    };

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        const assistantOverrides = {
            variableValues: { subject, topic, style },
            clientMessages: ["transcript"],
            serverMessages: [],
        };

        // @ts-expect-error
        vapi.start(configureAssistant(voice, style), assistantOverrides);
    };

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    };

    const messageVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col min-h-[70vh] bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 shadow-2xl"
        >
            {/* Header Section */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Learning Session
                </h1>
                <p className="text-gray-600 mt-2">Topic: {topic}</p>
            </motion.div>

            {/* Main Content Section */}
            <section className="flex gap-8 max-lg:flex-col flex-1">
                {/* Companion & User Section */}
                <div className="flex gap-8 max-lg:flex-col lg:w-2/3">
                    {/* Companion Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="companion-section group relative overflow-hidden"
                    >
                        {/* Animated Background */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                            whileHover={{ opacity: 0.3 }}
                        />
                        
                        <div 
                            className="companion-avatar relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white"
                            style={{ backgroundColor: getSubjectColor(subject) }}
                        >
                            <AnimatePresence mode="wait">
                                {callStatus === CallStatus.ACTIVE && isSpeaking ? (
                                    <motion.div
                                        key="speaking"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <Lottie
                                            lottieRef={lottieRef}
                                            animationData={soundwaves}
                                            autoplay={false}
                                            className="companion-lottie"
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="idle"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={cn(
                                            'absolute inset-0 flex items-center justify-center transition-all duration-500',
                                            callStatus === CallStatus.CONNECTING && 'animate-pulse'
                                        )}
                                    >
                                        <Image 
                                            src={`/icons/${subject}.png`} 
                                            alt={subject} 
                                            width={150} 
                                            height={150} 
                                            className="max-sm:w-fit drop-shadow-lg"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Status Indicator */}
                            <motion.div
                                animate={{
                                    scale: callStatus === CallStatus.ACTIVE ? [1, 1.2, 1] : 1,
                                }}
                                transition={{ duration: 2, repeat: callStatus === CallStatus.ACTIVE ? Infinity : 0 }}
                                className={cn(
                                    'absolute top-4 right-4 w-4 h-4 rounded-full border-2 border-white',
                                    callStatus === CallStatus.ACTIVE ? 'bg-green-500' :
                                    callStatus === CallStatus.CONNECTING ? 'bg-yellow-500 animate-pulse' :
                                    'bg-gray-400'
                                )}
                            />
                        </div>

                        <motion.p 
                            className="font-bold text-2xl text-center mt-4 text-gray-800"
                            whileHover={{ scale: 1.05 }}
                        >
                            {name}
                        </motion.p>
                        <p className="text-center text-gray-600 mt-2 capitalize">{subject} Expert</p>
                    </motion.div>

                    {/* User Controls */}
                    <div className="user-section space-y-6">
                        {/* User Avatar */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="user-avatar group relative overflow-hidden"
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"
                                whileHover={{ opacity: 0.3 }}
                            />
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Image 
                                    src={userImage} 
                                    alt={userName} 
                                    width={130} 
                                    height={130} 
                                    className="rounded-2xl shadow-lg border-4 border-white"
                                />
                            </motion.div>
                            <motion.p 
                                className="font-bold text-2xl text-gray-800"
                                whileHover={{ scale: 1.05 }}
                            >
                                {userName}
                            </motion.p>
                        </motion.div>

                        {/* Microphone Control */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleMicrophone}
                            disabled={callStatus !== CallStatus.ACTIVE}
                            className={cn(
                                'btn-mic group relative overflow-hidden border-2 transition-all duration-300',
                                callStatus !== CallStatus.ACTIVE 
                                    ? 'opacity-50 cursor-not-allowed border-gray-300' 
                                    : isMuted 
                                    ? 'border-red-300 bg-red-50' 
                                    : 'border-green-300 bg-green-50'
                            )}
                        >
                            <motion.div
                                animate={isMuted ? { rotate: [0, -5, 5, 0] } : {}}
                                transition={{ duration: 0.5 }}
                            >
                                <Image 
                                    src={isMuted ? '/icons/mic-off.png' : '/icons/mic-on.png'} 
                                    alt="mic" 
                                    width={36} 
                                    height={36} 
                                    className={isMuted ? 'filter hue-rotate-60' : ''}
                                />
                            </motion.div>
                            <motion.p 
                                className="max-sm:hidden font-semibold"
                                whileHover={{ x: 2 }}
                            >
                                {isMuted ? 'Microphone Off' : 'Microphone On'}
                            </motion.p>
                            <motion.div
                                className={cn(
                                    'absolute bottom-0 left-0 right-0 h-1 transition-all duration-300',
                                    isMuted ? 'bg-red-500' : 'bg-green-500'
                                )}
                                whileHover={{ height: 4 }}
                            />
                        </motion.button>

                        {/* Main Call Control */}
                        <motion.button
                            whileHover={{ 
                                scale: callStatus !== CallStatus.CONNECTING ? 1.05 : 1,
                                boxShadow: callStatus !== CallStatus.CONNECTING ? '0 10px 30px rgba(0,0,0,0.2)' : 'none'
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                            className={cn(
                                'relative overflow-hidden rounded-2xl py-4 w-full text-white font-bold text-lg shadow-lg transition-all duration-300',
                                callStatus === CallStatus.ACTIVE 
                                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                                    : callStatus === CallStatus.CONNECTING
                                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 animate-pulse'
                                    : 'bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary'
                            )}
                        >
                            <motion.span
                                animate={callStatus === CallStatus.CONNECTING ? { opacity: [0.5, 1, 0.5] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                {callStatus === CallStatus.ACTIVE
                                    ? "End Session"
                                    : callStatus === CallStatus.CONNECTING
                                    ? 'Connecting...'
                                    : 'Start Learning Session'
                                }
                            </motion.span>
                            
                            {/* Ripple Effect */}
                            <motion.div
                                className="absolute inset-0 bg-white opacity-0 hover:opacity-20"
                                whileHover={{ opacity: 0.2 }}
                                transition={{ duration: 0.2 }}
                            />
                        </motion.button>
                    </div>
                </div>

                {/* Transcript Section */}
                <motion.section
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="transcript flex-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-primary/10 overflow-hidden"
                >
                    <div className="p-6 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-transparent">
                        <h2 className="text-2xl font-bold text-gray-800">Conversation</h2>
                        <p className="text-gray-600">Real-time transcript of your learning session</p>
                    </div>

                    <div className="transcript-message no-scrollbar p-6 space-y-4">
                        <AnimatePresence>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {messages.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center text-gray-500 py-12"
                                    >
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Image 
                                                src="/icons/chat.png" 
                                                alt="chat" 
                                                width={64} 
                                                height={64} 
                                                className="mx-auto opacity-50"
                                            />
                                        </motion.div>
                                        <p className="mt-4 text-lg">Start a session to begin your conversation</p>
                                        <p className="text-sm">Your dialogue will appear here</p>
                                    </motion.div>
                                ) : (
                                    messages.map((message, index) => (
                                        <motion.div
                                            key={index}
                                            variants={messageVariants}
                                            layout
                                            className={cn(
                                                'p-4 rounded-2xl shadow-md max-w-[80%] border-2',
                                                message.role === 'assistant'
                                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 ml-auto'
                                                    : 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 mr-auto'
                                            )}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <motion.div
                                                    whileHover={{ scale: 1.1 }}
                                                    className={cn(
                                                        'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm',
                                                        message.role === 'assistant'
                                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                                                            : 'bg-gradient-to-r from-primary to-primary-hover'
                                                    )}
                                                >
                                                    {message.role === 'assistant' 
                                                        ? name.split(' ')[0].charAt(0).toUpperCase()
                                                        : userName.charAt(0).toUpperCase()
                                                    }
                                                </motion.div>
                                                <span className={cn(
                                                    'font-bold',
                                                    message.role === 'assistant' ? 'text-blue-700' : 'text-primary'
                                                )}>
                                                    {message.role === 'assistant' 
                                                        ? name.split(' ')[0].replace(/[.,]/g, '')
                                                        : userName
                                                    }
                                                </span>
                                            </div>
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                                className={cn(
                                                    'text-gray-800 leading-relaxed',
                                                    message.role === 'assistant' ? 'text-lg' : 'text-lg'
                                                )}
                                            >
                                                {message.content}
                                            </motion.p>
                                        </motion.div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="transcript-fade bg-gradient-to-t from-white via-white/90 to-transparent" />
                </motion.section>
            </section>
        </motion.section>
    );
};

export default CompanionComponent;