(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[2],{0:function(n,a,e){n.exports=e("LzkT")},"A0++":function(n,a,e){"use strict";var t=e("TOJS"),o=e.n(t);o.a},Hl11:function(n,a,e){},LzkT:function(n,a,e){"use strict";e.r(a);e("rGqo"),e("oRQL"),e("0UuB"),e("Hl11"),e("fm0S");var t=e("Kw5r"),o=e("6E/o"),r=e("cFFF"),i=e("IEC1"),u=e("zxLP"),c=e("Rqni"),l=e("MqH6"),p=e("8wy3"),s=e("zmdN"),d=e("SC7v"),h=e("UrUt"),f=e("EYBb"),w=e("HlXa"),Q=e("UG+o"),m=e("uNnR"),v=e("lUGP"),b=e("fUOT"),y=e("eelU"),g=e("XYut"),C=e("WTFv"),S=e("twoJ"),k=e("iV8l"),T=e("74EC"),E=e("CVJq"),L=e("dkar"),O=e("ZYCo"),D=e("OggR"),V=e("3CNK"),q=e("MFSH"),I=e("bduK"),U=e("FSbK"),A=e("Ezub"),z=e("Z4Cl"),H=e("qaCD");t["a"].use(o["a"],{config:{},components:{QLayout:r["a"],QLayoutHeader:i["a"],QLayoutDrawer:u["a"],QPageContainer:c["a"],QPage:l["a"],QToolbar:p["a"],QToolbarTitle:s["a"],QBtn:d["a"],QIcon:h["a"],QList:f["a"],QListHeader:w["a"],QItem:Q["a"],QItemMain:m["a"],QItemTile:v["a"],QItemSide:b["a"],QField:y["a"],QInput:g["a"],QSelect:C["a"],QSpinner:S["a"],QSpinnerGears:k["a"],QAlert:T["a"],QModal:E["a"],QCard:L["a"],QCardTitle:O["a"],QCardMain:D["a"],QCardMedia:V["a"],QCardSeparator:q["a"],QCardActions:I["a"]},directives:{Ripple:U["a"]},plugins:{Notify:A["a"],Dialog:z["a"],Loading:H["a"]}});var P=function(){var n=this,a=n.$createElement,e=n._self._c||a;return e("div",{attrs:{id:"q-app"}},[e("router-view")],1)},F=[];P._withStripped=!0;var M={name:"App"},R=M,x=(e("A0++"),e("KHd+")),J=Object(x["a"])(R,P,F,!1,null,null,null),K=J.exports,j=e("jE9Z"),B=[{path:"/",component:function(){return e.e(3).then(e.bind(null,"dIPi"))},children:[{path:"",component:function(){return Promise.all([e.e(1),e.e(0),e.e(4)]).then(e.bind(null,"iyQ6"))}},{path:"/track/:id",component:function(){return Promise.all([e.e(1),e.e(5)]).then(e.bind(null,"UNkc"))}},{path:"/notconnected",component:function(){return e.e(6).then(e.bind(null,"Xja0"))}}]},{path:"/auth",name:"auth",meta:{auth:!1},component:function(){return e.e(7).then(e.bind(null,"Qf2y"))},children:[{path:"login",name:"login",component:function(){return e.e(0).then(e.bind(null,"ixY9"))}}]}];B.push({path:"*",component:function(){return e.e(8).then(e.bind(null,"5R6h"))}});var G=B;t["a"].use(j["a"]),t["a"].router=new j["a"]({mode:"hash",base:"",scrollBehavior:function(){return{y:0}},routes:G});var N=t["a"].router,X=function(){var n="function"===typeof N?N({}):N,a={el:"#q-app",router:n,render:function(n){return n(K)}};return{app:a,router:n}},Y=e("vDqi"),_=e.n(Y),W=e("p/7L"),Z=e.n(W),$=_.a.create({baseURL:"http://".concat(window.location.hostname,":3001")}),nn=function(n){var a=n.Vue;a.use(Z.a,$)},an=e("MVZn"),en=e.n(an),tn=(e("pIFo"),e("J7Bk")),on=e("hEyz"),rn=e("cfNM"),un=e("+k5Y"),cn=e("r538"),ln=e("QSey"),pn=e("5wOO"),sn=e("Ui0k"),dn=new on["a"]({uri:"".concat("https://api.wawy.io","/graphql")}),hn=new ln["a"]({uri:"".concat("https://api.wawy.io".replace("http","ws"),"/subscriptions"),options:{reconnect:!0,timeout:3e4}}),fn=Object(un["a"])(function(n,a){var e=a.headers,t=localStorage.getItem("default_auth_token");return{headers:en()({},e,{authorization:t?"Bearer ".concat(t):""})}}),wn=Object(cn["e"])(function(n){var a=n.query,e=Object(pn["e"])(a),t=e.kind,o=e.operation;return"OperationDefinition"===t&&"subscription"===o},hn,fn.concat(dn)),Qn=new tn["a"]({link:wn,cache:new rn["a"],connectToDevTools:!0,onError:function(n){console.log(n.graphQLErrors)}}),mn=new sn["a"]({defaultClient:Qn,defaultOptions:{$loadingKey:"loading"}}),vn=function(n){var a=n.app,e=n.Vue;e.use(sn["a"]),a.provide=mn.provide()},bn=e("Hc5T"),yn=e.n(bn),gn=function(n){var a=n.Vue;a.use(yn.a)},Cn=e("ipu6"),Sn=e.n(Cn),kn=e("Whe7"),Tn=e.n(kn),En=e("aA+5"),Ln=e.n(En),On=e("Sua0"),Dn=e.n(On),Vn=function(n){var a=n.Vue;a.use(Sn.a,{auth:Tn.a,http:Ln.a,router:Dn.a,rolesVar:"role",loginData:{url:"".concat("https://api.wawy.io","/auth/login"),method:"POST"},fetchData:{url:"".concat("https://api.wawy.io","/auth/user"),method:"GET",enabled:!0},parseUserData:function(n){return n},tokenExpired:!1,authRedirect:{path:"".concat("https://api.wawy.io","/auth/login")},refreshData:{enabled:!1}})},qn=e("6tWx"),In=e.n(qn),Un=function(n){var a=n.Vue;a.use(In.a)},An=e("dV7z"),zn=function(n){var a=n.Vue;a.use(An,{load:{key:"AIzaSyAklcr2T53GLWOXXPLcEDyt73kqCvDAKAE"}})},Hn=X(),Pn=Hn.app,Fn=Hn.router;[nn,vn,gn,Vn,Un,zn].forEach(function(n){n({app:Pn,router:Fn,Vue:t["a"],ssrContext:null})}),new t["a"](Pn)},TOJS:function(n,a,e){},fm0S:function(n,a,e){}},[[0,10,9]]]);