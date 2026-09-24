/* Prophexy sky — low-precision ephemeris (Schlyter's method, ~arcminute for the planets,
   a few arcminutes for the Moon). Tropical longitudes, equinox of date. Enough to place
   every body in its sign and house to the day, detect retrogrades and find ingress dates. */
(function(root){
  var R=Math.PI/180;
  function rev(x){ x=x%360; return x<0?x+360:x; }
  function sind(x){return Math.sin(x*R);} function cosd(x){return Math.cos(x*R);}
  function atan2d(y,x){return Math.atan2(y,x)/R;}
  /* days since 2000 Jan 0.0 UT */
  function dayNum(date){ return date.getTime()/86400000+2440587.5-2451543.5; }
  function kepler(M,e){ var E=M+e/R*sind(M)*(1+e*cosd(M)); for(var i=0;i<6;i++){ E=E-(E-e/R*sind(E)-M)/(1-e*cosd(E)); } return E; }
  var EL={
    Mercury:function(d){return [48.3313+3.24587e-5*d,7.0047+5.00e-8*d,29.1241+1.01444e-5*d,0.387098,0.205635+5.59e-10*d,168.6562+4.0923344368*d];},
    Venus:function(d){return [76.6799+2.46590e-5*d,3.3946+2.75e-8*d,54.8910+1.38374e-5*d,0.723330,0.006773-1.302e-9*d,48.0052+1.6021302244*d];},
    Mars:function(d){return [49.5574+2.11081e-5*d,1.8497-1.78e-8*d,286.5016+2.92961e-5*d,1.523688,0.093405+2.516e-9*d,18.6021+0.5240207766*d];},
    Jupiter:function(d){return [100.4542+2.76854e-5*d,1.3030-1.557e-7*d,273.8777+1.64505e-5*d,5.20256,0.048498+4.469e-9*d,19.8950+0.0830853001*d];},
    Saturn:function(d){return [113.6634+2.38980e-5*d,2.4886-1.081e-7*d,339.3939+2.97661e-5*d,9.55475,0.055546-9.499e-9*d,316.9670+0.0334442282*d];}
  };
  function sun(d){
    var w=282.9404+4.70935e-5*d, e=0.016709-1.151e-9*d, M=rev(356.0470+0.9856002585*d);
    var E=kepler(M,e), xv=cosd(E)-e, yv=Math.sqrt(1-e*e)*sind(E);
    var v=atan2d(yv,xv), r=Math.sqrt(xv*xv+yv*yv), lon=rev(v+w);
    return {lon:lon,r:r,x:r*cosd(lon),y:r*sind(lon),M:M,w:w};
  }
  function helio(name,d){
    var el=EL[name](d), N=el[0],i=el[1],w=el[2],a=el[3],e=el[4],M=rev(el[5]);
    var E=kepler(M,e), xv=a*(cosd(E)-e), yv=a*Math.sqrt(1-e*e)*sind(E);
    var v=atan2d(yv,xv), r=Math.sqrt(xv*xv+yv*yv);
    var xh=r*(cosd(N)*cosd(v+w)-sind(N)*sind(v+w)*cosd(i));
    var yh=r*(sind(N)*cosd(v+w)+cosd(N)*sind(v+w)*cosd(i));
    return {x:xh,y:yh,M:M};
  }
  function planet(name,d,S){
    S=S||sun(d); var h=helio(name,d);
    var lon=rev(atan2d(h.y+S.y,h.x+S.x));
    if(name==='Jupiter'||name==='Saturn'){
      var Mj=rev(19.8950+0.0830853001*d), Ms=rev(316.9670+0.0334442282*d);
      lon+= name==='Jupiter'? -0.332*sind(2*Mj-5*Ms-67.6) : 0.812*sind(2*Mj-5*Ms-67.6);
    }
    return rev(lon);
  }
  function moon(d,S){
    S=S||sun(d);
    var N=125.1228-0.0529538083*d, i=5.1454, w=318.0634+0.1643573223*d, a=60.2666, e=0.0549, M=rev(115.3654+13.0649929509*d);
    var E=kepler(M,e), xv=a*(cosd(E)-e), yv=a*Math.sqrt(1-e*e)*sind(E);
    var v=atan2d(yv,xv), r=Math.sqrt(xv*xv+yv*yv);
    var xh=r*(cosd(N)*cosd(v+w)-sind(N)*sind(v+w)*cosd(i));
    var yh=r*(sind(N)*cosd(v+w)+cosd(N)*sind(v+w)*cosd(i));
    var lon=atan2d(yh,xh);
    var Ls=rev(S.M+S.w), Lm=rev(M+w+N), D=Lm-Ls, F=Lm-N;
    lon+= -1.274*sind(M-2*D)+0.658*sind(2*D)-0.186*sind(S.M)-0.059*sind(2*M-2*D)-0.057*sind(M-2*D+S.M)
      +0.053*sind(M+2*D)+0.046*sind(2*D-S.M)+0.041*sind(M-S.M)-0.035*sind(D)-0.031*sind(M+S.M)
      -0.015*sind(2*F-2*D)+0.011*sind(M-4*D);
    return rev(lon);
  }
  var BODIES=['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Rahu'];
  function positions(date){
    var d=dayNum(date), S=sun(d), o={Sun:S.lon, Moon:moon(d,S)};
    ['Mercury','Venus','Mars','Jupiter','Saturn'].forEach(function(p){ o[p]=planet(p,d,S); });
    o.Rahu=rev(125.1228-0.0529538083*d); o.Ketu=rev(o.Rahu+180);
    return o;
  }
  function lonOf(body,date){ var d=dayNum(date);
    if(body==='Sun')return sun(d).lon; if(body==='Moon')return moon(d); if(body==='Rahu')return rev(125.1228-0.0529538083*d); if(body==='Ketu')return rev(305.1228-0.0529538083*d);
    return planet(body,d); }
  function retro(body,date){ if(body==='Sun'||body==='Moon')return false; if(body==='Rahu'||body==='Ketu')return true;
    var a=lonOf(body,new Date(date.getTime()-43200000)), b=lonOf(body,new Date(date.getTime()+43200000));
    var df=((b-a+540)%360)-180; return df<0; }
  /* ascendant, degrees; lat/lng in degrees, date = the UT instant of birth */
  function ascendant(date,lat,lng){
    var d=dayNum(date), S=sun(d), Ls=rev(S.M+S.w);
    var ut=(date.getUTCHours()+date.getUTCMinutes()/60+date.getUTCSeconds()/3600);
    var lst=rev(Ls+180+ut*15+lng), ecl=23.4393-3.563e-7*d;
    return rev(atan2d(cosd(lst), -(sind(lst)*cosd(ecl)+Math.tan(lat*R)*sind(ecl))));
  }
  /* rough standard-time offset from coordinates, hours (no tz database on-device) */
  function tzGuess(lat,lng){
    if(lat==null||lng==null)return 5.5;
    if(lat>6&&lat<37&&lng>68&&lng<97.5)return 5.5;        /* India */
    if(lat>18&&lat<54&&lng>97.5&&lng<135)return 8;         /* China */
    if(lat>24&&lat<27&&lng>51&&lng<56.5)return 4;          /* UAE */
    return Math.round(lng/15*2)/2;
  }
  var SIGNS=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  function sign(lon){ return SIGNS[Math.floor(rev(lon)/30)]; }
  function sep(a,b){ var x=Math.abs(rev(a)-rev(b)); return x>180?360-x:x; }
  root.PXSky={dayNum:dayNum,positions:positions,lonOf:lonOf,retro:retro,ascendant:ascendant,tzGuess:tzGuess,
    SIGNS:SIGNS,sign:sign,sep:sep,rev:rev,BODIES:BODIES};
})(typeof window!=='undefined'?window:globalThis);
