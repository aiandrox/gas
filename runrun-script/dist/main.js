let global = this;
function sendSchedulesNextMonth() {
}
function calculateVotes() {
}
"use strict";(()=>{var m=(e,o)=>{let s=e.getFullYear(),a=e.getMonth()+1,t=e.getDate(),n=o.join(" / ");return`${s}/${a}/${t} (${n})`},u=e=>e.map(o=>g(o)).join(" "),g=e=>`<@${e}>`;var S="C0284B80WSY",f=PropertiesService.getScriptProperties().getProperty("SLACK_BOT_USER_OAUTH_TOKEN"),l=":raised_hands:",p=e=>{let o="https://slack.com/api/chat.postMessage",s={channel:S,text:e},a={method:"post",headers:{Authorization:`Bearer ${f}`,"Content-Type":"application/json; charset=utf-8"},payload:JSON.stringify(s)},n=UrlFetchApp.fetch(o,a).getContentText(),r=JSON.parse(n);return console.log(r),r},x=e=>{let o=`https://slack.com/api/reactions.get?channel=${S}&timestamp=${e}`,s={method:"get",headers:{Authorization:`Bearer ${f}`,"Content-Type":"application/json; charset=utf-8"}},t=UrlFetchApp.fetch(o,s).getContentText(),n=JSON.parse(t);return console.log(n),n};var d="Schedule",M=()=>{h(d)?.clear()},y=e=>{h(d)?.getRange(1,1,e.length,e[0].length).setValues(e)},D=()=>h(d).getDataRange().getValues(),h=e=>{let s=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(e);if(!s)throw new Error(`Sheet ${e} not found.`);return s};var C=()=>{let e=D(),o=[];e.forEach(r=>{let c=r[1],i=x(c);o.push(i.message)});let s=k(o),a=Math.max(...s.map(r=>r.voteCount));if(a===0){p(`<!channel>
    次回の日程は決まりませんでした。`);return}let t=R(s,a),n=`<!channel>
  次回の日程は「${t.text}」に決定しました。
  ※ユーザ数が同列だった場合は、ランダムで決定します。

  参加者は ${u(t.users)}
  幹事は ${g(t.representative)} です。
  幹事は場所の確保と連絡お願いします。`;p(n)};function k(e){return e.filter(s=>s.reactions).map(s=>{let a=s.reactions.find(n=>n.name===l);return{text:s.text,voteCount:a?.count??0,users:a?.users??[]}})}var R=(e,o)=>{let s=e.filter(n=>n.voteCount===o),a=s[Math.floor(Math.random()*s.length)],t=a.users;return{text:a.text,users:t,representative:t[Math.floor(Math.random()*t.length)]}};var v="ja.japanese#holiday@group.v.calendar.google.com",T=(e,o)=>{let s=[];for(let t=e;t<=o;t.setDate(t.getDate()+1))if(t.getDay()===0||t.getDay()===6){let n=t.getDay()===0?"日":"土";s.push({date:new Date(t),names:[n]})}let a=A(e,o);for(let t in a){let n=a[t].getStartTime(),r=a[t].getTitle(),c=s.find(i=>i.date.getTime()===n.getTime());c?c.names.push(r):s.push({date:n,names:[r]})}return s.sort((t,n)=>t.date.getTime()-n.date.getTime())},A=(e,o)=>CalendarApp.getCalendarById(v).getEvents(e,o);var $=()=>{let e=new Date,o=e.getMonth(),s=`<!channel>
  次回の勉強会の日程調整を行います。
  参加できる日程に、${l} を付けてください。
  期限は${o+1}月19日までです。`;p(s);let a=new Date(e.getFullYear(),o+1,1),t=new Date(e.getFullYear(),o+2,0),n=T(a,t),r=[];n.forEach(c=>{let i=p(`[日程] ${m(c.date,c.names)}`);r.push([c.date,i.ts.toString()])}),M(),y(r)};global.sendSchedulesNextMonth=$;global.calculateVotes=C;})();
