import { getSlackUserMention, getSlackUsersMention } from "./format";
import { SlackMessage } from "./models/slack";
import { getReactions, sendSlack } from "./slack";
import { getSpreadSheetValues } from "./spreadSheet";

type FormattedMessage = {
  text: string;
  voteCount: number;
  users: string[];
};

export const calculateVotes = () => {
  const schedules = getSpreadSheetValues();

  let messages: SlackMessage[] = [];
  schedules.forEach((schedule) => {
    const timestamp = schedule[1];
    const response = getReactions(timestamp);
    messages.push(response.message);
  });

  const formattedMessages = formatted(messages);
  const maxVoteCount = Math.max(...formattedMessages.map((message) => message.voteCount));
  if (maxVoteCount === 0) {
    const message = `<!channel>
    次回の日程は決まりませんでした。`;
    sendSlack(message);
    return;
  }

  const selected = selectedDate(formattedMessages, maxVoteCount);
  const message = `<!channel>
  次回の日程は「${selected.text}」に決定しました。
  ※ユーザ数が同列だった場合は、ランダムで決定します。

  参加者は ${getSlackUsersMention(selected.users)}
  幹事は ${getSlackUserMention(selected.representative)} です。
  幹事は場所の確保と連絡お願いします。`;
  sendSlack(message);
};

function formatted(messages: SlackMessage[]) {
  const reactedMessages = messages.filter((message) => message.reactions);

  return reactedMessages.map((message) => {
    const raisedHands = message.reactions.find((r) => r.name === "raised_hands");
    const formattedMessage: FormattedMessage = {
      text: message.text,
      voteCount: raisedHands?.count ?? 0,
      users: raisedHands?.users ?? [],
    };
    return formattedMessage;
  });
}

const selectedDate = (formattedMessages: FormattedMessage[], maxVoteCount: number) => {
  const maxCountMessages = formattedMessages.filter(
    (message) => message.voteCount === maxVoteCount
  );
  const selectedMessage = maxCountMessages[Math.floor(Math.random() * maxCountMessages.length)];
  const users = selectedMessage.users;

  return {
    text: selectedMessage.text,
    users: users,
    representative: users[Math.floor(Math.random() * users.length)],
  };
};
