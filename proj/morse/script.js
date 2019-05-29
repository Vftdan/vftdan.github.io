var Morse = (function(){
	var escapeRE = function(s) {
		s = s.replace(/[\/\\^$*+?.()|[\]{}-]/g, '\\$&').replace(/\n/g, '\\n');
		return s.replace(/\t/g, '\\t').replace(/\r/g, '\\r');
	};
	var Table = function() {
		this.data = Object.create(null);
	};
	Table.prototype = {
		prefix: '\x01',
		add: function(k, v) {
			this.data[this.prefix + k] = v;
		},
		get: function(k) {
			return this.data[this.prefix + k];
		},
		rem: function(k) {
			delete this.data[this.prefix + k];
		},
		keys: function() {
			var p = this.prefix;
			return Object.keys(this.data).filter(function(s) {
				return s[0] == p;
			}).map(function(s) {
				return s.slice(1);
			});
		},
		copy: function() {
			var t = new Table();
			var k = this.keys();
			var i;
			for(i in k) {
				t.add(k[i], this.get(k[i]));
			}
			return t;
		},
		invert: function() {
			var t = new Table();
			var k = this.keys();
			var i;
			for(i in k) {
				t.add(this.get(k[i]), k[i]);
			}
			return t;
		},
		toJSON: function() {
			return JSON.stringify({
				prefix: this.prefix,
				data: this.data,
			});
		},
	};
	Table.from = function(o) {
		var k;
		var t = new Table();
		for(k in o) {
			t.add(k, o[k]);
		}
		return t;
	};
	Table.fromJSON = function(s) {
		var o = JSON.parse(s);
		var t = new Table();
		t.prefix = o.prefix;
		for(i in o.data) {
			t.data[i] = o.data[i];
		}
		return t;
	};
	var tableLat = Table.from({
		'.-': 'A',
		'-...': 'B',
		'-.-.': 'C',
		'-..': 'D',
		'.': 'E',
		'..-.': 'F',
		'--.': 'G',
		'....': 'H',
		'..': 'I',
		'.---': 'J',
		'-.-': 'K',
		'.-..': 'L',
		'--': 'M',
		'-.': 'N',
		'---': 'O',
		'.--.': 'P',
		'--.-': 'Q',
		'.-.': 'R',
		'...': 'S',
		'-': 'T',
		'..-': 'U',
		'...-': 'V',
		'.--': 'W',
		'-..-': 'X',
		'-.--': 'Y',
		'--..': 'Z',
		'-----': '0',
		'.----': '1',
		'..---': '2',
		'...--': '3',
		'....-': '4',
		'.....': '5',
		'-....': '6',
		'--...': '7',
		'---..': '8',
		'----.': '9',
		'.-.-.-': '.',
		'--..--': ',',
		'---...': ':',
		'..--..': '?',
		'.----.': '\'',
		'-.-.--': '!',
		'-....-': '-',
		'-..-.': '/',
		'-.--.': '(',
		'-.--.-': ')',
		'.-...': '&',
		'-.-.-.': ';',
		'.-..-.': '"',
		'.--.-.': '@',
		'-...-': '=',
		'.-.-.': '+',
		'..--.-': '_',
		'...-..-': '$',
		'.-.-': 'Ä',
		'.--.-': 'Á',
		'-.-..': 'Ć',
		'..--.': 'ð'.toUpperCase(),
		'..-..': 'É',
		'.-..-': 'È',
		'----': 'Ĥ',
		'.---.': 'Ĵ',
		'--.--': 'Ñ',
		'---.': 'Ö',
		'...-.': 'Ŝ',
		'.--..': 'Þ',
		'..--': 'Ü',
		'--..-.': 'Ź',
		'--..-': 'Ż',
	});
	var tableCyr = Table.from({
		'.-': 'А',
		'-...': 'Б',
		'.--': 'В',
		'--.': 'Г',
		'-..': 'Д',
		'.': 'Е',
		'...-': 'Ж',
		'--..': 'З',
		'..': 'И',
		'.---': 'Й',
		'-.-': 'К',
		'.-..': 'Л',
		'--': 'М',
		'-.': 'Н',
		'---': 'О',
		'.--.': 'П',
		'.-.': 'Р',
		'...': 'С',
		'-': 'Т',
		'..-': 'У',
		'..-.': 'Ф',
		'....': 'Х',
		'-.-.': 'Ц',
		'---.': 'Ч',
		'----': 'Ш',
		'--.-': 'Щ',
		'--.--': 'Ъ',
		'-.--': 'Ы',
		'-..-': 'Ь',
		'..-..': 'Э',
		'..--': 'Ю',
		'.-.-': 'Я',
		'-----': '0',
		'.----': '1',
		'..---': '2',
		'...--': '3',
		'....-': '4',
		'.....': '5',
		'-....': '6',
		'--...': '7',
		'---..': '8',
		'----.': '9',
		'.-.-.-': '.',
		'--..--': ',',
		'---...': ':',
		'..--..': '?',
		'.----.': '\'',
		'-.-.--': '!',
		'-....-': '-',
		'-..-.': '/',
		'-.--.': '(',
		'-.--.-': ')',
		'.-...': '&',
		'-.-.-.': ';',
		'.-..-.': '"',
		'.--.-.': '@',
		'-...-': '=',
		'.-.-.': '+',
		'..--.-': '_',
		'...-..-': '$',
	});
	var TableForm = function(table) {
		this.bindTable(table);
		this.root = document.createElement('form');
		this.root.setAttribute('class', 'morsetableform');
		this.root.onSubmit = function(e) {
			this.update();
			e.preventDefault();
			return false;
		};
		this.elements = [];
	};
	TableForm.prototype = {
		bindTable: function(table) {
			if(table == null)
				table = new Table();
			this.table = table;
		},
		createEntry: function() {
			var kInp = document.createElement('input');
			var vInp = document.createElement('input');
			this.elements.push([kInp, vInp]);
			var div = document.createElement('div');
			var label = document.createElement('label');
			label.innerText = ': ';
			div.appendChild(kInp);
			div.appendChild(label);
			div.appendChild(vInp);
			this.root.appendChild(div);
			return [kInp, vInp];
		},
		readEntries: function() {
			var i;
			var e = this.elements;
			for(i in e) {
				var k = e[i][0].value;
				var v = e[i][1].value;
				k = k.replace(/[^.-]/g, '');
				v = v.replace(/^\s+|\s+$/g, '').toUpperCase();
				if(v.length == 0)
					this.table.rem(k);
				else
					this.table.add(k, v);
			}
		},
		writeEntries: function() {
			var t = this.table;
			var keys = t.keys();
			this.elements.length = 0;
			this.root.innerHTML = '';
			var i;
			for(i in keys) {
				var kv = this.createEntry();
				kv[0].value = keys[i];
				kv[1].value = t.get(keys[i]);
			}
		},
		update: function() {
			this.readEntries();
			this.writeEntries();
		},
	};
	var decode = function(data, table, onError, dotPtn, dashPtn, charSep, wordSep) {
		var d;
		if(wordSep)
			d = data.split(wordSep);
		else
			d = [data];
		d = d.map(function(ln) {
			return ln.split(charSep);
		});
		var outData = [];
		var i, j;
		for(i in d) {
			if(+i)
				outData.push(' ');
			for(j in d[i]) {
				var token = d[i][j];
				var m;
				var k = '';
				while(token.length) {
					if(m = token.match(dotPtn)) {
						k += '.';
						token = token.slice(m[0].length);
						if(m[0].length == 0) {
							onError('Zero-length dot');
							token = '';
						}
					} else if(m = token.match(dashPtn)) {
						k += '-';
						token = token.slice(m[0].length);
						if(m[0].length == 0) {
							onError('Zero-length dash');
							token = '';
						}
					} else {
						if(k.length) {
							var c = table.get(k);
							if(c === undefined) {
								onError('Undefined letter: ' + k);
							} else {
								outData.push(c);
							}
						}
						outData.push(token[0]);
						token = token.slice(1);
					}
				}
				if(k.length) {
					var c = table.get(k);
					if(c === undefined) {
						onError('Undefined letter: ' + k);
					} else {
						outData.push(c);
					}
				}
			}
		}
		return outData.join('');
	};
	return {
		Table: Table,
		TableForm: TableForm,
		tableLat: tableLat,
		tableCyr: tableCyr,
		decode: decode,
		escapeRE: escapeRE,
	};
})();
