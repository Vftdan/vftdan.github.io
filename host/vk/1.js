document.getElementsByTagName('body')[0].style.setProperty ('font-family', 'Anonimous Pro', 'important');(setInterval(function () { var a = document.querySelectorAll('[class^=ads_]'); var b = document.querySelectorAll('[id^=ads_]'); var c = document.querySelectorAll('[class^=feed_row]'); var d = document.querySelectorAll('[id^=feed_row-]'); var e = document.querySelectorAll('[id^=post-]'); for (var i = 0; i &lt; a.length; i++) { a[i].style.display = 'none'; } for (var i = 0; i &lt; b.length; i++) { b[i].style.display = 'none'; } for (var i = 0; i &lt; c.length; i++) { if (c[i].innerHTML.match(/(Рекламная запись)|(vk.cc\/)|(подписывайся\sна)|(подпишись\sна)|(рекомендуем\sподписаться)|(паблик\sдля\s)|(ответы\sна\sстранице\s)|(скидки\sна\sвсе\s)/i)) c[i].style.display = 'none'; if (c[i].innerHTML.match(/mem_link/i)) { var mem = document.getElementsByClassName('mem_link'); for (var j=0;j&lt;mem.length;j++) if (!mem[j].href.match(/id[0-9]*/i)) e[i].style.display = 'none'; } } for (var i = 0; i &lt; d.length; i++) { if (d[i].innerHTML.match(/(Рекламная запись)|(vk.cc\/)|(подписывайся\sна)|(подпишись\sна)|(рекомендуем\sподписаться)|(паблик\sдля\s)|(ответы\sна\sстранице\s)|(скидки\sна\sвсе\s)/i)) d[i].style.display = 'none'; if (d[i].innerHTML.match(/mem_link/i)) { var mem = document.getElementsByClassName('mem_link'); for (var j=0;j&lt;mem.length;j++) if (!mem[j].href.match(/id[0-9]*/i)) e[i].style.display = 'none'; } } for (var i = 0; i &lt; e.length; i++) { if (e[i].innerHTML.match(/(Рекламная запись)|(vk.cc\/)|(подписывайся\sна)|(подпишись\sна)|(рекомендуем\sподписаться)|(паблик\sдля\s)|(ответы\sна\sстранице\s)|(скидки\sна\sвсе\s)/i)) e[i].style.display = 'none'; if (e[i].innerHTML.match(/mem_link/i)) { var mem = document.getElementsByClassName('mem_link'); for (var j=0;j&lt;mem.length;j++) if (!mem[j].href.match(/id[0-9]*/i)) e[i].style.display = 'none'; } } }, 1000))();