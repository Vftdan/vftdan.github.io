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
		var withProto, subClass, bufferStruct;
		var View;
		this.compFloatBits = 16;
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
						k = s.join('');
						this.element.style[k] = v.toString();
					}
				}
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
			return e ? ((e.constructor == View || e.constructor.__supers && e.constructor.__supers.indexOf(View) != 0) && e || e.VIEW || View(e)) : "[NONE]";
		}
		this.defaultViewToStringDepth = 0;
		baseView = new View(document);
		baseView.toString = function() {
			return "[VIEW baseView]"
		};
		var GE = function(t, s) {
			var e = GE[t](s);
			return getView(e);
		}
		GE.id = copyFunc(document, document.getElementById);
		GE.tagName = copyFunc(document, document.getElementsByTagName);
		GE.name = copyFunc(document, document.getElementsByName);
		GE.q = copyFunc(document, document.querySelector);

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
					_setBufferSize: C.setBufferSize,
					_appendToBuffer: C._appendToBuffer
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
						var A = new Float32Array(this.buffer, this.__boff, 1);
						A[0] = a
					} else if (a.constructor == Array || a.constructor == Float32Array) {
						var i;
						l = l || a.length;
						var A = new Float32Array(this.buffer, this.__boff, l);
						for (i = 0; i < l; i++) {
							A[i] = a[i] || 0.0
						}
					} else if (a.buffer) {
						a = new Float32Array(a.buffer);
						var i;
						l = l || a.length;
						var A = new Float32Array(this.buffer, this.__boff, l);
						for (i = 0; i < l; i++) {
							A[i] = a[i] || 0.0
						}
					} else {
						l = a.writeToF32Buffer(this.buffer, +this.__boff, l) || l;
						A = new Float32Array(this.buffer, this.__boff, l)
					};
					this.__boff += l << 2;
					return A
				},
				__boff: 0
			};
			var i;
			for (i in _static) C[i] = _static[i];
			return C;
		}

		Vectors = {
			Vec: withProto(lib, {
				writeToF32Buffer: function(b, o, l) {
					var a = new Float32Array(b, o, l),
						i;
					for (i = 0; i < l; i++) {
						a[i] = this.dims[i] || 0.0;
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
					switch (m.constructor) {
						case Number:
							var i;
							for (i = 0; i < this.d; i++) this.dims[i] *= m;
							break;
						case Vectors.SqMatrix:
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
						m[i] = this.m[i].slice(0)
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
					return 'Transformator:{\n' + this.m + '\n' + this.v + '\n}'
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
				proceedSelf: function(a) {
					var i;
					for (i = 0; i < a.length; i++) {
						if (a[i].mulSelf) a[i].mulSelf(this.m);
						if (a[i].addSelf) a[i].addSelf(this.v)
					};
					return a
				},
				proceed: function(a) {
					var i, b = [],
						c;
					for (i = 0; i < a.length; i++) {
						if (!a[i]) continue;
						c = a[i].constructor;
						if (c.mul) {
							b[i] = c.mul(a[i], this.m);
							if (b[i].addSelf) b[i].addSelf(this.v)
						}
					}
				}
			}, function() {
				var m = new Vectors.SqMatrix();
				this.m = m;
				var v = new Vectors.Vec();
				this.v = v
			}),
			Perspective: withProto(lib, {
				proceed: function(a) {
					var i, j, b = [];
					for (i = 0; i < a.length; i++) {
						if (!a[i].dims) {
							b[i] = a[i].copy && a[i].copy() || a[i]
						} else {
							b[i] = a[i].copy();
							for (j in b[i].dims) {
								if (j != this.di) b[i].dims[j] /= b[i].dims[this.di] / this.dist;
							}
						}
					};
					return b
				}
			}, function(di, dist) {
				this.di = di;
				this.dist = dist
			}, {})
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
			wrapX: false,
			wrapY: false,
			drawImg: function(img, pos, size, cropStart, cropSize, rot, rcenter) {
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
			Color: withProto(lib, {
					getValues: function() {
						var S = this.srcs;
						return [].slice.apply(S[0], [S[1], S[1] + 4 - this.noAlpha])
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
						}
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
				}, {}),
			canvView: subClass(View, {}, function() {
				var C = document.createElement("canvas");
				this.Super(C);
				this.CTX = C.getContext("2d");
				this.CTX.imageSmoothingEnabled = false;
			}, {}),
			TileAtlas: withProto(lib, {
					getTilePos: function(i) {
						var v = this.scaledTileSize.copy();
						v.dims[0] *= i % this.hcount;
						v.dims[1] *= Math.floor(i / this.hcount);
						v.dims[0] -= 1;
						v.dims[1] -= 1;
						return v
					},
					drawTo: function(G, I, pos, hcount, vcount, scale) {
						if (!pos) {
							pos = new Vectors.Vec([0, 0])
						};
						pos.resize(2); /*document.write(pos);*/
						var cropPos = this.getTilePos(I),
							cropSize = this.scaledTileSize;
						if (scale == 1) scale = 0;
						var size = scale ? Vectors.Vec.mul(cropSize, scale) : cropSize;
						var i, j;
						var curPos = pos.copy();
						for (i = 0; i < vcount; i++) {
							curPos.dims[0] = pos.dims[0]
							for (j = 0; j < hcount; j++) {
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
				}, {}),
			Shader: withProto(lib, {

				},
				function() {}, {
					Ray: bufferStruct(function(orig, dir, dimcount) {
						dimcount = dimcount || 3;
						if (dimcount != 3) this._setBufferSize(dimcount << 3);
						this.origin = this._appendToBuffer(orig, dimcount);
						this.direction = this._appendToBuffer(dir, dimcount)
					}, {}, 24)
				})
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
				b |= src.match(/^http:\/\/|^https:\/\/|^\/\//ig) != '';
				b |= document.location.toString().match(/file:/ig) != '';
				this.isCrossOrigin = b;
				this.src = src;
			}, {
				crossOrigin: 'Anonymous'
			});

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

		window[libName] = this;
	})("lib");
} catch (e) {
	alert('init:' + e)
}
