// 4K core: tips on a bitmap. docs/MODEL.md section 3. p=[E um/h,G um,branch,wobble,avoid,fuse,uptake,turn]
var M=(p,seed)=>{let W=512,Q=128,o=new Uint8Array(W*W),n=new Float32Array(Q*Q).fill(1),m=n.slice(),D=[],T=[],a=seed>>>0,k=256/360,c=1,s=0,i,j,S,
r=_=>(a=a+0x6D2B79F5|0,_=Math.imul(a^a>>>15,1|a),_=_+Math.imul(_^_>>>7,61|_)^_,((_^_>>>14)>>>0)/4294967296),
v=(X,Y)=>X<0||Y<0||X>=W||Y>=W?-1:p[4]*o[(Y|0)*W+(X|0)]-n[(Y>>2)*Q+(X>>2)]
for(i=0;i<256;i++)D.push(c,s),[c,s]=[c*.9996988186962042-s*.024541228522912288,c*.024541228522912288+s*.9996988186962042]
for(i=0;i<12;i++)T.push([256,256,i*64/3,9])
return S={T,o,PX:20,t:0,dt:72e3/p[0],len:0,br:0,fu:0,step(){
for(i=0;i<T.length;i++){let t=T[i],[X,Y,H]=t,z=q=>(j=(H+q&255)*2,v(X+D[j]*6,Y+D[j+1]*6)),L=z(-32),F=z(0),R=z(32),x,y,b,e
H+=(r()-.5)*2*p[3]*k+(L<F&&L<=R?-p[7]*k:R<F?p[7]*k:0)
j=(H&255)*2;x=X+D[j];y=Y+D[j+1];e=(y>>2)*Q+(x>>2);b=(y|0)*W+(x|0)
if(x<0||y<0||x>=W||y>=W||n[e]<.05||b!=(Y|0)*W+(X|0)&&o[b]&&t[3]>3&&r()<p[5]&&++S.fu&&(S.ev&&S.ev(1,x,y),1)){T[i--]=T[T.length-1];T.pop();continue}
o[b]||(o[b]=1,S.len++,n[e]=Math.max(0,n[e]-p[6]))
t[0]=x;t[1]=y;t[2]=H;t[3]++
T.length<2e4&&r()<20/p[1]*n[e]&&(S.br++,S.ev&&S.ev(0,x,y),T.push([x,y,H+(r()<.5?p[2]:-p[2])*k,0]))}
for(i=Q;i<Q*Q-Q;i++)m[i]=i%Q&&(i+1)%Q?n[i]+.2*(n[i-1]+n[i+1]+n[i-Q]+n[i+Q]-4*n[i]):1
c=n;n=m;m=c;S.t+=S.dt}}}
