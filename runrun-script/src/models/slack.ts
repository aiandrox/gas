export type SlackReactionResponse = {
  ok: boolean;
  type: "message";
  message: SlackMessage;
  channel: string;
};

export type SlackMessage = {
  type: "message";
  text: string;
  user: string;
  ts: string;
  team: string;
  reactions: SlackReaction[];
  permalink: string;
};

type SlackReaction = {
  name: string;
  users: string[];
  count: number;
};
