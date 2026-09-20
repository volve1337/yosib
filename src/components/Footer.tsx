
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="mt-12 py-6 border-t border-gray-800 bg-prime-dark text-center text-sm text-gray-400">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Left: Brand & Links */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                    <span className="flex items-center gap-2 font-black tracking-tighter text-white uppercase">
                        <Image src="/icon-192.png" alt="YosiBreak logo" width={28} height={28} className="rounded-lg border border-white/10" />
                        YosiBreak
                    </span>
                    <nav className="flex gap-4">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <Link href="/about" className="hover:text-white transition-colors">About</Link>
                        <Link href="/dmca" className="hover:text-white transition-colors">DMCA</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </nav>
                </div>

                {/* Middle: Disclaimer (Hidden on very small screens or abbreviated) */}
                <p className="text-xs text-gray-600 max-w-md hidden md:block text-center mx-auto leading-tight">
                    YosiBreak does not host any content on our servers.
                </p>

                <div className="text-xs">
                    &copy; {new Date().getFullYear()} YosiBreak
                </div>
            </div>
        </footer>
    );
};

export default Footer;
