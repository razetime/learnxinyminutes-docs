// copy-pasted from paste:
let htmlMap = {};
function html(str) {
  let res = "";
  for (let chr of str) {
    if (chr>='0'&chr<='9' | chr>='a'&chr<='z' | chr>='A'&chr<='Z' | chr==' ' | chr=='_') res+= chr;
    else if (chr=='\n') res+= '<br>';
    else {
      let m = htmlMap[chr];
      if (!m) m = htmlMap[chr] = new Option(chr).innerHTML;
      res+= m;
    }
  }
  return res;
}
function colorCode(str, cols, prefix) {
  const wrap = (sub,col) => `<span class=${prefix+col}>${html(sub)}</span>`;
  let code = "";
  let pcol = cols[0];
  let li = 0;
  for (let i = 0; i < str.length; i++) {
    let ncol = cols[i];
    if (ncol && pcol!=ncol) {
      code+= wrap(str.slice(li,i), pcol);
      li = i;
      pcol = ncol;
    }
  }
  if (pcol) code+= wrap(str.slice(li), pcol);
  return code;
}

function parseBQN(str) {
  str = str;
  const regC = '0';
  const fnsC = '1'; let   fns = "!+-×÷⋆*√⌊⌈∧∨¬|=≠≤<>≥≡≢⊣⊢⥊∾≍⋈↑↓↕⌽⍉/⍋⍒⊏⊑⊐⊒∊⍷⊔«»⍎⍕";
  const mopC = '2'; let   mop = "`˜˘¨⁼⌜´˝˙";
  const dopC = '3'; const dop = "∘⊸⟜○⌾⎉⚇⍟⊘◶⎊";
  const namC = '4'; const nam = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_";
  const digC = '5'; const dig = "0123456789π∞"; const digS = dig+"¯."; const digM = "eEiI";
  const arrC = '6'; const arr = "·⍬‿⦃⦄⟨⟩[]@";
  const dfnC = '7'; const dfn = [..."𝕨𝕩𝔽𝔾𝕎𝕏𝕗𝕘𝕣ℝ𝕤𝕊{}:"]; // double-strucks are 2-byters
  const strC = '8'; // '' ""
  const dmdC = 'D'; const dmd = "←↩,⋄→⇐";
  const comC = 'C'; // #
  if (!window.BQNStyle) {
    const s = document.createElement("style");
    s.id = "BQNStyle";
    s.innerHTML=`
      pre .B${regC} { color: #D2D2D2; }  pre .B${regC} { color: #000000; }
      pre .B${namC} { color: #D2D2D2; }  pre .B${namC} { color: #000000; }
      pre .B${comC} { color: #898989; }  pre .B${comC} { color: #6A737D; }
      pre .B${digC} { color: #ff6E6E; }  pre .B${digC} { color: #005CC5; }
      pre .B${arrC} { color: #DD99FF; }  pre .B${arrC} { color: #005CC5; }
      pre .B${dmdC} { color: #FFFF00; }  pre .B${dmdC} { color: #0000FF; }
      pre .B${strC} { color: #6A9FFB; }  pre .B${strC} { color: #032F62; }
      pre .B${fnsC} { color: #57d657; }  pre .B${fnsC} { color: #D73A49; }
      pre .B${mopC} { color: #EB60DB; }  pre .B${mopC} { color: #ED5F00; }
      pre .B${dopC} { color: #FFDD66; }  pre .B${dopC} { color: #C82C00; }
      pre .B${dfnC} { color: #AA77BB; }  pre .B${dfnC} { color: #A906D4; }
    `;
    document.body.appendChild(s);
  }
  const res = new Array(str.length).fill();
  res[0] = regC;
  for (let i = 0; i < str.length; ) {
    const p = str[i-1]||'\0';
    const c = str[i  ];
    const n = str[i+1]||'\0';
    
    if (digS.includes(c)) {
      res[i] = digC; i++;
      while(dig.includes(str[i]) || str[i]=='.' || digM.includes(str[i])&&digS.includes(str[i+1])) i++;
      continue;
    }
    else if (fns.includes(c)) res[i] = fnsC;
    else if (mop.includes(c)) res[i] = mopC;
    else if (dop.includes(c)) res[i] = dopC;
    else if (dfn.includes(c)) res[i] = dfnC;
    else if (arr.includes(c)) res[i] = arrC;
    else if (dmd.includes(c)) res[i] = dmdC;
    else if (nam.includes(c) || c=='•') {
      let fst = i;
      if (str[i] == '•') i++;
      let cs = str[i];
      while(nam.includes(str[i]) || dig.includes(str[i])) i++;
      let ce = str[i-1];
      res[fst] = cs=='_'? (ce=='_'? dopC : mopC) : (cs>='A'&&cs<='Z'?fnsC : namC);
      continue;
    }
    else if (c=="'" || c=='"') {
      res[i] = strC; i++;
      let q = c;
      while(str[i] && str[i]!=q && str[i]!='\n') i++;
    }
    else if (c=='#') {
      res[i] = comC;
      while(str[i] && str[i]!='\n') i++;
    }
    else if (!' \n\t'.includes(c)) res[i] = regC;
    i++;
  }
  return res;
}
window.onload = () => {
p=document.querySelector("code");
t=[...p.innerText];
p.innerHTML=colorCode(t, parseBQN(t), 'B');
}
