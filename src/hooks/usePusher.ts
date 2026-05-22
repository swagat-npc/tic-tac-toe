import Pusher from "pusher-js";
import type { PresenceChannel } from "pusher-js";
import { useEffect, useRef, useState } from "react";
import type { CellState, GameState } from "../types/State";

export type PusherStatus = "idle" | "connecting" | "waiting" | "ready" | "opponent_left";

export type SyncState = {
  cells: CellState[];
  turn: number;
  gameState: GameState;
  winCombo: number[];
};

const usePusher = (roomId: string, playerName: string, isCreator: boolean, active: boolean) => {
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<PresenceChannel | null>(null);

  const [status, setStatus] = useState<PusherStatus>("idle");
  const [lastOpponentMove, setLastOpponentMove] = useState<number | null>(null);
  const [opponentName, setOpponentName] = useState<string>("");
  const [prevOpponentName, setPrevOpponentName] = useState<string>("");
  const [lastReset, setLastReset] = useState<number>(0);
  const [lastSync, setLastSync] = useState<SyncState | null>(null);
  // { name, count } — count increments on each join so useEffect fires even on same-name rejoin
  const [memberJoined, setMemberJoined] = useState<{ name: string; count: number } | null>(null);
  const [creatorLeft, setCreatorLeft] = useState<boolean>(false);

  useEffect(() => {
    if (!active || !roomId || !playerName) return;

    setStatus("connecting");

    // Establish connection
    pusherRef.current = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      authEndpoint: "/api/pusher/auth",
      auth: {
        params: { username: playerName, isCreator: isCreator.toString() },
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
      setMemberJoined((prev) => ({ name: member.info.username, count: (prev?.count ?? 0) + 1 }));
      setStatus("ready");
    });

    channel.bind("pusher:member_removed", (member: any) => {
      const removedIsCreator = member.info.isCreator === true;
      if (removedIsCreator && !isCreator) {
        // Creator left — non-creator should exit the game
        setCreatorLeft(true);
      } else {
        // Non-creator left — store their name for potential rejoin comparison
        setPrevOpponentName(member.info.username);
        setOpponentName("");
        setStatus("waiting");
      }
    });

    // Auto broadcast prefix `client-`
    channel.bind("client-move", ({ index }: { index: number }) => {
      setLastOpponentMove(index);
    });

    channel.bind("client-reset", () => {
      setLastOpponentMove(null);
      setLastReset((n) => n + 1);
    });

    channel.bind("client-sync", (data: SyncState) => {
      setLastSync(data);
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
      setPrevOpponentName("");
      setLastReset(0);
      setLastSync(null);
      setMemberJoined(null);
      setCreatorLeft(false);
    };
  }, [active, roomId, playerName, isCreator]);

  const sendMove = (index: number) => {
    channelRef.current?.trigger("client-move", { index });
  };

  const sendReset = () => {
    setLastOpponentMove(null);
    channelRef.current?.trigger("client-reset", {});
  };

  const sendSync = (state: SyncState) => {
    channelRef.current?.trigger("client-sync", state);
  };

  return { status, lastOpponentMove, opponentName, prevOpponentName, memberJoined, creatorLeft, sendMove, sendReset, sendSync, lastSync, lastReset };
};

export default usePusher;
