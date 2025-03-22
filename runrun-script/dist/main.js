let global = this;
function sendSchedulesNextMonth() {
}
function calculateVotes() {
}
"use strict";(()=>{var d=(e,o)=>{let s=e.getFullYear(),a=e.getMonth()+1,t=e.getDate(),n=o.join(" / ");return`${s}/${a}/${t} (${n})`},h=e=>e.map(o=>g(o)).join(" "),g=e=>`<@${e}>`;var m="C0284B80WSY",u=PropertiesService.getScriptProperties().getProperty("SLACK_BOT_USER_OAUTH_TOKEN"),p=e=>{let o="https://slack.com/api/chat.postMessage",s={channel:m,text:e},a={method:"post",headers:{Authorization:`Bearer ${u}`,"Content-Type":"application/json; charset=utf-8"},payload:JSON.stringify(s)},n=UrlFetchApp.fetch(o,a).getContentText(),r=JSON.parse(n);return console.log(r),r},S=e=>{let o=`https://slack.com/api/reactions.get?channel=${m}&timestamp=${e}`,s={method:"get",headers:{Authorization:`Bearer ${u}`,"Content-Type":"application/json; charset=utf-8"}},t=UrlFetchApp.fetch(o,s).getContentText(),n=JSON.parse(t);return console.log(n),n};var f=()=>{l("schedule")?.clear()},x=e=>{l("schedule")?.getRange(1,1,e.length,e[0].length).setValues(e)},l=e=>{let s=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(e);if(!s)throw new Error(`Sheet ${e} not found.`);return s};var M=()=>{let o=l("schedule").getDataRange().getValues(),s=[];o.forEach(r=>{let c=r[1],i=S(c);s.push(i.message)});let a=C(s),t=T(a),n=`<!channel>
  次回の日程は「${t.text}」に決定しました。
  ※ユーザ数が同列だった場合は、ランダムで決定します。

  参加者は ${h(t.users)}
  幹事は ${g(t.representative)} です。
  幹事は場所の確保と連絡お願いします。`;p(n)};function C(e){return e.filter(s=>s.reactions).map(s=>{let a=s.reactions.find(n=>n.name==="raised_hands");return{text:s.text,voteCount:a?.count??0,users:a?.users??[]}})}var T=e=>{let o=Math.max(...e.map(n=>n.voteCount)),s=e.filter(n=>n.voteCount===o),a=s[Math.floor(Math.random()*s.length)],t=a.users;return{text:a.text,users:t,representative:t[Math.floor(Math.random()*t.length)]}};var k="ja.japanese#holiday@group.v.calendar.google.com",y=(e,o)=>{let s=[];for(let t=e;t<=o;t.setDate(t.getDate()+1))if(t.getDay()===0||t.getDay()===6){let n=t.getDay()===0?"日":"土";s.push({date:new Date(t),names:[n]})}let a=R(e,o);for(let t in a){let n=a[t].getStartTime(),r=a[t].getTitle(),c=s.find(i=>i.date.getTime()===n.getTime());c?c.names.push(r):s.push({date:n,names:[r]})}return s.sort((t,n)=>t.date.getTime()-n.date.getTime())},R=(e,o)=>CalendarApp.getCalendarById(k).getEvents(e,o);var D=()=>{let e=new Date,o=e.getMonth(),s=`<!channel>
  次回の勉強会の日程調整を行います。
  参加できる日程に、:raised_hands: を付けてください。
  期限は${o+1}月19日までです。`;p(s);let a=new Date(e.getFullYear(),o+1,1),t=new Date(e.getFullYear(),o+2,0),n=y(a,t),r=[];n.forEach(c=>{let i=p(`[日程] ${d(c.date,c.names)}`);r.push([c.date,i.ts.toString()])}),f(),x(r)};global.sendSchedulesNextMonth=D;global.calculateVotes=M;})();
