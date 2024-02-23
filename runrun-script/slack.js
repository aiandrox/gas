const channelId = "C0284B80WSY"; // #月一定期勉強会企画
const accessToken = PropertiesService.getScriptProperties().getProperty('SLACK_BOT_USER_OAUTH_TOKEN');

function sendSlack(message) {
  const endpoint = 'https://slack.com/api/chat.postMessage';

  const payload = {
    'channel': channelId,
    'text': message,
  }
  const options = {
    "method" : "post",
    'headers': {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
    "payload" : JSON.stringify(payload)
  };

  const res = UrlFetchApp.fetch(endpoint, options);
  const responseBody = res.getContentText();
  const json = JSON.parse(responseBody);
  console.log(json);
  return json;
}

function getReactions(timestamp) {
  const endpoint = `https://slack.com/api/reactions.get?channel=${channelId}&timestamp=${timestamp}`;

  const options = {
    "method" : "get",
    'headers': {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=utf-8'
    },
  };
  const res = UrlFetchApp.fetch(endpoint, options);
  const responseBody = res.getContentText();
  const json = JSON.parse(responseBody);
  console.log(json);
  return json;
}