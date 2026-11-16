// Public half of CHNW's web push key pair. It is safe to publish: browsers need it to subscribe.
// The private half stays in the VAPID_PRIVATE_KEY environment variable and is never committed.
export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BH16aiNvKdWGJMGhK7mKc7DuV3ELNqV8fV52-DzfJqnmRWqZQ_brvsiS9JH05HhPhnosbw4Ee_1_zGjifPNyE80";
