"use client";

import React, { useState } from "react";
import { Server, Maximize2, Minimize2, RefreshCcw, Share2, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveToRecentlyPlayed } from "@/lib/storage";
import Dropdown from "@/components/ui/Dropdown";

interface VideoPlayerProps {
    type: "movie" | "tv";
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tmdbData: any;
    season?: number;
    episode?: number;
    initialServer?: number;
    onSeasonChange?: (season: number) => void;
    onEpisodeChange?: (episode: number) => void;
}

const SERVERS = [
    {
        name: "volve",
        movie: (id: string) => `https://embed.vidrift.in/embed/movie/${id}?brand=YosiBreak`,
        show: (id: string, s: number, e: number) => `https://embed.vidrift.in/embed/tv/${id}/${s}/${e}?brand=YosiBreak`,
        useSandbox: false
    },
    {
        name: "faggzz",
        movie: (id: string) => `https://vidfast.net/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidfast.net/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "fubar",
        movie: (id: string) => `https://www.2embed.skin/embed/${id}`,
        show: (id: string, s: number, e: number) => `https://www.2embed.skin/embedtv/${id}&s=${s}&e=${e}`,
        useSandbox: false
    },
   /* {
        name: "yb1",
        movie: (id: string) => `https://www.vidy.st/movie/${id}?color=DC2626`,
        show: (id: string, s: number, e: number) => `https://www.vidy.st/tv/${id}/${s}/${e}?color=DC2626&nextEpisode=true&episodeSelector=true`,
        useSandbox: false
    },
    {
        name: "yb2",
        movie: (id: string) => `https://embed.filmu.in/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://embed.filmu.in/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "yb3",
        movie: (id: string) => `https://primesrc.me/embed/movie?tmdb=${id}`,
        show: (id: string, s: number, e: number) => `https://primesrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
        useSandbox: false
    },
    {
        name: "yb4",
        movie: (id: string) => `https://embed.vidrift.in/embed/movie/${id}?brand=YosiBreak`,
        show: (id: string, s: number, e: number) => `https://embed.vidrift.in/embed/tv/${id}/${s}/${e}?brand=YosiBreak`,
        useSandbox: false
    },
    {
        name: "yb5",
        movie: (id: string) => `https://vidfast.net/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidfast.net/tv/${id}/${s}/${e}`,
        useSandbox: false
    },

    {
        name: "yb6",
        movie: (id: string) => `https://vidsrc.pm/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidsrc.pm/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "yb7",
        movie: (id: string) => `https://peachify.top/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://peachify.top/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "yb8",
        movie: (id: string) => `https://vidsrcme.su/embed/movie?tmdb=${id}`,
        show: (id: string, s: number, e: number) => `https://vidsrcme.su/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
        useSandbox: false
    },
    {
        name: "yb9",
        movie: (id: string) => `https://player.videasy.net/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://player.videasy.net/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "yb10",
        movie: (id: string) => `https://www.vidking.net/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://www.vidking.net/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "yb11",
        movie: (id: string) => `https://www.2embed.skin/embed/${id}`,
        show: (id: string, s: number, e: number) => `https://www.2embed.skin/embedtv/${id}&s=${s}&e=${e}`,
        useSandbox: false
    },
    {
        name: "yb12",
        movie: (id: string) => `https://autoembed.co/movie/tmdb/${id}`,
        show: (id: string, s: number, e: number) => `https://autoembed.co/tv/tmdb/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "yb13",
        movie: (id: string) => `https://player.cinezo.live/embed/movie/${id}?autoplay=false&poster=true&chromecast=true&servericon=true&setting=true&pip=true&font=Roboto&fontcolor=ffffff&fontsize=20&opacity=0.5&primarycolor=ffffff&secondarycolor=0a0a0a&iconcolor=ffffff`,
        show: (id: string, s: number, e: number) => `https://player.cinezo.live/embed/tv/${id}/${s}/${e}?autoplay=false&poster=true&chromecast=true&servericon=true&setting=true&pip=true&font=Roboto&fontcolor=ffffff&fontsize=20&opacity=0.5&primarycolor=ffffff&secondarycolor=0a0a0a&iconcolor=ffffff`,
        useSandbox: false
    },
    {
        name: "yb14",
        movie: (id: string) => `https://vidlink.pro/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
        useSandbox: false
    },
    {
        name: "yb15",
        movie: (id: string) => `https://vidrock.net/embed/movie/${id}`,
        show: (id: string, s: number, e: number) => `https://vidrock.net/embed/tv/${id}/${s}/${e}`,
        useSandbox: false
    } */
];

