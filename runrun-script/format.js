function getDateText(date, names) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const name = names.join(' / ');
  return `${year}/${month}/${day} (${name})`
}

function getSlackUsersMention(userIds) {
  return userIds.map((userId) => getSlackUserMention(userId)).join(' ');
}

function getSlackUserMention(userId) {
  return `<@${userId}>`
}