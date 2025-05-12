let global = this;
function sendSchedulesNextMonth() {
}
function calculateVotes() {
}
"use strict";(()=>{var m=(e,o)=>{let s=e.getFullYear(),n=e.getMonth()+1,t=e.getDate(),a=o.join(" / ");return`${s}/${n}/${t} (${a})`},S=e=>e.map(o=>l(o)).join(" "),l=e=>`<@${e}>`;var g=":raised_hands:",i=e=>{let o=PropertiesService.getScriptProperties().getProperty("SLACK_CHANNEL_ID"),s=PropertiesService.getScriptProperties().getProperty("SLACK_BOT_USER_OAUTH_TOKEN"),n="https://slack.com/api/chat.postMessage",t={channel:o,text:e},a={method:"post",headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json; charset=utf-8"},payload:JSON.stringify(t)},c=UrlFetchApp.fetch(n,a).getContentText(),p=JSON.parse(c);return console.log(p),p},u=e=>{let o=PropertiesService.getScriptProperties().getProperty("SLACK_CHANNEL_ID"),s=PropertiesService.getScriptProperties().getProperty("SLACK_BOT_USER_OAUTH_TOKEN"),n=`https://slack.com/api/reactions.get?channel=${o}&timestamp=${e}`,t={method:"get",headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json; charset=utf-8"}},r=UrlFetchApp.fetch(n,t).getContentText(),c=JSON.parse(r);return console.log(c),c};var d="Schedule",f=()=>{h(d)?.clear()},x=e=>{h(d)?.getRange(1,1,e.length,e[0].length).setValues(e)},y=()=>h(d).getDataRange().getValues(),h=e=>{let s=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(e);if(!s)throw new Error(`Sheet ${e} not found.`);return s};var M=()=>{let e=y(),o=[];e.forEach(r=>{let c=r[1],p=u(c);o.push(p.message)});let s=T(o),n=Math.max(...s.map(r=>r.voteCount));if(n===0){i(`<!channel>
    次回の日程は決まりませんでした。`);return}let t=A(s,n),a=`<!channel>
  次回の日程は「${t.text}」に決定しました。
  ※ユーザ数が同列だった場合は、ランダムで決定します。

  参加者は ${S(t.users)}
  幹事は ${l(t.representative)} です。
  幹事は場所の確保と連絡お願いします。`;i(a)};function T(e){return e.filter(s=>s.reactions).map(s=>{let n=s.reactions.find(a=>a.name===g);return{text:s.text,voteCount:n?.count??0,users:n?.users??[]}})}var A=(e,o)=>{let s=e.filter(a=>a.voteCount===o),n=s[Math.floor(Math.random()*s.length)],t=n.users;return{text:n.text,users:t,representative:t[Math.floor(Math.random()*t.length)]}};var N="ja.japanese.official#holiday@group.v.calendar.google.com",D=(e,o)=>{let s=[];for(let t=new Date(e);t<=o;t.setDate(t.getDate()+1))if(t.getDay()===0||t.getDay()===6){let a=t.getDay()===0?"日":"土";s.push({date:new Date(t),names:[a]})}let n=k(e,o);for(let t in n){let a=n[t].getStartTime(),r=n[t].getTitle(),c=s.find(p=>p.date.getTime()===a.getTime());c?c.names.push(r):s.push({date:a,names:[r]})}return s.sort((t,a)=>t.date.getTime()-a.date.getTime())},k=(e,o)=>CalendarApp.getCalendarById(N).getEvents(e,o);var C=()=>{let e=new Date,o=e.getMonth(),s=`<!channel>
  次回の勉強会の日程調整を行います。
  参加できる日程に、${g} を付けてください。
  期限は${o+1}月19日までです。`;i(s);let n=new Date(e.getFullYear(),o+1,1),t=new Date(e.getFullYear(),o+2,0),a=D(n,t),r=[];a.forEach(c=>{let p=i(`[日程] ${m(c.date,c.names)}`);r.push([c.date,p.ts.toString()])}),f(),x(r)};global.sendSchedulesNextMonth=C;global.calculateVotes=M;})();
