import { getSlackUserMention, getSlackUsersMention } from "./format";
import { SlackMessage } from "./models/slack";
import { getReactions, sendSlack } from "./slack";
import { getSpreadSheet } from "./spreadSheet";

type FormattedMessage = {
  text: string;
  voteCount: number;
  users: string[];
};

export const calculateVotes = () => {
  const scheduleSheet = getSpreadSheet("schedule");
  const schedules = scheduleSheet.getDataRange().getValues();
  let messages: SlackMessage[] = [];
  schedules.forEach((schedule) => {
    const timestamp = schedule[1];
    const response = getReactions(timestamp);
    messages.push(response.message);
  });

  const formattedMessages = formatted(messages);
  const selected = selectedDate(formattedMessages);
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

const selectedDate = (formattedMessages: FormattedMessage[]) =>{
  const maxCount = Math.max(...formattedMessages.map((message) => message.voteCount));
  const maxCountMessages = formattedMessages.filter((message) => message.voteCount === maxCount);
  const selectedMessage = maxCountMessages[Math.floor(Math.random() * maxCountMessages.length)];
  const users = selectedMessage.users;

  return {
    text: selectedMessage.text,
    users: users,
    representative: users[Math.floor(Math.random() * users.length)],
  };
}
