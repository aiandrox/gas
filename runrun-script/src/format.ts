export const getDateText = (date: GoogleAppsScript.Base.Date, names: string[]) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const name = names.join(" / ");
  return `${year}/${month}/${day} (${name})`;
};

export const getSlackUsersMention = (userIds: string[]) => {
  return userIds.map((userId) => getSlackUserMention(userId)).join(" ");
};

export const getSlackUserMention = (userId: string) => {
  return `<@${userId}>`;
};