type SourceStatus = "checking" | "available" | "unavailable" | "unknown";

export default function VideoPlayer({
    type,
    id,
    tmdbData,
    season: controlledSeason,
    episode: controlledEpisode,
    initialServer,
    onSeasonChange,
    onEpisodeChange
}: VideoPlayerProps) {
    const [internalSeason, setInternalSeason] = useState(1);
    const [internalEpisode, setInternalEpisode] = useState(1);
    const [selectedServer, setSelectedServer] = useState(() => {
        const requested = initialServer ?? 0;
        return requested >= 0 && requested < SERVERS.length ? requested : 0;
    });
    const [sourceStatuses, setSourceStatuses] = useState<SourceStatus[]>(
        () => SERVERS.map(() => "checking")
    );
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [playerKey, setPlayerKey] = useState(0); // For reloading iframe
    const [copied, setCopied] = useState(false);

    const isControlled = controlledSeason !== undefined && controlledEpisode !== undefined;
    const currentSeason = isControlled ? controlledSeason : internalSeason;
    const currentEpisode = isControlled ? controlledEpisode : internalEpisode;

    const getSourceUrl = React.useCallback((serverIndex: number) => {
        const server = SERVERS[serverIndex];
        return type === "movie"
            ? server.movie(id)
            : server.show(id, currentSeason, currentEpisode);
    }, [type, id, currentSeason, currentEpisode]);

    // Cross-origin players do not expose their internal playback state. This
    // lightweight probe detects reachable sources and automatically selects
    // the first one that responds. Iframe load/error events refine the result.
    React.useEffect(() => {
        let cancelled = false;
        setSourceStatuses(SERVERS.map(() => "checking"));

        const probeSource = async (serverIndex: number) => {
            const controller = new AbortController();
            const timeout = window.setTimeout(() => controller.abort(), 6000);

            try {
                await fetch(getSourceUrl(serverIndex), {
                    method: "GET",
                    mode: "no-cors",
                    cache: "no-store",
                    signal: controller.signal,
                });

                if (!cancelled) {
                    setSourceStatuses((current) => {
                        const next = [...current];
                        next[serverIndex] = "available";
                        return next;
                    });
                }
                return true;
            } catch {
                if (!cancelled) {
                    setSourceStatuses((current) => {
                        const next = [...current];
                        // A blocked cross-origin probe is inconclusive. Only an
                        // actual iframe error marks a source unavailable.
                        next[serverIndex] = next[serverIndex] === "available" ? "available" : "unknown";
                        return next;
                    });
                }
                return false;
            } finally {
                window.clearTimeout(timeout);
            }
        };

        Promise.all(SERVERS.map((_, index) => probeSource(index))).then((results) => {
            if (cancelled) return;

            const firstAvailable = results.findIndex(Boolean);
            if (firstAvailable >= 0) {
                setSelectedServer((current) => results[current] ? current : firstAvailable);
            } else {
                // Some browsers block cross-origin probes even when iframes can
                // load. Keep every option usable and let the iframe decide.
                setSourceStatuses(SERVERS.map(() => "unknown"));
            }
        });

        return () => {
            cancelled = true;
        };
    }, [getSourceUrl]);

    const handleSeasonChange = (s: number) => {
        if (isControlled) {
            onSeasonChange?.(s);
        } else {
            setInternalSeason(s);
            setInternalEpisode(1);
        }
    };

    const handleEpisodeChange = (e: number) => {
        if (isControlled) {
            onEpisodeChange?.(e);
        } else {
            setInternalEpisode(e);
        }
    };

    // Save to recently played
    React.useEffect(() => {
        if (tmdbData) {
            saveToRecentlyPlayed({
                id,
                type,
                title: tmdbData.title || tmdbData.name,
                overview: tmdbData.overview,
                poster_path: tmdbData.poster_path,
                backdrop_path: tmdbData.backdrop_path,
                vote_average: tmdbData.vote_average,
                release_date: tmdbData.release_date,
                first_air_date: tmdbData.first_air_date,
                last_played: Date.now(),
                season: type === "tv" ? currentSeason : undefined,
                episode: type === "tv" ? currentEpisode : undefined,
                tagline: tmdbData.tagline,
            });
        }
    }, [id, type, tmdbData, currentSeason, currentEpisode]);

    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    // Keep focus on player when pressing Space
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }
            if (e.code === "Space" || e.key === " ") {
                e.preventDefault(); // Prevent default page scrolling
                if (iframeRef.current) {
                    iframeRef.current.focus();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Global shortcut event listeners
    React.useEffect(() => {
        const handleToggleTheater = () => {
            setIsTheaterMode(prev => !prev);
        };
        const handleReload = () => {
            setPlayerKey(prev => prev + 1);
        };
        const handleShareLink = () => {
            handleShare();
        };
        const handleSelectServer = (e: Event) => {
            const index = (e as CustomEvent).detail?.index;
            if (typeof index === "number" && index >= 0 && index < SERVERS.length) {
                setSelectedServer(index);
            }
        };

        window.addEventListener("playerToggleTheater", handleToggleTheater);
        window.addEventListener("playerReload", handleReload);
        window.addEventListener("playerShare", handleShareLink);
        window.addEventListener("playerSelectServer", handleSelectServer);

        return () => {
            window.removeEventListener("playerToggleTheater", handleToggleTheater);
            window.removeEventListener("playerReload", handleReload);
            window.removeEventListener("playerShare", handleShareLink);
            window.removeEventListener("playerSelectServer", handleSelectServer);
        };
    }, [selectedServer, currentSeason, currentEpisode, type, id]);

    const handleShare = () => {
        const shareUrl = `${window.location.origin}/watch/${type}/${id}?resume=true` +
            (type === 'tv' ? `&s=${currentSeason}&e=${currentEpisode}` : '') +
            `&server=${selectedServer}`;

        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => {
                console.error("Failed to copy link: ", err);
            });
    };

    const currentServer = SERVERS[selectedServer];
    const playerUrl = getSourceUrl(selectedServer);

    const handleSourceFailure = () => {
        setSourceStatuses((current) => {
            const next = [...current];
            next[selectedServer] = "unavailable";
            return next;
        });

        const nextServer = SERVERS.findIndex((_, index) =>
            index !== selectedServer && sourceStatuses[index] !== "unavailable"
        );
        if (nextServer >= 0) setSelectedServer(nextServer);
    };

    const seasons = (tmdbData?.seasons as Array<{ season_number: number; name?: string; episode_count: number }>) || [];

    return (
        <div className="flex flex-col w-full h-full">
            {/* Player Frame */}
            <div className={cn(
                "relative w-full aspect-[14/10] sm:aspect-video md:h-[85vh] bg-black group transition-all duration-500",
                isTheaterMode && "md:h-[90vh] z-40"
            )}>
                <iframe
                    ref={iframeRef}
                    key={`${selectedServer}-${currentSeason}-${currentEpisode}-${playerKey}`}
                    src={playerUrl}
                    className="w-full h-full border-none"
                    allowFullScreen
                    frameBorder="0"
                    scrolling="no"
                    referrerPolicy="origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    onLoad={() => setSourceStatuses((current) => {
                        const next = [...current];
                        next[selectedServer] = "available";
                        return next;
                    })}
                    onError={handleSourceFailure}
                    {...(currentServer.useSandbox ? { sandbox: "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation" } : {})}
                ></iframe>


                {/* Theater Mode Overlay Shadow */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Control Bar */}
            <div className="bg-prime-card p-4 border-t border-gray-800 flex flex-wrap items-center justify-between gap-4">
                {/* Server Selector */}
                <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide py-1">
                    <div className="flex items-center text-gray-400 mr-2">
                        <Server className="h-4 w-4 mr-1" />
                        <span className="text-xs font-bold uppercase whitespace-nowrap">Auto Source</span>
                    </div>
                    <div className="flex items-center bg-prime-hover rounded-lg p-1">
                        {SERVERS.map((server, idx) => (
                            <button
                                key={server.name}
                                onClick={() => {
                                    setSelectedServer(idx);
                                }}
                                className={cn(
                                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5",
                                    selectedServer === idx
                                        ? "bg-white text-black shadow-md"
                                        : sourceStatuses[idx] === "unavailable"
                                            ? "text-gray-700 hover:text-gray-500"
                                            : "text-gray-400 hover:text-white"
                                )}
                                title={sourceStatuses[idx] === "available"
                                    ? `${server.name} is reachable`
                                    : sourceStatuses[idx] === "unavailable"
                                        ? `${server.name} did not respond; click to retry`
                                        : `${server.name} availability is being checked`}
                            >
                                {sourceStatuses[idx] === "checking" && <Loader2 className="h-3 w-3 animate-spin" />}
                                {sourceStatuses[idx] === "available" && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                                {server.name}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPlayerKey(prev => prev + 1)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        title="Reload Player"
                    >
                        <RefreshCcw className="h-4 w-4" />
                    </button>

                    <button
                        onClick={handleShare}
                        className={cn(
                            "flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all border",
                            copied
                                ? "bg-neutral-500/20 text-neutral-400 border-neutral-500/30"
                                : "bg-prime-hover text-gray-300 hover:text-white border-white/5 hover:border-white/10"
                        )}
                        title="Copy Playback Link"
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4" />
                                <span className="text-xs font-bold">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Share2 className="h-4 w-4" />
                                <span className="text-xs font-bold">Share Link</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {/* Theater Mode Toggle */}
                    <button
                        onClick={() => setIsTheaterMode(!isTheaterMode)}
                        className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-prime-hover text-gray-300 hover:text-white transition-all border border-white/5"
                    >
                        {isTheaterMode ? (
                            <><Minimize2 className="h-4 w-4" /> <span className="text-xs font-bold">Normal</span></>
                        ) : (
                            <><Maximize2 className="h-4 w-4" /> <span className="text-xs font-bold">Theater</span></>
                        )}
                    </button>

                    {/* TV Controls */}
                    {type === "tv" && seasons.length > 0 && (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Season</span>
                                <Dropdown
                                    value={currentSeason}
                                    onChange={(val) => handleSeasonChange(Number(val))}
                                    options={seasons.map((s) => ({
                                        value: s.season_number,
                                        label: s.name || `Season ${s.season_number}`
                                    }))}
                                    className="px-4 py-2 rounded-lg text-sm bg-[#171717] hover:bg-[#222222] border-none shadow-none font-bold"
                                    menuClassName="min-w-[150px] bottom-full mb-2 mt-0 top-auto origin-bottom-left"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Episode</span>
                                <Dropdown
                                    value={currentEpisode}
                                    onChange={(val) => handleEpisodeChange(Number(val))}
                                    options={Array.from(
                                        { length: seasons.find((s) => s.season_number === currentSeason)?.episode_count || 50 },
                                        (_, i) => ({ value: i + 1, label: `Episode ${i + 1}` })
                                    )}
                                    className="px-4 py-2 rounded-lg text-sm bg-[#171717] hover:bg-[#222222] border-none shadow-none font-bold"
                                    menuClassName="min-w-[150px] bottom-full mb-2 mt-0 top-auto origin-bottom-left"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
