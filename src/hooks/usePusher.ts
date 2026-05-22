import Pusher from "pusher-js";
import type { PresenceChannel } from "pusher-js";
import { useEffect, useRef, useState } from "react";

export type PusherStatus = "idle" | "connecting" | "waiting" | "ready" | "opponent_left";

const usePusher = (roomId: string, playerName: string, active: boolean) => {
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<PresenceChannel | null>(null);

  const [status, setStatus] = useState<PusherStatus>("idle");
  const [lastOpponentMove, setLastOpponentMove] = useState<number | null>(null);
  const [opponentName, setOpponentName] = useState<string>("");
  const [lastReset, setLastReset] = useState<number>(0);

  useEffect(() => {
    if (!active || !roomId || !playerName) return;

    setStatus("connecting");

    // Establish connection
    pusherRef.current = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      authEndpoint: "/api/pusher/auth",
      auth: {
        params: { username: playerName },
      },
    });

    // Subscribe to channel
    const channel = pusherRef.current.subscribe(
      `presence-game-${roomId}`
    ) as PresenceChannel;
    channelRef.current = channel;

    // In-built triggers `pusher:`
    channel.bind("pusher:subscription_succeeded", (members: any) => {
      let count = 0;
      members.each((member: any) => {
        count++;
        if (member.id !== members.myID) setOpponentName(member.info.username);
      });
      setStatus(count >= 2 ? "ready" : "waiting");
    });

    channel.bind("pusher:member_added", (member: any) => {
      setOpponentName(member.info.username);
      setStatus("ready");
    });

    channel.bind("pusher:member_removed", () => {
      setOpponentName("");
      setStatus("opponent_left");
    });

    // Auto broadcast prefix `client`
    channel.bind("client-move", ({ index }: { index: number }) => {
      setLastOpponentMove(index);
    });

    channel.bind("client-reset", () => {
      setLastReset((n) => n + 1);
    });

    return () => {
      channel.unbind_all();
      pusherRef.current?.unsubscribe(`presence-game-${roomId}`);
      pusherRef.current?.disconnect();
      pusherRef.current = null;
      channelRef.current = null;
      setStatus("idle");
      setLastOpponentMove(null);
      setOpponentName("");
    };
  }, [active, roomId, playerName]);

  const sendMove = (index: number) => {
    channelRef.current?.trigger("client-move", { index });
  };

  const sendReset = () => {
    channelRef.current?.trigger("client-reset", {});
  };

  return { status, lastOpponentMove, opponentName, sendMove, sendReset, lastReset };
};

export default usePusher;
