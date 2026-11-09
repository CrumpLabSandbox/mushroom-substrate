// 4K view: draws new hypha pixels and the signal line. Elements are reached by id.
let x=c.getContext('2d'),S,P,run=1,
go=async _=>{P=await(await fetch('species/'+sp.value+'.json')).json();S=M(P.p,+sd.value);x.fillStyle='#14110c';x.fillRect(0,0,512,512);x.fillStyle='#e9dcbc'},
f=_=>{if(S&&run){for(let k=+v.value;k--;){S.step();for(let t of S.T)x.fillRect(t[0]|0,t[1]|0,1,1)}
out.textContent=`${P.n}: ${(S.t/3600).toFixed(1)} h, ${S.T.length} tips, ${(S.len*S.PX/1e3).toFixed(1)} mm of hypha, ${S.br} branches, ${S.fu} fusions`}
requestAnimationFrame(f)}
sp.onchange=sd.onchange=b.onclick=go;c.onclick=_=>run=!run;go();f()
