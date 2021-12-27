import{i as B}from"./vendor.eb7aeca8.js";const W=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))d(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const t of r.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&d(t)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerpolicy&&(r.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?r.credentials="include":s.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function d(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}};W();class j{constructor(o,n,d,s=Math.random()*2-1,r=Math.random()*2-1,t=Math.random()*10){this.x=o,this.y=n,this.radius=d,this.radius2=d*d,this.vx=s,this.vy=r,this.speed=t}draw(o){o.beginPath(),o.arc(this.x,this.y,this.radius,0,Math.PI*2),o.closePath(),o.stroke()}update(o,n,d){this.x+=this.vx*this.speed*o,this.y+=this.vy*this.speed*o,this.x+this.radius>n&&(this.x=n-this.radius,this.vx*=-1),this.x-this.radius<0&&(this.x=this.radius,this.vx*=-1),this.y+this.radius>d&&(this.y=d-this.radius,this.vy*=-1),this.y-this.radius<0&&(this.y=this.radius,this.vy*=-1)}}const k=512,x=512,w=30,e={ballsCount:8,gridResolution:8,simSpeed:20,lineWidth:1,lineColor:"#777",linearInterpolate:!0,renderBalls:!1,renderDebugLines:!1},v=document.createElement("canvas"),c=v.getContext("2d"),S=[],b=new B.GUI;let O=0;v.width=k;v.height=x;document.body.appendChild(v);for(let l=0;l<w;l++){const o=15+Math.random()*35;S.push(new j(Math.random()*k,Math.random()*x,o))}b.add(e,"ballsCount").min(1).max(w).step(1);b.add(e,"gridResolution").min(2).max(50).step(1);b.add(e,"simSpeed").min(.1).max(100).step(.1);b.add(e,"lineWidth").min(1).max(20).step(.1);b.addColor(e,"lineColor");b.add(e,"linearInterpolate");b.add(e,"renderBalls");b.add(e,"renderDebugLines");requestAnimationFrame(P);function P(l){requestAnimationFrame(P),l/=1e3;const o=(l-O)*e.simSpeed;O=l;const n=1+k/e.gridResolution,d=1+x/e.gridResolution;if(c.fillStyle="#111",c.fillRect(0,0,k,x),e.renderDebugLines){c.strokeStyle="#333",c.lineWidth=1;for(let t=0;t<n;t++)for(let i=0;i<d;i++){const u=t*e.gridResolution,h=i*e.gridResolution;c.strokeRect(u,h,e.gridResolution,e.gridResolution)}}const s=[],r=[];for(let t=0;t<n;t++){r.push([]);for(let i=0;i<d;i++){const u=t*e.gridResolution,h=i*e.gridResolution;let m=0;for(let f=0;f<e.ballsCount;f++){const g=S[f],p=g.x-u,L=g.y-h,R=p*p+L*L;m+=g.radius2/R}r[t].push(m)}}for(let t=0;t<n;t++){s.push([]);for(let i=0;i<d;i++)s[t].push(r[t][i]>1)}c.strokeStyle=e.lineColor,c.lineWidth=e.lineWidth,c.lineCap="round";for(let t=0;t<s.length-1;t++)for(let i=0;i<s.length-1;i++){const u=t*e.gridResolution,h=i*e.gridResolution;let m,f,g,p;if(e.linearInterpolate){const R=r[t][i],I=r[t+1][i],T=r[t+1][i+1],M=r[t][i+1];let y=(1-R)/(I-R);m=[C(u,u+e.gridResolution,y),h],y=(1-I)/(T-I),f=[u+e.gridResolution,C(h,h+e.gridResolution,y)],y=(1-M)/(T-M),g=[C(u,u+e.gridResolution,y),h+e.gridResolution],y=(1-R)/(M-R),p=[u,C(h,h+e.gridResolution,y)]}else m=[u+e.gridResolution/2,h],f=[u+e.gridResolution,h+e.gridResolution/2],g=[u+e.gridResolution/2,h+e.gridResolution],p=[u,h+e.gridResolution/2];switch(A(s[t][i],s[t+1][i],s[t+1][i+1],s[t][i+1])){case 0:break;case 1:a(p,g);break;case 2:a(f,g);break;case 3:a(p,f);break;case 4:a(m,f);break;case 5:a(m,p),a(f,g);break;case 6:a(m,g);break;case 7:a(m,p);break;case 8:a(m,p);break;case 9:a(m,g);break;case 10:a(m,f),a(g,p);break;case 11:a(m,f);break;case 12:a(f,p);break;case 13:a(f,g);break;case 14:a(p,g);break}}c.strokeStyle="green",c.lineWidth=1;for(let t=0;t<e.ballsCount;t++){const i=S[t];i.update(o,k,x),e.renderBalls&&i.draw(c)}}function a(l,o){c.beginPath(),c.moveTo(l[0],l[1]),c.lineTo(o[0],o[1]),c.stroke()}function A(l,o,n,d){return l*8+o*4+n*2+d*1}function C(l,o,n){return n=n<0?0:n,n=n>1?1:n,l+(o-l)*n}
