import { SlackReactionResponse } from "./models/slack";

export const stampName = ":raised_hands:";

export const sendSlack = (message: string) => {
  const channelId = PropertiesService.getScriptProperties().getProperty("SLACK_CHANNEL_ID");
  const accessToken = PropertiesService.getScriptProperties().getProperty(
    "SLACK_BOT_USER_OAUTH_TOKEN"
  );
  const endpoint = "https://slack.com/api/chat.postMessage";

  const payload = {
    channel: channelId,
    text: message,
  };
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    payload: JSON.stringify(payload),
  };

  const res = UrlFetchApp.fetch(endpoint, options);
  const responseBody = res.getContentText();
  const json = JSON.parse(responseBody);
  console.log(json);
  return json;
};

export const getReactions = (timestamp: string) => {
  const channelId = PropertiesService.getScriptProperties().getProperty("SLACK_CHANNEL_ID");
  const accessToken = PropertiesService.getScriptProperties().getProperty(
    "SLACK_BOT_USER_OAUTH_TOKEN"
  );
  const endpoint = `https://slack.com/api/reactions.get?channel=${channelId}&timestamp=${timestamp}`;

  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=utf-8",
    },
  };
  const res = UrlFetchApp.fetch(endpoint, options);
  const responseBody = res.getContentText();
  const json: SlackReactionResponse = JSON.parse(responseBody);
  console.log(json);
  return json;
};
