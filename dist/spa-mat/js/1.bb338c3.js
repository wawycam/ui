(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[1],{"7c3S":function(t,e,o){"use strict";var n=o("SeyR"),a=o.n(n);a.a},SeyR:function(t,e,o){},dIPi:function(t,e,o){"use strict";o.r(e);var n=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("q-layout",{attrs:{view:"lHh Lpr lFf"}},[o("q-layout-header",[o("q-toolbar",{attrs:{color:"primary",glossy:"mat"===t.$q.theme,inverted:"ios"===t.$q.theme}},[o("q-toolbar-title",[t._v("\n        Wawy Configuration\n      ")]),o("q-btn",{attrs:{flat:""},on:{click:t.haltOrRebootDialog}},[o("q-icon",{attrs:{name:"power_settings_new"}})],1)],1)],1),o("q-page-container",[o("router-view")],1)],1)},a=[];n._withStripped=!0;var i=o("iV8l"),r={name:"MyLayout",methods:{haltOrRebootDialog:function(){var t=this;this.$q.dialog({title:"Halt or Reboot",message:'Type "halt" or "reboot"',prompt:{model:""},cancel:!0}).then(function(e){"halt"===e.toLowerCase()?t.axios.post("/service/halt").then(function(e){201===e.status&&t.$router.push("/notconnected")}):"reboot"===e.toLowerCase()?(t.$q.loading.show({spinner:i["a"],message:"Waiting while rebooting...",spinnerSize:250,spinnerColor:"white"}),t.axios.post("/service/reboot").then(function(e){201===e.status&&setInterval(function(){t.axios.get("/service/serial").then(function(e){200===e.status&&(t.$q.loading.hide(),window.location.reload())})},1e4)})):t.$q.dialog({title:"Alert",message:'Keyword have to be "reboot" or "halt"'})})}}},s=r,l=(o("7c3S"),o("KHd+")),c=Object(l["a"])(s,n,a,!1,null,null,null);e["default"]=c.exports}}]);