import Pusher from "pusher";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.VITE_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.VITE_PUSHER_CLUSTER!,
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { socket_id, channel_name, username, isCreator } = req.body as {
    socket_id: string;
    channel_name: string;
    username?: string;
    isCreator?: string;
  };

  const authResponse = pusher.authorizeChannel(socket_id, channel_name, {
    user_id: socket_id,
    user_info: { username: username ?? "Anonymous", isCreator: isCreator === "true" },
  });

  return res.status(200).json(authResponse);
}
