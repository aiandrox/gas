function formatted(messages) {
  const rectionedMessages = messages.filter((message) => message.reactions);

  return rectionedMessages.map((message) => {
    const raisedHands = message.reactions.find(r => r.name === 'raised_hands');
    return {
      text: message.text,
      voteCount: raisedHands.count || 0,
      users: raisedHands.users || []
    }
  });
}

function selectedDate(formattedMessages) {
  const maxCount = Math.max(...formattedMessages.map((message) => message.voteCount));
  const maxCountMessages = formattedMessages.filter((message) => message.voteCount === maxCount);
  const selectedMessage = maxCountMessages[Math.floor(Math.random() * maxCountMessages.length)];
  const users = selectedMessage.users;

  return {
    text: selectedMessage.text,
    users: users,
    representative: users[Math.floor(Math.random() * users.length)]
  }
}