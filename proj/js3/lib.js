try {
	//alert(0)

	new(function(libName) {
		var copyFunc = function(scope, func) {
			return function() {
				return func.apply(scope, arguments)
			};
		}
		var descendObj = function(p, o) {
			var f = function() {};
			var i;
			f.prototype = p;
			var r = new f();
			for (i in o) r[i] = o[i];
			return r;
		}
		var lib = this;
		var Graphics;
		var Timer;
		var LinkURL;
		var Vectors;
		var compFloat;
		var absMod;
		var PI = Math.acos(-1);
		var DEG = PI / 180;
		var getView;
		var R = {
			values: {},
			colors: {}
		};
		var baseView = {};
		var withProto, subClass, bufferStruct, isInstanceOf;
		var View;
		var Network;
		var Calc;
		var swapArrs;
		this.compFloatBits = 16;
		swapArrs = function(a, b, l) {
			var i;
			for (i = 0; i < l; i++) {
				a ^= b ^= a;
				b ^= a;
			}
		}
		absMod = function(a, b) {
			return (a % b + b) % b
		}
		compFloat = function(a, b) {
			var m = 1 << lib.compFloatBits;
			a = Math.round(a * m) / m;
			b = Math.round(b * m) / m;
			return a == b
		}
		View = function(el, opt) {
			if (!(this instanceof View)) return new View(el, opt);
			var TN, i, ID, par, parv;
			if (!(el || opt)) return this;
			if (!el || el.constructor == Object) {
				opt = opt || el;
				TN = opt.tagName.toUpperCase();
				ID = opt.id || opt.attrs.id;
				par = opt.parent || (opt.parentView && opt.parentView.element);
				parv = getView(par);
				this.parent = par;
				this.parentView = parv;
				el = document.createElement(TN);
				//document.write([TN, el, el]);
				el.innerHTML = opt.innerHTML || el.innerHTML || '';
				this.element = el;
				this.tagName = TN;
				this.id = ID;
				for (i in opt.attrs) this.attr(i, opt.attrs[i]);
				el.VIEW = this;
				if (el.constructor == HTMLDocument) this.parentView = baseView;
				return this;
			}
			if (!opt && el.constructor != Object) {
				return new View(el, {});
				/*TN = el.tagName.toUpperCase();
				ID = el.id || el.getAttribute("id");
				//alert([el,el.parentNode])
				par = el.parentNode;
				parv = getView(parv);
				this.parent = par;
				this.parentView = parv;
				el.VIEW = this;
				this.element = el;
				this.tagName = TN;
				this.id = ID;
				return this;*/
			}

			var i;
			for (i in opt.attrs) this.attr(i, opt.attrs[i]);
			TN = (el.tagName || "{NONE}").toUpperCase();

			ID = el.id || (el.getAttribute && el.getAttribute("id")) || "";
			par = el.parentNode;
			parv = getView(par);
			//alert([par, parv, View(document)])
			this.parent = par;
			this.parentView = parv;
			el.VIEW = this;
			this.element = el;
			this.tagName = TN;
			this.id = ID;
			//document.write(this.element.getAttribute)
			if (el.constructor == HTMLDocument) this.parentView = baseView;
		};
		View.prototype = {
			parent: document.body,
			parentView: null,
			element: null,
			id: "",
			tagName: "",
			setStyle: function(k, v) {
				var s = k.split(''),
					i;
				for (i = 0; i < s.length; i++) {
					if (s[i] == '-') {
						s[i] = '';
						if (i != s.length - 1) {
							s[i + 1] = s[i + 1].toUpperCase()
						};
					}
				}
				k = s.join('');
				this.element.style[k] = v.toString();
			},
			attr: function(k, v) {
				if (arguments.length == 1) return this.element.getAttribute(k) || this.element.hasAttribute(k);
				if (v === false) {
					this.element.removeAttribute(k);
					return v
				};
				if (v === true) {
					this.element.setAttribute(k);
					return v
				};
				this.element.setAttribute(k, v);
				return v;
			},
			toString: function(d) {
				var shPar = true;
				if (!d && d !== 0) d = lib.defaultViewToStringDepth;
				if (d == 0) shPar = false;
				//alert(lib.defaultViewToStringDepth);
				with(this) {
					//if(element.constructor == HTMLDocument)
					return "[VIEW tagName=\"" + tagName + "\" id=\"" + id + (shPar ? "\" parentView=\"" + parentView.toString(d - 1) : '') + "\"]"
				}
			},
			push: function(e) {
				this.element.appendChild(e.element)
			},
			pushBack: function(e) {
				this.element.insertBefore(e.element, this.element.firstChild)
			},
			getRelClickCoords: function(ev, scale) {
				var r = this.element.getBoundingClientRect();
				//alert([r.left, r.top]);
				return [(ev.clientX - r.left) * scale, (ev.clientY - r.top) * scale];
			}
		}
		getView = function(e) {
			return e ? (isInstanceOf(e, View) && e || e.VIEW || View(e)) : "[NONE]";
		}
		this.defaultViewToStringDepth = 0;
		baseView = new View(document);
		baseView.toString = function() {
			return "[VIEW baseView]"
		};
		var GE = function(t, s) {
			var e = GE[t](s),
				i;
			if (['tagName', 'name'].indexOf(t) != -1) {
				e = [].slice.apply(e, [0]);
				for (i = 0; i < e.length; i++) e[i] = getView(e[i]);
				return e;
			}
			return getView(e);
		}
		GE.id = copyFunc(document, document.getElementById);
		GE.tagName = copyFunc(document, document.getElementsByTagName);
		GE.name = copyFunc(document, document.getElementsByName);
		GE.q = copyFunc(document, document.querySelector);

		Calc = (function(f) {
			var C, c, i;
			C = function(args) {
				return f.apply(C, args);
			}
			c = {
				ifNaN: function(a, b) {
					a = Number(a);
					return a == a ? a : b
				},
				pow: function(b, e) {
					return Math.pow(b, this.ifNaN(e, 2))
				},
				root: function(b, e) {
					return this.pow(b, e ? 1 / e : .5)
				},
				pythag: function(a, d) {
					if (!Array.isArray(a)) return this.pythag([].slice.call(arguments, 0));
					var i, n, s = 0;
					for (i = 0; i < a.length; i++) {
						n = Number(a[i]);
						if (n != n) {
							if (d == d && d != undefined) n = d;
							else return NaN;
						};
						s += this.pow(n);
					}
					return this.root(s);
				},
				clamp: function(a, b, c) {
					a = +a || 0;
					b = +b || 0;
					c = +c || 0;
					return a + b + c - Math.max(a, b, c) - Math.min(a, b, c);
				},
				divide: function(a, b, d) {
					return b ? a / b : (d || 0);
				}
			};
			for (i in c) C[i] = c[i];
			return C;

		})(function(s) {

		});

		withProto = function(scope, p, f, _static) {
			var c, i;
			_static = _static || {};
			c = function() {
				//alert(arguments.length);
				var args = arguments;
				var a = function() {
					return c.apply(this, args)
				};
				a.prototype = c.prototype;
				if (!(this instanceof c || this.constructor == c)) {
					return new a()
				};
				this.constructor = c;
				//alert(f.apply)
				return f.apply(this, arguments) || this;
			};
			c.toString = copyFunc(f, f.toString);
			for (i in _static) {
				c[i] = _static[i]
			};
			c.prototype = p;
			return c;
		}
		subClass = function(_super, p, f, _static) {
			_static = _static || {};
			var c = function() {

				var args = arguments;
				var a = function() {
					return c.apply(this, args)
				};
				a.prototype = c.prototype;
				if (!(this instanceof c || this.constructor == c)) {
					return new a()
				};
				this.constructor = c;
				var Super = function() {
					this.constructor = _super;
					var r = _super.apply(this, arguments) || this;
					this.constructor = c;
					if (r != this)
						for (var i in r) this[i] = r[i];
				}
				this.Super = Super;
				return f.apply(this, arguments) || this;
			}
			for (i in _super) {
				c[i] = _super[i]
			};
			for (i in _static) {
				c[i] = _static[i]
			};
			c.__supers = c.__supers ? c.__supers.slice(0) : [];
			c.__supers.push(_super);
			c.prototype = descendObj(_super.prototype || _super.proto, p);
			return c;
		}
		/*var _bufStructProto = {

		};*/
		bufferStruct = function(constr, _static, l) {
			var C = function() {
				var r = (this instanceof C) ? this : {
					_setBufferSize: C.prototype._setBufferSize,
					_appendToBuffer: C.prototype._appendToBuffer
				};
				if (l) r._setBufferSize(l);
				constr.apply(r, arguments);
				return r;
			}
			C.prototype = {
				_setBufferSize: function(l) {
					if (this.buffer) {
						this.buffer = ArrayBuffer.transfer(this.buffer, l)
					} else {
						this.buffer = new ArrayBuffer(l)
					}
				},
				_appendToBuffer: function(a, l) {
					if (a.constructor == Number) {
						var A = new Float32Array(this.buffer, this.byteOffset, 1);
						A[0] = a
					} else if (a.constructor == Array || a.constructor == Float32Array) {
						var i;
						l = l || a.length;
						var A = new Float32Array(this.buffer, this.byteOffset, l);
						for (i = 0; i < l; i++) {
							A[i] = a[i] || 0.0
						}
					} else if (a.buffer) {
						a = new Float32Array(a.buffer);
						var i;
						l = l || a.length;
						var A = new Float32Array(this.buffer, this.byteOffset, l);
						for (i = 0; i < l; i++) {
							A[i] = a[i] || 0.0
						}
					} else {
						l = a.writeToF32Buffer(this.buffer, +this.byteOffset, l) || l;
						A = new Float32Array(this.buffer, this.byteOffset, l)
					};
					this.byteOffset += l << 2;
					return A
				},
				byteOffset: 0
			};
			var i;
			for (i in _static) C[i] = _static[i];
			return C;
		}
		isInstanceOf = function(e, c) {
			if (e instanceof c || (typeof e) == c) return true;
			if (e.constructor == c || e.constructor.__supers && e.constructor.__supers.indexOf(c) != -1) return true;
			return false;
		}

		Vectors = {
			Vec: withProto(lib, {
				writeToF32Buffer: function(b, o, l) {
					var a, i;
					if (Array.isArray(b)) {
						if (o % 4) throw 'Cannot use offset of ' + o + ' bytes in dynamic array';
						a = {
							set: function(i, v) {
								b[(o >> 2) + i] = v
							}
						}
					} else {
						if (b.buffer) {
							b = b.buffer;
							o += (+b.byteOffset) || 0;
						};
						b = new Float32Array(b, o, l);
						a = {
							set: function(i, v) {
								b[i] = v
							}
						}
					};
					for (i = 0; i < l; i++) {
						a.set(i, this.dims[i] || 0.0);
					};
				},
				copy: function() {
					return new Vectors.Vec(this.dims)
				},
				toString: function() {
					return '{' + this.dims.join(', ') + '}'
				},
				resize: function(l) {
					var i;
					for (i = this.d; i < l; i++) this.dims[i] = 0;
					this.d = Math.max(l, this.d)
				},
				addSelf: function(v2) {
					var i;
					v2 = v2.copy();
					Vectors.Vec.toMaxDimNum(this, v2);
					for (i = 0; i < this.d; i++) {
						this.dims[i] += v2.dims[i]
					}
				},
				subSelf: function(v2) {
					var i;
					v2 = v2.copy();
					Vectors.Vec.toMaxDimNum(this, v2);
					for (i = 0; i < this.d; i++) {
						this.dims[i] -= v2.dims[i]
					}
				},
				mulSelf: function(m) {
					if (!m) {
						var i;
						for (i = 0; i < this.d; i++) {
							this.dims[i] = 0
						}
					}
					var _type = 0;
					if (isInstanceOf(m, Number)) _type = 1;
					if (isInstanceOf(m, Vectors.SqMatrix)) _type = 2;
					switch (_type) {
						case 1:
							var i;
							for (i = 0; i < this.d; i++) this.dims[i] *= m;
							break;
						case 2:
							var i, j, l = this.d;
							m.expandTo(l);
							var a = this.dims.slice(0),
								b = m.vals;
							for (i = 0; i < l; i++) {
								this.dims[i] = 0;
								for (j = 0; j < l; j++) {
									this.dims[i] += a[j] * b[i][j]
								}
							};
							break;
						default:
							break;
					}
				},
				neg: function() {
					var v = this.copy();
					v.mulSelf(-1);
					return v
				},
				abs: function() {
					var i, s = 0;
					for (i = 0; i < this.d; i++) {
						s += this.dims[i] * this.dims[i];
					}
					return Math.sqrt(s);
				},
				taxicabAbs: function() {
					var i, s = 0;
					for (i = 0; i < this.d; i++) {
						s += Math.abs(this.dims[i]);
					}
					return s;
				},
				sum: function() {
					var i, s = 0;
					for (i = 0; i < this.d; i++) {
						s += this.dims[i];
					}
					return s;
				},
				normSelf: function() {
					this.mulSelf(1 / this.abs());
				},
				mulEachSelf: function(v2) {
					var i;
					v2 = v2.copy();
					Vectors.Vec.toMaxDimNum(this, v2);
					for (i = 0; i < this.d; i++) {
						this.dims[i] *= v2.dims[i]
					}
				},
				mulScal: function(v2) {
					return Vectors.Vec.mulEach(this, v2).sum();
				},
				cos: function(v2) {
					return this.mulScal(v2) / this.abs() / v2.abs();
				},
				rmulSelf: function(m) {
					if (!isInstanceOf(m, Vectors.SqMatrix)) return;
					var i, j, l = this.d;
					m.expandTo(l);
					var a = this.dims.slice(0),
						b = m.vals;
					for (i = 0; i < l; i++) {
						this.dims[i] = 0;
						for (j = 0; j < l; j++) {
							this.dims[i] += a[j] * b[j][i]
						}
					};
				}
			}, function(a) {
				var L;
				//alert(a)
				if (!a) a = [];
				if (a.constructor != [].constructor) {
					a = [].slice.call(arguments, 0)
				} else {
					a = a.slice(0)
				};
				L = a.length;
				this.d = L;
				this.dims = a;
			}, {
				toMaxDimNum: function(v1, v2) {
					var l = Math.max(v1.d, v2.d);
					v1.resize(l);
					v2.resize(l);
					return l
				},
				Resized: function(v, l) {
					v = v.copy();
					v.resize(l);
					return v
				},
				add: function(v1, v2) {
					v1 = v1.copy();
					v1.addSelf(v2);
					return v1
				},
				sub: function(v1, v2) {
					v1 = v1.copy();
					v1.subSelf(v2);
					return v1
				},
				mul: function(v1, v2) {
					v1 = v1.copy();
					v1.mulSelf(v2);
					return v1
				},
				norm: function(v) {
					v = v.copy();
					v.normSelf();
					return v
				},
				mulEach: function(v1, v2) {
					v1 = v1.copy();
					v1.mulEachSelf(v2);
					return v1
				},
				rmul: function(v1, v2) {
					v1 = v1.copy();
					v1.rmulSelf(v2);
					return v1
				}
			}),
			deg: function(a) {
				return DEG * a
			},
			SqMatrix: withProto(lib, {
				copy: function() {
					var m = [],
						i;
					for (i = 0; i < this.length; i++) {
						m[i] = this.vals[i].slice(0)
					};
					return new this.constructor(m)
				},
				toString: function() {
					return '[' + this.vals.join('\n') + ']'
				},
				addDim: function() {
					var i, l = this.length,
						m = this.vals;
					m[l] = [];
					m[l].toString = function() {
						return this.join('\t')
					};
					for (i = 0; i < l; i++) {
						m[i][l] = 0;
						m[l][i] = 0
					};
					m[l][l] = 1;
					this.length++
				},
				expandTo: function(a) {
					var i;
					for (i = this.length; i < a; i++) this.addDim()
				},
				mulSelf: function(m2) {
					var m1 = this.constructor.mul(this, m2);
					this.length = m1.length;
					this.vals = m1.vals
				},
				transposeSelf: function() {
					var t, i, j, l = this.length;
					for (i = 0; i < l; i++) {
						for (j = 0; j < i; j++) {
							t = this.vals[i][j];
							this.vals[i][j] = this.vals[j][i];
							this.vals[j][i] = t;
						}
					}
				},
				transpose: function() {
					var m = this.copy();
					m.transposeSelf();
					return m
				}
			}, function(m) {
				if (arguments.length == 0) m = [];
				if (arguments.length > 1 || (arguments[0] && arguments[0].length === undefined)) m = [].slice.call(arguments, 0);
				var i, j, l = m.length;
				for (i = 0; i < m.length; i++) {
					l = Math.max(l, m[i].length);
				}
				this.length = l;
				for (i = 0; i < l; i++) {
					m[i] = m[i] || [];
					m[i].toString = function() {
						return this.join('\t')
					};
					for (j = m[i].length; j < l; j++) {
						m[i][j] = 1 * (i == j);
					}
				}
				this.vals = m;
			}, {
				toMaxLength: function(m1, m2) {
					var l = Math.max(m1.length, m2.length);
					m1.expandTo(l);
					m2.expandTo(l);
					return l
				},
				mul: function(a, b) {
					var l = this.toMaxLength(a, b);
					var c = new Vectors.SqMatrix();
					c.expandTo(l);
					var i, j, r;
					for (i = 0; i < l; i++)
						for (j = 0; j < l; j++) {
							c.vals[i][j] = 0;
							for (r = 0; r < l; r++) c.vals[i][j] += a.vals[i][r] * b.vals[r][j]
						};
					return c
				},
				rotMx: function(a, d) {
					d = d || [0, 1];
					if (d.split) {
						d = d.split('');
						d = d.map(function(c) {
							switch (c) {
								case 'x':
									return 0;
								case 'y':
									return 1;
								case 'z':
									return 2;
								default:
									return 3;
							}
						})
					};
					var l = Math.max(d[0], d[1]) + 1;
					var Mx = new this();
					Mx.expandTo(l);
					var M = Mx.vals;
					var d1 = d[0],
						d2 = d[1];
					var cos = Math.cos(a),
						sin = Math.sin(a);
					M[d1][d1] = M[d2][d2] = cos;
					M[d1][d2] = -sin;
					M[d2][d1] = sin;
					return Mx
				}
			}),
			Transformator: withProto(lib, {
				toString: function() {
					return 'Transformator:{\n' + ([this.m, this.v, this.dv, this.dn]).join('\n') + '\n}'
				},
				setTransformator: function(t) {
					this.m = t.m.copy();
					this.v = t.v.copy();
					this.dv = t.dv.copy();
					this.dn = t.dn
				},
				copy: function() {
					var t = new this.constructor();
					t.setTransformator(this);
					return t
				},
				mulMx: function(m) {
					this.m.mulSelf(m);
					this.v.mulSelf(m);
					return this
				},
				rot: function(a, d) {
					with(Vectors.SqMatrix) {
						var m = rotMx(a, d);
						return this.mulMx(m)
					}
				},
				mov: function(v) {
					this.v.addSelf(v);
					return this
				},
				rotAround: function(v, a, d) {},
				div: function(a) {
					this.dn *= a;
					this.dv.mulSelf(a)
				},
				addDivVec: function(v) {
					this.dv.addSelf(v)
				},
				proceedSelf: function(a) {
					var i, d;
					for (i = 0; i < a.length; i++) {
						if (isInstanceOf(a[i], Vectors.Vec)) {
							d = this.dn + this.dv.mulScal(a[i]);
							a[i].mulSelf(this.m);
							a[i].addSelf(this.v);
							a[i].mulSelf(Calc.divide(1, d, (this.dn > 0) ? (-1 >>> 1) : ~(-1 >>> 1)))
						} else if (isInstanceOf(a[i], Vectors.SqMatrix)) {
							a[i].mulSelf(this.m)
						}
					};
					return a
				},
				proceed: function(a) {
					var i, b = [];
					for (i = 0; i < a.length; i++) {
						if (!a[i]) continue;
						b[i] = a[i].copy()
					};
					return this.proceedSelf(b)
				},
				transposeSelf: function() {
					var v = this.v;
					this.m.tansposeSelf();
					this.v = this.dv;
					this.dv = v;
				},
				transpose: function() {
					var t = this.copy();
					t.transposeSelf();
					return t
				},
				appendTransform: function(t) {
					if (isInstanceOf(t, Vectors.Transformator)) {
						this.m.mulSelf(t.m);
						this.dn *= t.dn;
					}
				}
			}, function() {
				var m = new Vectors.SqMatrix();
				this.m = m;
				var v = new Vectors.Vec();
				this.v = v;
				var dn = 1.0;
				this.dn = dn;
				var dv = new Vectors.Vec();
				this.dv = dv;
			})
			//,Perspective: withProto(lib, {proceed: function(a){var i, j, b=[]; for(i=0; i<a.length; i++){if(!a[i].dims){b[i] = a[i].copy&&a[i].copy()||a[i]}else{b[i] = a[i].copy(); for(j in b[i].dims){if(j!=this.di)b[i].dims[j] /= b[i].dims[this.di] / this.dist;}}}; return b }}, function(di, dist) {this.di = di; this.dist = dist}, {})
		}
		Graphics = withProto(lib, {
			bindView: function(C) {
				C = getView(C);
				if (C == '[NONE]') C = this.constructor.canvView();
				this.canv = C;
				return C
			},
			getIndex: function(x, y) {
				x = Math.round(x);
				y = Math.round(y);
				if (x < 0 || x >= this._iData.width) {
					if (this.wrapX) {
						x = absMod(x, this._iData.width)
					} else {
						return -1
					}
				};
				if (y < 0 || y >= this._iData.height) {
					if (this.wrapY) {
						y = absMod(y, this._iData.height)
					} else {
						return -1
					}
				};
				//document.write([x, y]);
				return this._iData.width * y + x;
			},
			putPixel: function(p, c) {
				var i = this.getIndex(p.dims[0] || 0, p.dims[1] || 0);
				if (i == -1) return;
				this.pixels[i].setColor(c);
			},
			saveChanges: function() {
				this.canv.element.width = this._iData.width;
				this.canv.element.height = this._iData.height;
				if (!this.canv.CTX) return;
				this.canv.CTX.putImageData(this._iData, 0, 0);
			},
			loadChanges: function() {
				this._iData = this.canv.CTX.getImageData(0, 0, this.canv.element.width, this.canv.element.height);
				var i, sq = this._iData.height * this._iData.width;
				for (i = 0; i < sq; i++) {
					if (i < this.pixels.length) {
						this.pixels[i].srcs[0] = this._iData.data;
					} else {
						this.pixels.push(new this.constructor.Color(this._iData.data, i * 4));
					}
				}
			},
			putTo: function(c, v) {
				if (c.constructor == Graphics) return this.putTo(c.canv, v);
				v = v || new Vectors.Vec([0, 0]);
				v.resize(2);
				c.CTX.putImageData(this._iData, v.dims[0], v.dims[1]);
			},
			wrapX: false,
			wrapY: false,
			drawImg: function(img, pos, size, cropStart, cropSize, rot, rcenter) {
				if (img.constructor == Graphics) return this.drawImg(img.canv.element, pos, size, cropStart, cropSize, rot, rcenter);
				with(this.canv.CTX) {
					save();
					if (!pos) {
						pos = new Vectors.Vec(0, 0);
					} else {
						pos = pos.copy();
					}
					pos.resize(2);
					if (rot) {
						if (!rcenter) rcenter = new Vectors.Vec(0, 0);
						pos.subSelf(rcenter);
						pos.mulSelf(Vectors.SqMatrix.rotMx(-rot));
						rotate(rot);
					}
					pos.resize(2);
					if (!cropStart && cropSize) {
						cropStart = new Vectors.Vec(0, 0);
						cropStart.resize(2)
					}
					//if(cropStart) {cropStart.dims[0] -= 1; cropStart.dims[1] -= 1}
					/*console.log(cropStart + '', cropSize + '');*/
					if (!size) {
						if (!cropSize) drawImage(img, pos.dims[0], pos.dims[1]);
						else {
							drawImage(img, cropStart.dims[0], cropStart.dims[1], cropSize.dims[0], cropSize.dims[1], pos.dims[0], pos.dims[1], cropSize.dims[0], cropSize.dims[1]); /*alert(0)*/
						}
					} else {
						if (!cropSize) drawImage(img, pos.dims[0], pos.dims[1], size.dims[0], size.dims[1]);
						else {
							drawImage(img, cropStart.dims[0], cropStart.dims[1], cropSize.dims[0], cropSize.dims[1], pos.dims[0], pos.dims[1], size.dims[0], size.dims[1]); /*alert(1)*/
						}
					}
					//document.write([size, !!size, !!0, cropStart, cropSize]);
					restore();
				}
			},
			toUrl: function(mime, q) {
				mime = mime || 'image/png';
				return this.canv.element.toDataURL(mime, q);
			},
			cls: function(fast) {
				if (!fast) {
					var idd = this._iData.data;
					if (idd.fill) idd.fill(0);
					else if ([].fill)[].fill.apply(this._iData.data, [0]);
					else {
						var i;
						for (i = 0; i < idd.length; i++) idd[i] = 0
					}
				} else {
					this.canv.CTX.clearRect(0, 0, this.canv.element.width, this.canv.element.height)
				};
			}

		}, function(d, s) {
			d = d || [0, 1];
			if (d.split) {
				d = d.split('');
				d = d.map(function(c) {
					switch (c) {
						case 'x':
							return 0;
						case 'y':
							return 1;
						case 'z':
							return 2;
						default:
							return 3;
					}
				})
			};
			var w = s.dims[d[0]],
				h = s.dims[d[1]],
				i;
			var sq = h * w;

			this._iData = new ImageData(new Uint8ClampedArray(new ArrayBuffer(4 * sq)), w, h); //, {height: h, width: w, data: new Uint8Array(new ArrayBuffer(4 * sq))});
			var pixels = new Array(sq);
			this.pixels = pixels;
			for (i = 0; i < sq; i++) pixels[i] = new this.constructor.Color(this._iData.data, i * 4);
			//alert(pixels[0].srcs);

		}, {
			WebGL: withProto(lib, {
				graphics: null,
				canv: null,
				gl: null,
				program: null,
				bindTarget: function(t) {
					if (!t) return;
					if (t.constructor == Graphics) {
						this.graphics = t;
						return this.bindTarget(t.canv);
					}
					if (isInstanceOf(t, View)) {
						this.canv = t;
					}
					if (t.constructor == HTMLCanvasElement) {
						return this.bindTarget(getView(t));
					}
				},
				initGl: function() {
					if (!this.gl) {
						var gl, i, n = this.constructor.contextNames;
						for (i = 0; i < n.length; i++) {
							gl = this.canv.element.getContext(n[i]);
							if (gl) break;
						}
						this.gl = gl;
					}
					this.Shader.gl = this.gl;
				},
				initBlend: function() {
					this.gl.enable(this.gl.BLEND);
					this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
				},
				calcTexSlots: function() {
					var i;
					for (i = 0;; i++) {
						if (!(('TEXTURE' + i) in this.gl)) return i;
					}
				},
				Shader: withProto(lib, {
					_shdObj: null,
					setSrc: function(s) {
						var gl = this.constructor.gl;
						gl.shaderSource(this._shdObj, s);
						gl.compileShader(this._shdObj);
					},
					getCompileStatus: function() {
						var gl = this.constructor.gl;
						return gl.getShaderParameter(this._shdObj, gl.COMPILE_STATUS);
					},
					getInfoLog: function() {
						return this.constructor.gl.getShaderInfoLog(this._shdObj);
					}
				}, function(shdType, src) {
					var gl = this.constructor.gl;
					if (typeof shdType == 'string') {
						shdType = shdType.match(/[a-z]+/i)[0].toLowerCase();
						if (shdType == 'vertex') shdType = this.constructor.VERTEX();
						if (shdType == 'fragment') shdType = this.constructor.FRAGMENT();
					}
					var so = gl.createShader(shdType);
					this._shdObj = so;
					if (src) this.setSrc(src);
				}, {
					gl: null,
					VERTEX: function() {
						return gl.VERTEX_SHADER
					},
					FRAGMENT: function() {
						return gl.FRAGMENT_SHADER
					}
				}),
				genProgram: function(opts) {
					var gl = this.gl;
					var p = gl.createProgram(),
						S = this.Shader;
					var sv = opts.vertex,
						sf = opts.fragment;
					if (typeof sv == 'string') sv = new S(S.VERTEX(), sv);
					if (typeof sf == 'string') sf = new S(S.FRAGMENT(), sf);
					gl.attachShader(p, sv._shdObj || sv);
					gl.attachShader(p, sf._shdObj || sf);
					gl.linkProgram(p);
					return p;
				},
				setProgram: function(p) {
					if (!this.gl.isProgram(p)) p = this.genProgram(p);
					this.gl.useProgram(p);
					this.program = p;
				},
				getCtx2d: function() {
					var ctx = {},
						gl = this.gl;
					ctx.getImageData = function(x, y, w, h) {
						var a = new UInt8ClampedArray(4 * w * h);
						gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, a);
						return new ImageData(a, w, h);
					};
					return ctx;
				}

			}, function() {

			}, {
				contextNames: ['webgl', 'experimental-webgl']
			}),
			Color: withProto(lib, {
					getValues: function() {
						var S = this.srcs;
						return [].slice.apply(S[0], [S[1], S[1] + 4 - this.noAlpha])
					},
					setValues: function(v) {
						this.srcs[0].set([].slice.apply(v, [0, 4 - this.noAlpha]), this.srcs[1])
					},
					setInt24: function(n) {
						this.setValues([(n >> 16) & 255, (n >> 8) & 255, n & 255, 255])
					},
					getInt24: function() {
						var v = this.getValues();
						return (v[0] << 16) | (v[1] << 8) | v[2]
					},
					unbind: function() {
						this.srcs = [this.getValues(), 0]
					},
					copy: function() {
						with(this) {
							return new constructor(getValues(), 0, noAlpha, isHex)
						}
					},
					toString: function() {
						if (!this.isHex) {
							var v = this.getValues();
							if (v[3]) v[3] /= 255;
							return "rgb" + (this.noAlpha ? '' : 'a') + '(' + v.join(", ") + ')'
						} else {
							var v = this.getValues();
							var n = 1;
							for (i = 0; i < v.length; i++) n = n << 8 | v[i];
							return n.toString(16).replace(/^1/, '#')
						}
					},
					getRed: function(floatVal) {
						return this.srcs[0][this.srcs[1]] / (floatVal ? 255 : 1)
					},
					getGreen: function(floatVal) {
						return this.srcs[0][this.srcs[1] + 1] / (floatVal ? 255 : 1)
					},
					getBlue: function(floatVal) {
						return this.srcs[0][this.srcs[1] + 2] / (floatVal ? 255 : 1)
					},
					getAlpha: function(floatVal) {
						return (this.noAlpha * 255 || this.srcs[0][this.srcs[1] + 3]) / (floatVal ? 255 : 1)
					},
					paintSelf: function(c) {
						var ch, aa = (1 - c.getAlpha(1)) * this.getAlpha(1),
							S1 = this.srcs,
							S2 = c.srcs;
						for (ch = 0; ch < 3; ch++) {
							S1[0][S1[1] + ch] = S2[0][S2[1] + ch] + aa * (S1[0][S1[1] + ch] - S2[0][S2[1] + ch])
						};
						if (!this.noAlpha) S1[0][S1[1] + 3] = (aa + c.getAlpha(1)) * 255
					},
					paintSelfBack(c) {
						var ch, aa = (1 - this.getAlpha(1)) * c.getAlpha(1),
							S1 = c.srcs,
							S2 = this.srcs;
						for (ch = 0; ch < 3; ch++) {
							S2[0][S2[1] + ch] = S2[0][S2[1] + ch] + aa * (S1[0][S1[1] + ch] - S2[0][S2[1] + ch])
						};
						if (!c.noAlpha) S2[0][S2[1] + 3] = (aa + this.getAlpha(1)) * 255
					},
					painted: function(c) {
						var r = this.copy();
						r.paintSelf(c);
						return r
					},
					setColor: function(c) {
						if (c == this) return;
						var ch;
						for (ch = 0; ch < 4; ch++) {
							this.srcs[0][this.srcs[1] + ch] = c.srcs[0][c.srcs[1] + ch];
						}
					}
				},
				function(arr, off, noAlpha, isHex) {
					off = off || 0;
					this.noAlpha = !!noAlpha;
					this.isHex = !!isHex;
					this.srcs = [arr, off]
				}, {
					rgba: function(r, g, b, a) {
						r = Calc.clamp(r, 0, 255);
						g = Calc.clamp(g, 0, 255);
						b = Calc.clamp(b, 0, 255);
						a = Calc.clamp(a, 0, 255);
						return new this([r, g, b, a]);
					},
					rgb: function(r, g, b) {
						r = Calc.clamp(r, 0, 255);
						g = Calc.clamp(g, 0, 255);
						b = Calc.clamp(b, 0, 255);
						return new this([r, g, b], 0, 1);
					},
					hex: function(s, hasAlpha) {
						if (typeof s == 'string') {
							s = s.replace(/^#/, '').replace(/[^0-9a-f]/ig, '0');
							if (s.length == 3) s = s.replace(/(.)/g, '$1$1');
							s = parseInt(s, 16);
						}
						s = +s || 0;
						var r, g, b, a;
						if (hasAlpha) {
							a = s & 255;
							b = s >>> 8 & 255;
							g = s >>> 16 & 255;
							r = s >>> 24 & 255;
							return new this([r, g, b, a], 0, 0, 1)
						} else {
							b = s & 255;
							g = s >>> 8 & 255;
							r = s >>> 16 & 255;
							return new this([r, g, b], 0, 1, 1)
						}
					},
					dist: function(c1, c2) {
						return Calc.pythag([c1.getRed() - c2.getRed(), c1.getGreen() - c2.getGreen(), c1.getBlue() - c2.getBlue(), c1.getAlpha() - c2.getAlpha()], 255);
					},
					smartDist: function(c1, c2) {
						return (c1.getAlpha() && c2.getAlpha() ? this.dist(c1, c2) : 510) * Math.max(c1.getAlpha(1), c2.getAlpha(1));
					},
					nearest: function(c, a) {
						var i, m = 511,
							mi = -1,
							d;
						for (i = 0; i < a.length; i++) {
							d = this.smartDist(c, a[i]);
							if (d < m) {
								mi = i;
								m = d;
							}
							if (d == 0) break;
						}
						return {
							index: mi,
							result: a[mi],
							dist: m
						};
					}
				}),
			ColorEffect: withProto(lib, {

			}, function() {

			}, {
				band: function(maxCount, pixels, height) {
					with(Graphics.Color) {
						//color, nearest_index, distance
						maxCount = maxCount >= 1 ? maxCount | 0 : 1;
						var clist = [pixels[0], -1, 511];
					}
				}
			}),
			ColorTransformator: withProto(lib, {
				hasAlpha: true,
				xch: true,
				proceedTo(src, trg) {
					var srgba = src.getValues();
					if (srgba.length < 4) srgba.push(255);
					var mx = this.mx;
					var trgba = [mx.rr * srgba[0] + mx.or, mx.gg * srgba[1] + mx.og, mx.bb * srgba[2] + mx.ob, this.hasAlpha ? mx.rr * srgba[3] + mx.oa : 255];
					if (this.xch) {
						trgba[0] += gr * srgba[1] + br * srgba[2];
						trgba[1] += rg * srgba[0] + bg * srgba[2];
						trgba[2] += rb * srgba[0] + gb * srgba[1];
					};
				}
			}, function(ha, xch, r, g, b, a) {
				var mx;
				if (xch) {
					mx = {
						rr: r[0] || 0,
						gr: r[1] || 0,
						br: r[2] || 0,
						ar: ha ? r[3] || 0 : 0,
						or: ha ? r[4] || 0 : (r[3] || 0),
						rg: g[0] || 0,
						gg: g[1] || 0,
						bg: g[2] || 0,
						ag: ha ? g[3] || 0 : 0,
						og: ha ? g[4] || 0 : (g[3] || 0),
						rb: b[0] || 0,
						gb: b[1] || 0,
						bb: b[2] || 0,
						ab: ha ? b[3] || 0 : 0,
						ob: ha ? b[4] || 0 : (b[3] || 0),
						ra: ha ? a[0] || 0 : 0,
						ga: ha ? a[1] || 0 : 0,
						ba: ha ? a[2] || 0 : 0,
						aa: ha ? a[3] || 0 : 1,
						oa: ha ? a[4] || 0 : 0
					}
				} else {
					mx = {
						rr: r[0] || 0,
						gg: g[0] || 0,
						bb: b[0] || 0,
						aa: ha ? a[0] || 0 : 0,
						or: r[1] || 0,
						og: g[1] || 0,
						ob: b[1] || 0,
						oa: a[1] || 0,
						gr: 0,
						br: 0,
						ar: 0,
						rg: 0,
						bg: 0,
						ag: 0,
						rb: 0,
						gb: 0,
						ab: 0,
						ra: 0,
						ga: 0,
						ba: 0
					}
				};
				this.mx = mx;
				this.hasAlpha = !!(mx.ar || mx.ag || mx.ab || (mx.aa - 1) || mx.ra || mx.ga || mx.ba);
				this.xch = !!(mx.gr || mx.br || mx.ar || mx.rg || mx.bg || mx.ag || mx.rb || mx.gb || mx.ab || mx.ra || mx.ga || mx.ba);
			}, {}),
			canvView: subClass(View, {}, function(opts) {
				opts = opts || {};
				var C = document.createElement("canvas");
				this.Super(C);
				if (!opts.noCtx) this.CTX = C.getContext("2d")
			}, {}),
			TileAtlas: withProto(lib, {
					getTilePos: function(i) {
						var v = this.scaledTileSize.copy();
						v.dims[0] *= i % this.hcount;
						v.dims[1] *= Math.floor(i / this.hcount); /*v.dims[0] -=1; v.dims[1] -=1;*/
						return v
					},
					drawTo: function(G, I, pos, hcount, vcount, scale) {
						if (!pos) {
							pos = new Vectors.Vec([0, 0])
						};
						pos.resize(2); /*document.write(pos);*/
						var cropPos = this.getTilePos(I),
							cropSize = this.scaledTileSize; /*console.log(cropPos + '');*/
						if (scale == 1) scale = 0;
						var size = scale ? Vectors.Vec.mul(cropSize, scale) : cropSize;
						var i, j;
						var curPos = pos.copy();
						for (i = 0; i < vcount; i++) {
							curPos.dims[0] = pos.dims[0]
							for (j = 0; j < hcount; j++) {
								/*console.log(cropPos + '', cropSize + '', curPos + '', size + '');*/
								G.drawImg(this.canv.element, curPos, size, cropPos, cropSize);
								curPos.dims[0] += size.dims[0];
							}
							curPos.dims[1] += size.dims[1];
						}
						/*return([cropSize, cropPos, pos, size]);*/
					},
					drawToMany: function(G, m, pos, hcount, scale) {
						if (!pos) {
							pos = new Vectors.Vec([0, 0])
						};
						pos.resize(2);
						var cropPoss = {};
						var i;
						for (i = 0; i < m.length; i++) cropPoss[m[i]] = cropPoss[m[i]] || this.getTilePos(m[i]);
						var cropSize = this.scaledTileSize;
						if (scale == 1) scale = 0;
						var size = scale ? Vectors.Vec.mul(cropSize, scale) : cropSize;
						var j;
						var curPos = pos.copy();
						var vcount = m.length / hcount;
						var _rest = m.length % hcount;
						if (_rest) {
							for (i = hcount; i >= _rest; i--) {
								m.push(-1)
							};
							vcount = Math.ceil(vcount)
						};
						var ij = 0;
						for (i = 0; i < vcount; i++) {
							curPos.dims[0] = pos.dims[0]
							for (j = 0; j < hcount; j++, ij++) {
								if (m[ij] != -1) G.drawImg(this.canv.element, curPos, size, cropPoss[m[ij]], cropSize);
								curPos.dims[0] += size.dims[0];
							}
							curPos.dims[1] += size.dims[1];
						}
					},
					height: 0,
					width: 0
				},
				function(src, size, hcount, vcount, scale, onload) {
					size.resize(2);
					if (!(src instanceof LinkURL)) src = new LinkURL(src.toString());
					var that = this;
					this.onload = onload;
					var c = new Graphics.canvView(),
						w = size.dims[0] * (scale || 1),
						h = size.dims[1] * (scale || 1);
					this.canv = c;
					c.width = w;
					c.height = h;
					var img = document.createElement('img');
					this.hcount = hcount;
					this.vcount = vcount;
					src.setTo(img); /*document.write(img.src);*/
					this.scaledTileSize = new Vectors.Vec(w / hcount, h / vcount);
					img.onload = function() {
						try {
							//c.CTX.drawImage(img, 0, 0, w, h);
							c.CTX.drawImage(img, 0, 0, size.dims[0], size.dims[1]);
							if (scale > 1) {
								var i, j;
								var idat = c.CTX.getImageData(0, 0, w, h) /*, s2 = -1 + scale >> 1*/ ;
								for (i = w - 1; i >= 0; i--) {
									for (j = h - 1; j >= 0; j--) {
										for (k = 0; k < 4; k++) {
											//idat.data[(j * w + i) * 4 + k] = idat.data[((j - j % scale + s2) * w + (i - i % scale + s2)) * 4 + k];
											idat.data[(j * w + i) * 4 + k] = idat.data[(((j - j % scale) / scale) * w + ((i - i % scale) / scale)) * 4 + k];
										}
									}
								}

								//document.write(1);
								c.CTX.putImageData(idat, 0, 0);
								//document.write(2);
							}
							that.onload();
							//document.write(3);
						} catch (e) {
							document.write(e)
						}
					}
				}, {})
			/*, Shader: withProto(lib, {
			 
			 }, 
			 function(){}, {
			     Ray: bufferStruct(function(orig, dir, dimcount){dimcount = dimcount || 3; if(dimcount != 3) this._setBufferSize(dimcount << 3); this.origin = this._appendToBuffer(orig, dimcount); this.direction = this._appendToBuffer(dir, dimcount)},
			                         {}, 24)
			 })*/
		});
		Timer = withProto(lib, {
				play: function() {
					with(this) {
						if (!isPaused) return;
						_TO = setTimeout(copyFunc(this, tick), T + _TS - _PTS);
						isPaused = false;
						for (var i in _events.play) {
							try {
								_events.play[i] && _events.play[i]({
									timer: this,
									ts: constructor.getTS()
								})
							} catch (e) {}
						};
					}
				},
				pause: function() {
					with(this) {
						if (isPaused) return;
						clearTimeout(_TO);
						_PTS = constructor.getTS();
						isPaused = true;
						for (var i in _events.pause) {
							try {
								_events.pause[i] && _events.pause[i]({
									timer: this,
									ts: _PTS
								})
							} catch (e) {}
						};
					}
				},
				upd: function() {
					with(this) {
						var i;
						for (i in reqTimers) {
							if (reqTimers[i].isPaused) {
								pause()
							}
						}
					}
				},
				tick: function() {
					with(this) {
						var ots = _TS,
							i;
						_TS = constructor.getTS();
						for (var i in _events.tick) {
							try {
								_events.tick[i] && _events.tick[i]({
									timer: this,
									ts: _TS,
									frame: frameNum
								})
							} catch (e) {}
						};
						_TO = setTimeout(copyFunc(this, tick), T);
						frameNum++
					}
				},
				addEventListener: function(s, h) {
					with(this) {
						_events[s].push(h);
						return _events[s].length - 1;
					}
				},
				removeEventListener: function(n, ev) {
					with(this) {
						var l = _events[n];
						if (!l) return -1;
						for (var i in l) {
							if (i == ev || l[i] == ev) {
								l[i] = null;
								return i;
							}
						};
						return -1;
					}
				}
			},
			function(T) {
				this.reqTimers = [];
				this.isPaused = true;
				this._TO = 0;
				this._TS = 0;
				this._PTS = 0;
				this.T = T;
				this._events = {
					pause: [],
					play: [],
					tick: []
				};
				this.frameNum = 0;
			}, {
				getTS: function() {
					return +(new Date())
				}
			});
		LinkURL = withProto(lib, {
				isCrossOrigin: false,
				setCrossOrigin: function(elem) {
					if (elem instanceof View) elem = elem.element;
					if (this.isCrossOrigin) elem.crossOrigin = this.constructor.crossOrigin;
					return elem
				},
				src: '#',
				setTo: function(e) {
					this.setCrossOrigin(e).src = this.src
				}
			},
			function(src, co) {
				var b = !!co;
				b |= src.match(/^http:\/\/|^https:\/\/|^\/\//i) != '';
				b |= document.location.toString().match(/file:/ig) != '';
				this.isCrossOrigin = b;
				this.src = src;
			}, {
				crossOrigin: 'Anonymous'
			});

		Network = {
			Request: withProto(lib, {
				lock: function() {
					this.__locked = true;
				},
				unlock: function() {
					this.__locked = false;
				},
				getUnlocked: function() {
					if (this.__locked) return this.copy();
					return this;
				},
				recreate: function() {
					return new this.constructor(this.__opts);
				},
				copy: function() {
					var r = this.recreate();
					r.handlers = this.handlers;
					return r;
				},
				addHeader: function(k, v) {
					if (!this.headers[k]) this.headers[k] = [];
					this.headers[k].push(v);
				},
				remHeader: function(k, v) {
					if (!v) {
						this.headers[k] = [];
						return;
					}
					if (!this.headers[k]) return;
					var i = this.headers[k].indexOf(v);
					if (i == -1) return;
					this.headers[k].splice(i, 1);
				},
				clearHandlers: function() {
					var i;
					this.stateHandlers = this.stateHandlers || [];
					for (i = 0; i < 5; i++) {
						this.stateHandlers[i] = [];
					}
				},
				addStateHandler: function(f, s) {
					var i;
					s = s || [4];
					for (i = 0; i < 5; i++) {
						if (s.indexOf(i) != -1) {
							this.stateHandlers.push(f);
						}
					}
				},
				remStateHandler: function(f, s) {
					var i, j;
					var sh = this.stateHandlers;
					s = s || [0, 1, 2, 3, 4];
					for (i = 0; i < 5; i++) {
						if (s.indexOf(i) != -1) {
							j = sh[i].indexOf(f);
							if (j != -1) sh.splice(j, 1);
						}
					}
				}
			}, function(opts) {
				var i, sh;
				var url = opts.url || '#';
				if (!url || !isInstanceOf(url, LinkURL)) url = new LinkURL(url);
				this.url = url;
				this.data = opts.data;
				this.method = opts.method || opts.data && 'POST' || 'GET';
				this.async = opts.noAsync ? this.constructor.defaultAsync : false;
				this.__locked = false;
				this.__opts = descendObj(opts, {
					copyDepth: (opts.copyDepth || 0) + 1
				});
				this.headers = opts.headers || {};
				this.clearHandlers();
				sh = opts.stateHandlers;
				if (sh) {
					for (i = 0; i < sh.length; i++) {
						this.addStateHandler(sh[0], sh[1]);
					}
				}
			}, {
				defaultAsync: true
			}),
			sendRequest: function(r, f) {
				r = r.getUnlocked();
				var xhr = new XMLHttpRequest();
				r.xhr = xhr;
				r.addStateHandler(f);
			}
		};

		this.R = R;
		this.View = View;
		this.GE = GE;
		this.getView = getView;
		this.Vectors = Vectors;
		this.Graphics = Graphics;
		this.Timer = Timer;
		this.LinkURL = LinkURL;
		this.compFloat = compFloat;
		this.copyFunc = copyFunc;
		this.Network = Network;
		this.Calc = Calc;
		this.swapArrs = swapArrs;

		window[libName] = this;
	})("lib");
} catch (e) {
	alert('init:' + e)
}
