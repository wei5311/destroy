// 设置视口
var deviceWidth = $(window).width();
var deviceHeight = $(window).height();
var viewportHeight = 680;
var viewportWidth = Math.floor(deviceWidth / deviceHeight * viewportHeight);
var nowPlay = null;
var peoNum;
var edition = null;
var ordinary = null;
// 预加载
var loadImg = [];
loadImg.push("images/again.png");
loadImg.push("images/bg-1.png");
loadImg.push("images/down.png");
loadImg.push("images/floor.png");
loadImg.push("images/game-help.png");
loadImg.push("images/gamend.png");
loadImg.push("images/gameover.png");
loadImg.push("images/game-start.png");
loadImg.push("images/go-left.png");
loadImg.push("images/go-right.png");
loadImg.push("images/green-mg.png");
loadImg.push("images/jin.png");
loadImg.push("images/jixu.png");
loadImg.push("images/monsters-1.png");
loadImg.push("images/peo-1.png");
loadImg.push("images/peo-2.png");
loadImg.push("images/peo-btn.png");
loadImg.push("images/playgame.png");
loadImg.push("images/pu.png");
loadImg.push("images/red-mg.png");
loadImg.push("images/role_1.png");
loadImg.push("images/role_1_0.png");
loadImg.push("images/role1_1.png");
loadImg.push("images/role1_2.png");
loadImg.push("images/role_b1.png");
loadImg.push("images/role_2.png");
loadImg.push("images/role_2_0.png");
loadImg.push("images/role_b2.png");
loadImg.push("images/role_3.png");
loadImg.push("images/role_4.png");
loadImg.push("images/sky.jpg");
loadImg.push("images/sm-1.png");
loadImg.push("images/sm-2.png");
loadImg.push("images/sm-3.png");
loadImg.push("images/start.png");
loadImg.push("images/suspend.png");
loadImg.push("images/time.png");
loadImg.push("images/t-left.png");
loadImg.push("images/t-right.png");
loadImg.push("images/un-tree.png");
loadImg.push("images/tree_01.png");
loadImg.push("images/up.png");
loadImg.push("images/yel-mg.png");
loadImg.push("images/zt.png");
loadImg.push("images/suspend.png");
var all = loadImg.length;
var imgNum = 0;
var percent = 0;
imgPreLoad(loadImg, showProgress);

// 预加载下载图片
function imgPreLoad(listArr, callback, error) {
	for(var i = 0; i < listArr.length; i++) {
		var img = new Image();
		img.src = listArr[i];
		if(img.complete) {
			callback.call(img);
		} else {
			if(callback) {
				img.onload = function() {
					callback.call(img);
				}
			}
			if(error) {
				img.onerror = function() {
					error.call(img);
					$(".progress").html("加载失败");
				}
			}
		}
	}
}

function showProgress() {
	imgNum++;
	percent = Math.floor(imgNum * 100 / all);
	$(".progress strong").html(percent);
	if (percent == 100) {
		$(".loading").css({
			"display" : "none"
		})
	};
}


var infi = null;
$("meta").after('<meta name="viewport" content="width=' + viewportWidth + ',height='+ viewportHeight + ', user-scalable=no">');
function Infi(dom){
	var place = null;
	var _this = this;
	this.dom = dom;
	this.peo = document.getElementById("peo");
	this.peo.posi = 1;
	this.topPos = 0;
	this.step = 1.5;
	this.clock = null;
	this.state = true;
	this.check = 1;
	this.sum = 0;
	this.sco = 0;
	this.addSco = 0;
	this.tree = 5;
	this.imgX = 0;
	this.isImg = false;
	this.blackImg = false;
	this.timer = null;
	this.num = null;
	this.bgNum = -820;
	this.bgTrans = 0;
	this.begin = true;
	this.suspend = false;
	this.suspendNum = 3;
	this.invincible = false;
	this.sub = false;
	this.peoNum = peoNum;
	// 暂停
	$(".suspend").on("touchstart", function() {
		_this.suspend = true;
		_this.sub = true;
		$(".continue").css({
			"display" : "block"
		});
		clearInterval(_this.clock);
		$(".suspend-box").css({
			"display" : "block"
		});
	})
	// 开始
	$(".continue").on("touchstart", function() {
		$(".continue").css({
			"display" : "none"
		});
		$(".con-num").css({
			"display" : "block"
		});
		var conTimer = setInterval(function() {
			_this.suspendNum--;
			$(".con-num").html(_this.suspendNum);
			if (_this.suspendNum <= 0) {
				clearInterval(conTimer);
				conTimer = null;
				_this.suspendNum = 3;
				$(".con-num").html("3");
				$(".con-num").css({
					"display" : "none"
				});
			};
		}, 1000);
		setTimeout(function(){
			_this.suspend = false;
			$(".suspend-box").css({
				"display" : "none"
			})
			if (_this.clock) {
				clearInterval(_this.clock);
			};
			_this.clock = null;
			_this.sub = false;
			_this.clock = setInterval(function(){
				_this.move();
				_this.judge();
			}, 3);
		}, 3000)
	})
	
	// 黄色减速）
	$(".yellow-box").on("touchstart", function() {
		$(".yellow-box").css({
			"display" : "none"
		});
		$(".prompt").html("恭喜你获得减速~~");
		$(".prompt").css({
			"display" : "block"
		});
		setTimeout(function() {
			$(".prompt").css({
				"display" : "none"
			});
		}, 2000);
		_this.suspend = true;
		_this.step -= 0.3;
		if (_this.step <= 1) {
			_this.step = 1;
		};
	})
	// 绿色 (加分)
	$(".green-box").on("touchstart", function() {
		$(".green-box").css({
			"display" : "none"
		});
		$(".prompt").html("恭喜你获得15分~~");
		$(".prompt").css({
			"display" : "block"
		});
		setTimeout(function() {
			$(".prompt").css({
				"display" : "none"
			});
		}, 2000);
		_this.suspend = true;
		_this.addSco += 15;
	})
	// 红色（无敌）
	$(".red-box").on("touchstart", function() {
		$(".red-box").css({
			"display" : "none"
		});
		var yeT = 3;
		_this.oldStep = _this.step;
		_this.step = 5;
		var miSpeed = (5 - _this.oldStep) / 4;
		_this.suspend = true;
		_this.invincible = true;
		$(".prompt").html("恭喜你获得无敌状态！");
		$(".prompt").css({
			"display" : "block"
		});
		var yelTimer = setInterval(function() {
			_this.step -= miSpeed;
			var yeText = "剩余" + yeT + "秒";
			$(".prompt").html(yeText);
			yeT--;
			if(yeT <= -2) {
				clearInterval(yelTimer);
				_this.step =_this.oldStep;
				_this.invincible = false;
				$(".prompt").css({
					"display" : "none"
				});
			}
		}, 1000);
	})

	// 左右点击事件
	$(".game-box").on('touchstart', function(e) {
		if (_this.suspend) {
			_this.suspend = false;
			return;
		};
		if (_this.sub) {
			return;
		};
		if (e.touches[0].clientX >= viewportWidth/2) {
			// 点击右边时
			$(".peo").css({
				"float" : "right"
			})
			_this.num = 2;
			_this.peo.posi = 2;
			if (_this.peoNum == 0) {
				$(_this.peo).css({
					"background": "url('images/role_2.png') center 0px no-repeat"	
				})
			} else {
				$(_this.peo).css({
					"background": "url('images/role1_2.png') center 0px no-repeat"	
				})
			}
		}
		if (e.touches[0].clientX < viewportWidth/2) {
			// 点击左边时
			$(_this.peo).css({
				"float" : "left"
			})
			_this.peo.posi = 1;
			_this.num = 1;
			if (_this.peoNum == 0) {
				$(_this.peo).css({
					"background": "url('images/role_1.png') center 0px no-repeat"	
				})
			} else {
				$(_this.peo).css({
					"background": "url('images/role1_1.png') center 0px no-repeat"	
				})
			}
		}
	});

}
// 游戏初始化
Infi.prototype.init = function(){
	var _t = this;
	$(".peo").css({
		"float" : "left"
	})
	$(".sco").html(0);
	for(var i = 0;i < 5;i++){
		_t.insertRow();
	}
	_t.start();
	_t.begin = false;
	_t.destroyBox("not-l");
	_t.num = 1;
	$("#container").children().eq(4).children().remove();
	_t.timer = setInterval(function() {
		if (_t.peo.check == 1) {
			_t.num = 1;
		};
		_t.peoG();
	}, 60);
};
// 添加节点
Infi.prototype.insertRow = function(){
	var oRow = this.createCell('row');
	var classArr = this.classArr();
	oRow.place = place;
	var oCell = null;
	for(var i = 0; i < 3; i++){
		oCell = this.createCell(classArr[i]);
		oRow.appendChild(oCell);
	}
	var firChild = this.dom.firstChild;
	this.dom.insertBefore(oRow , firChild);
};

Infi.prototype.showApl = function(){
	var randomNum = Math.floor(Math.random() * 5000 + 1000);
	var aplNuml = Math.floor(Math.random() * 3 + 1);
	var randomTop = Math.floor(Math.random() * 340 + 50);
	var randomLeft = Math.floor(Math.random() * 85 + 6);
	
	setTimeout(function() {
		switch(true) {
			case aplNuml == 1: $(".red-box").css({
									"top" : randomTop + "px",
									"left" : randomLeft + "%",
									"display" : "block"
								});break;
			case aplNuml == 2: $(".green-box").css({
									"top" : randomTop + "px",
									"left" : randomLeft + "%",
									"display" : "block"
								});break;
			case aplNuml == 3: $(".yellow-box").css({
									"top" : randomTop + "px",
									"left" : randomLeft + "%",
									"display" : "block"
								});break;
		}
	}, randomNum);
	setTimeout(function() {
		switch(true) {
			case aplNuml == 1: $(".red-box").css({
									"display" : "none"
								});break;
			case aplNuml == 2: $(".green-box").css({
									"display" : "none"
								});break;
			case aplNuml == 3: $(".yellow-box").css({
									"display" : "none"
								});break;
		}
	}, randomNum + 2000);
}

Infi.prototype.delRow = function(){
	this.dom.removeChild(this.dom.childNodes[this.dom.childNodes.length - 1]);
};
Infi.prototype.classArr = function(){
	if (this.begin) {
		this.check = 2;
	};
	if (this.check == 1) {
		var arr = ['left', 'tree', 'right'];
		var i = Math.floor(Math.random() * 2);
		if (i == 1) {
			arr[i + 1] += ' r';
			place = 2;
		} else {
			arr[i] += ' l';
			place = 1;
		}
		this.check = 2;
		return arr;
	} else {
		var arr = ['atmosphere', 'tree', 'atmosphere'];
		this.check = 1;
		place = null;
		return arr;
	}
};

Infi.prototype.createCell = function(className){
	var oDiv = document.createElement('div');
	if (className == "tree") {
		if (this.tree == 1) {
			this.tree = 5;
		};
		oDiv.style.background = "url('images/tree_01.png')";
		oDiv.style.backgroundSize = "100% 100%"  
	};
	oDiv.className = className;
	return oDiv;
};
// 人物动画
Infi.prototype.peoG = function(num) {
	if (!this.isImg) {
		this.imgX -= 150;
	}
	if (this.isImg) {
		this.imgX += 150;
	}
	if (this.imgX >= 0) {
		this.isImg = false;
		if (this.blackImg) {
			clearInterval(this.timer);
		}
	}
	if (this.imgX <= -300) {
		this.isImg = true;
		this.blackImg = true;
	}
	if (this.invincible) {
		$(".peo").css({
			background: "url('images/role_" + this.num +"_0.png') center " + this.imgX + "px no-repeat",	
		});
	} else {
		if (this.peoNum == 0) {
			$(this.peo).css({
				background: "url('images/role_" + this.num +".png') center " + this.imgX + "px no-repeat",	
			});
		} else {
			$(this.peo).css({
				background: "url('images/role1_" + this.num +".png') center " + this.imgX + "px no-repeat",	
			});
		}
	}
}
// 判断
Infi.prototype.judge = function(){
	if(this.topPos >= 0){
		this.bgTrans += 3;
		if (this.bgTrans > 1450) {
			this.bgTrans = 1450;
		};
		$(".main-bg").animate({
			"translateY" :  this.bgTrans + "px" 
		}, 100);
		this.topPos = -120;
		this.dom.style.height = '750px';
		$(this.dom).css({
			"transform" : "translateY(" + this.topPos + "px)"
		});
		this.insertRow();
		this.delRow();
		
		this.sco++;
		if ((this.sco + this.addSco) % 20 == 0 && !this.invincible) {
			var randomNum = Math.floor(Math.random() * 5);
			if (randomNum >= 2) {
				this.showApl();
			};
		};
		$(".sco").html(this.sco + this.addSco);
		this.step = this.step + 0.005;
		if (this.step > 5) {
			this.step = 5;
		};
	}
};
// 判断输赢
Infi.prototype.judgeBoom = function() {
	if ($("#container").children().eq(4)[0].place == this.peo.posi) {
		if (this.invincible) {
			return;
		};
		this.end();
	};
}
// 大块移动
Infi.prototype.move = function(){
	var _this = this;
	var cliNum = null;
	this.topPos += this.step;
	$(this.dom).css({
		"transform" : "translateY(" + this.topPos + "px)"
	});
	if (this.topPos > -10 && this.topPos < 0) {
		if (!$("#container").children().eq(4)[0].isOk) {
			$("#container").children().eq(4)[0].isOk = 1;
			if ($("#container").children().eq(4)[0].place) {
				if ($("#container").children().eq(4)[0].place == 1) {
					this.destroyBox("left");
				} else {
					this.destroyBox("right");
				}
				$("#container").children().eq(4).children().remove();
			} else {
				if (this.peo.posi == 1) {
					this.destroyBox("not-l");
				} else {
					this.destroyBox("not-r");
				}
				$("#container").children().eq(4).children().remove();
			}
			this.judgeBoom();
			if (this.peoG) {
				clearInterval(this.timer);
			};
			this.timer = setInterval(function() {
				if (this.peo.check == 1) {
					this.num = 1;
				};
				_this.peoG();
			}, 80 - this.step * 10);
		};
	}
};
// 开始游戏
Infi.prototype.start = function(){
	var _t = this;
	_t.clock = setInterval(function(){
		_t.move();
		_t.judge();
	}, 3);
};

// 被砍掉树木动画效果
Infi.prototype.destroyBox = function(dir) {
	var fat = document.querySelector(".destroy-box");
	var newO = document.createElement("div");
	var firChild = fat.firstChild;
	fat.insertBefore(newO , firChild);
	if (dir == "left") {
		$(".destroy-box > div").first().css({
			"background" : "url('images/go-left.png') no-repeat",
			"background-size" : "100% 100%",
			"opacity" : "1"
		});
		if (this.peo.posi == 2) {
			$(".destroy-box > div").first().animate({
				"rotateZ" : '-10deg',
				"translateX" : '-600px',
				"opacity" : "0"
			}, 500 - this.step * 40, function() {
				$(".destroy-box > div").last().remove();
			});
		} else {
			$(".destroy-box > div").first().animate({
				"rotateZ" : '-10deg',
				"translateX" : '600px',
				"opacity" : "0"
			}, 500 - this.step * 40, function() {
				$(".destroy-box > div").last().remove();
			});
		}

	} else if(dir == "right") {
		$(".destroy-box > div").first().css({
			"left" : "35%",
			"background" : "url('images/go-right.png') no-repeat",
			"background-size" : "100% 100%",
			"opacity" : "1"
		})
		if (this.peo.posi == 2) {
			$(".destroy-box > div").first().animate({
				"rotateZ" : '10deg',
				"translateX" : '-600px',
				"opacity" : "0"
			}, 500 - this.step * 40, function() {
				$(".destroy-box > div").last().remove();
			});
		} else {
			$(".destroy-box > div").first().animate({
				"rotateZ" : '10deg',
				"translateX" : '600px',
				"opacity" : "0"
			}, 500 - this.step * 40, function() {
				$(".destroy-box > div").last().remove();
			});
		}
	} else if(dir == "not-l") {
		$(".destroy-box > div").first().css({
			"width" : "30%",
			"left" : "35%",
			"background" : "url('images/tree_01.png') no-repeat",
			"background-size" : "100% 100%",
			"opacity" : "1"
		})
		if (this.peo.posi == 2) { 
			$(".destroy-box > div").first().animate({
				"rotateZ" : '10deg',
				"translateX" : '-600px',
				"opacity" : "0"
			}, 500 - this.step * 40, function() {
				$(".destroy-box > div").last().remove();
			});
		} else {
			$(".destroy-box > div").first().animate({
				"rotateZ" : '10deg',
				"translateX" : '600px',
				"opacity" : "0"
			}, 500 - this.step * 40, function() {
				$(".destroy-box > div").last().remove();
			});
		}
	} else {
		$(".destroy-box > div").first().css({
			"width" : "30%",
			"left" : "35%",
			"background" : "url('images/tree_01.png') no-repeat",
			"background-size" : "100% 100%",
			"opacity" : "1"
		})
		if (this.peo.posi == 2) {
			$(".destroy-box > div").first().animate({
				"rotateZ" : '-10deg',
				"translateX" : '-600px',
				"opacity" : "0"
			}, 500 - this.step * 40, function() {
				$(".destroy-box > div").last().remove();
			});
		} else {
			$(".destroy-box > div").first().animate({
				"rotateZ" : '-10deg',
				"translateX" : '600px',
				"opacity" : "0"
			}, 500 - this.step * 40, function() {
				$(".destroy-box > div").last().remove();
			});
		}
	}
}

Infi.prototype.end = function(){
	clearInterval(this.clock);
	clearInterval(this.timer);
	infi.suspend = true;
	this.clock = null;
	this.timer = null;
	$(".now-sco").html($(".sco").html());
	edition = $(".sco").html();
	$(".sco").html(0);
	$(".container").children().remove();
	$(".game-box").css({
		"display" : "none"
	});
	$(".list-show").css({
		"display" : "block"
	});
	$(".continue").off("touchstart");
	$(".game-box").off("touchstart");
	gameO();
};
function gameO() {
	infi = null;
	editionShow();
}

function gogame() {
	var oContainer = document.getElementById('container'); 
	infi = new Infi(oContainer);
	infi.init();
	return;
}

function ordGame() {
	var oContainer = document.getElementById('container');
	block = new Block(oContainer);
	return;
}
// 普通模式

function Block(dom) {
	this.dom = dom;//获取容器
	var place = null;
	var _this = this;
	this.bgTrans = 0;
	this.num = 1;
	this.peoNum = peoNum;
	this.peo = document.getElementById("peo");
	this.peoTimer = null;
	this.begin = true;
	this.imgX = 0;
	this.sco = 0;
	this.gaT = null; // 时间计时器
	this.gameT = 194;
	this.isImg = false;
	this.blackImg = false;
	this.suspendNum = 3;
	this.sub = false;
	this.init();
	
	// 暂停
	$(".suspend").on("touchstart", function() {
		_this.sub = true;
		$(".continue").css({
			"display" : "block"
		});
		clearInterval(_this.gaT);
		$(".suspend-box").css({
			"display" : "block"
		});
	})
	// 开始
	$(".continue").on("touchstart", function() {
		$(".continue").css({
			"display" : "none"
		});
		$(".con-num").css({
			"display" : "block"
		});
		var conTimer = setInterval(function() {
			_this.suspendNum--;
			$(".con-num").html(_this.suspendNum);
			if (_this.suspendNum <= 0) {
				clearInterval(conTimer);
				conTimer = null;
				_this.suspendNum = 3;
				$(".con-num").html("3");
				$(".con-num").css({
					"display" : "none"
				});
				$(".suspend-box").css({
					"display" : "none"
				});
				_this.sub = false;
				_this.gameTime();
			};
		}, 1000);
	})
	$(".game-box").on("touchstart", function(e) {
		if (_this.sub) {
			return;
		};
		if (e.touches[0].clientX >= viewportWidth/2) {
			// 点击右边时
			$(_this.peo).css({
				"float" : "right"
			})
			_this.num = 2;
			if (_this.peoNum == 0) {
				$(_this.peo).css({
					"background": "url('images/role_2.png') center 0px no-repeat"	
				})
			} else {
				$(_this.peo).css({
					"background": "url('images/role1_2.png') center 0px no-repeat"	
				})
			}
		}
		if (e.touches[0].clientX < viewportWidth/2) {
			// 点击左边时
			$(_this.peo).css({
				"float" : "left"
			})
			_this.num = 1;
			if (_this.peoNum == 0) {
				$(_this.peo).css({
					"background": "url('images/role_1.png') center 0px no-repeat"	
				})
			} else {
				$(_this.peo).css({
					"background": "url('images/role1_1.png') center 0px no-repeat"	
				})
			}
		}
		if (_this.peoTimer) {
			clearInterval(_this.peoTimer);
		};
		_this.peoTimer = setInterval( function(){
			_this.peoGif();
		}, 70);
		if (_this.dom.childNodes[_this.dom.childNodes.length - 1].place == _this.num) {
			_this.end();
			return;
		} else {
			$("#container").children().last().children().remove();
			var fat = document.querySelector(".destroy-box");
			var newO = document.createElement("div");
			var firChild = fat.firstChild;
			fat.insertBefore(newO , firChild);
			if (_this.num == 2 && _this.dom.childNodes[_this.dom.childNodes.length - 2].place == 1) {
				// 左树枝
				$(".destroy-box > div").first().css({
					"background" : "url('images/go-left.png') no-repeat",
					"background-size" : "100% 100%",
					"opacity" : "1"
				})
				$(".destroy-box > div").first().animate({
					"rotateZ" : '-10deg',
					"translateX" : '-600px',
					"background-size" : "100% 100%",
					"opacity" : "0"
				}, 500, function() {
					$(".destroy-box > div").last().remove();
				});
			} else if(_this.num == 1 && _this.dom.childNodes[_this.dom.childNodes.length - 2].place == 2) {
				// 右树枝
				$(".destroy-box > div").first().css({
					"left" : "35%",
					"background" : "url('images/go-right.png') no-repeat",
					"background-size" : "100% 100%",
				})
				$(".destroy-box > div").first().animate({
					"rotateZ" : '10deg',
					"translateX" : '600px',
					"background-size" : "100% 100%",
				}, 500, function() {
					$(".destroy-box > div").last().remove();
				});
			} else if(_this.num == 1 && !_this.dom.childNodes[_this.dom.childNodes.length - 2].place) {
				// 没树枝 左飞
				$(".destroy-box > div").first().css({
					"width" : "30%",
					"left" : "35%",
					"background" : "url('images/tree_01.png') no-repeat",
					"background-size" : "100% 100%",
			})
				$(".destroy-box > div").first().animate({
					"rotateZ" : '10deg',
					"translateX" : '600px',	
					"background-size" : "100% 100%",
				}, 500, function() {
					$(".destroy-box > div").last().remove();
				});
			} else {
				// 没树枝右飞
				$(".destroy-box > div").first().css({
					"width" : "30%",
					"left" : "35%",
					"background" : "url('images/tree_01.png') no-repeat",
					"background-size" : "100% 100%",
					"opacity" : "1"
				});
				$(".destroy-box > div").first().animate({
					"rotateZ" : '-10deg',
					"translateX" : '-600px',
					"opacity" : "0",					
					"background-size" : "100% 100%",
				}, 500, function() {
					$(".destroy-box > div").last().remove();
				});
			}
			
			_this.bgTrans += 3;
			if (_this.bgTrans > 1450) {
				_this.bgTrans = 1450;
			};
			$(".main-bg").animate({
				"translateY" :  _this.bgTrans + "px" 
			}, 100);
			$("#container").animate({
				"transform" : "translateY(0px)"
			}, 70, function() {
				if (_this.dom.childNodes[_this.dom.childNodes.length - 2].place == _this.num) {
					_this.end();
					return;
				};
				_this.delRow();
				_this.insertRow();
				$("#container").css({
					"transform" : "translateY(-120px)"
				});
				_this.gameT += 5;
				_this.sco++;
				$(".sco").html(_this.sco);
			})
		}
	})
}
		
	// 初始化生成
Block.prototype.init = function() {
	var _t = this;
	$(".timeCon").css({
		"display" : "block"
	})
	$(_t.peo).css({
		"float" : "left"
	});
	$(".container").css({
		"transform" : "translateY(-120px)"
	})
	$(".main-bg").css({
		"transform" :  "translateY(0px)" 
	});
	$(".sco").html(0);
	if (_t.peoNum == 0) {
		$(_t.peo).css({
			"background" : "url('images/role_1.png') center 0px no-repeat"	
		});
	} else {
		$(_t.peo).css({
			"background" : "url('images/role1_1.png') center 0px no-repeat"	
		});
	}
	
	for(var i = 0;i < 6;i++){
		_t.insertRow();
	}
	_t.gameTime();
	if(this.dom.childNodes.length > 6){
		this.dom.removeChild(this.dom.childNodes[this.dom.childNodes.length - 1]);
	};
	_t.begin = false;
	_t.num = 1;
};
	
// 添加节点
Block.prototype.insertRow = function() {
	var oRow = this.createCell('row');
	var classArr = this.classArr();
	oRow.place = place;
	var oCell = null;
	for(var i = 0; i < 3; i++){
		oCell = this.createCell(classArr[i]);
		oRow.appendChild(oCell);
	}
	var firChild = this.dom.firstChild;
	this.dom.insertBefore(oRow , firChild);
};
	
// 移除节点
Block.prototype.delRow = function(){
	this.dom.removeChild(this.dom.childNodes[this.dom.childNodes.length - 1]);
};
// 生成树枝
Block.prototype.classArr = function() {
	if (this.begin) {
		this.check = 2;
	};
	if (this.check == 1) {
		var arr = ['left', 'tree', 'right'];
		var i = Math.floor(Math.random() * 2);
		if (i == 1) {
			arr[i + 1] += ' r';
			place = 2;
		} else {
			arr[i] += ' l';
			place = 1;
		}
		this.check = 2;
		return arr;
	} else {
		var arr = ['atmosphere', 'tree', 'atmosphere'];
		this.check = 1;
		place = null;
		return arr;
	}
};

// 添加类名、创建节点
Block.prototype.createCell = function(className) {
	var oDiv = document.createElement('div');
	if (className == "tree") {
		if (this.tree == 1) {
			this.tree = 5;
		};
		oDiv.style.background = "url('images/tree_01.png')";
		oDiv.style.backgroundSize = "100% 100%"  
	};
	oDiv.className = className;
	return oDiv;
};

Block.prototype.gameTime = function() {
	var _this = this;
	var speed = null;
	_this.gaT = setInterval(function(){
		switch(true) {
			case _this.sco > 700: speed = 3.3; break;
			case _this.sco > 600: speed = 3.2; break;
			case _this.sco > 550: speed = 3.1; break;
			case _this.sco > 450: speed = 2.9; break;
			case _this.sco > 360: speed = 2.8; break;
			case _this.sco > 300: speed = 2.7; break;
			case _this.sco > 230: speed = 2.5; break;
			case _this.sco > 150: speed = 2.4; break;
			case _this.sco > 90: speed = 2.3; break;
			case _this.sco > 60: speed = 2.2; break;
			case _this.sco >= 0: speed = 1.7; break;
		}
		console.log(speed);
		_this.gameT -= speed;
		if (_this.gameT >= 194) {
			_this.gameT = 194;
		} else if(_this.gameT <= 0) {
			_this.gameT = 0;
			clearInterval(_this.gaT);
			_this.end();
		}
		$(".time").animate({
			"width" : _this.gameT
		});
	}, 100)
}
// 人物运动
Block.prototype.peoGif = function() {
	if (!this.isImg) {
		this.imgX -= 150;
	}
	if (this.isImg) {
		this.imgX += 150;
	}
	if (this.imgX >= 0) {
		this.isImg = false;
		if (this.blackImg) {
			clearInterval(this.peoTimer);
		}
	}
	if (this.imgX <= -300) {
		this.isImg = true;
		this.blackImg = true;
	}
	if (this.peoNum == 0) {
		$(this.peo).css({
			background: "url('images/role_" + this.num +".png') center " + this.imgX + "px no-repeat"
		});
	} else {
		$(this.peo).css({
			background: "url('images/role1_" + this.num +".png') center " + this.imgX + "px no-repeat"
		});
	}
}


Block.prototype.end = function() {
	clearInterval(this.gaT);
	$(".timeCon").css({
		"display" : "none"
	});
	ordinary = $(".sco").html();
	$(".now-sco").html($(".sco").html());
	$(".sco").html(0);
	$(".container").children().remove();
	$(".game-box").css({
		"display" : "none"
	});
	$(".gameStart").css({
		"display" : "block"
	});
	$(".continue").off("touchstart");
	$(".game-box").off("touchstart");
	gameB();
};

function gameB() {
	block = null;
	editionShow();
}


// sx
//开始游戏按钮
$('.startBtn').on('touchstart', function() {
	$('.gameStart').css({
		'display' : 'none'
	});
	$('.swiper-wrapper').css({
		'transform': 'translate3d(0px, 0px, 0px)'
	});
	$('.renChange').css({
		'display' : 'block'
	});
	$('.explain').css({
		'display' : 'none'
	});
	//swiper 框架代码
	var mySwiper = new Swiper('.renChange .swiper-container',{
		direction : 'horizontal',
		prevButton:'.swiper-button-prev',
		nextButton:'.swiper-button-next'
	})
	$(this).css({
		'display' : 'none'
	});
	$(this).prev().css({
		'display' : 'none'
	});
	peoMove();
})
//游戏说明界面
$('.helpBtn').on('touchstart', function() {
	$('.swiper-wrapper').css({
		'transform' : 'translate3d(0px, 0px, 0px)'
	});
	$('.gameStart').css({
		'display' : 'none'
	});
	 $('.gameName').css({
	 	'display' : 'block'
	 });
	$(this).css({
		'display' : 'none'
	});
	$(this).next().css({
		'display' : 'none'
	});
	$('.explain').css({
		'display' : 'block'
	});
	var mySwiper = new Swiper('.explain .swiper-container',{
		direction : 'horizontal',
		prevButton:'.swiper-button-prev',
		nextButton:'.swiper-button-next'
	})
})
var imgX = 0;
var isImg = false;
function peoGif() {
	if (!isImg) {
		imgX -= 200;
	}
	if (isImg) {
		imgX += 200;
	}
	if (imgX >= 0) {
		isImg = false;
	}
	if (imgX <= -400) {
		isImg = true;
	}
	$('.renChange .swiper-slide').eq(0).children('.peoStyle').css({
		'background': "url('images/role_b1.png') center " + imgX + "px no-repeat"
	})
	$('.renChange .swiper-slide').eq(1).children('.peoStyle').css({
		'background': "url('images/role_b2.png') center " + imgX + "px no-repeat"
	})
}
var timer;
function peoMove() {
	timer = setInterval(function() {
		peoGif();
	}, 200)
}
$('.peoBtn').on('touchstart', function() {
	clearInterval(timer);
	peoNum = $(this).parent().index();
	//peoNum - 选择的人物编号
	$('.renChange').css({
		'display' : 'none'
	})
	$('.gameStart').css({
		'display' : 'block'
	})
	selectMode();
})
function selectMode() {
	var _this;
	$('.ordinary').css({
		'display' : 'block'
	});
	$('.fanatical').css({
		'display' : 'block'
	});
	$('.ordinary').on('touchstart', function() {
		mode(1);
		//普通模式接口
		$('.gameStart').css({
			'display' : 'none'
		})
		$(".game-box").css({
			"display" : "block"
		})
		$('.ordinary').off('touchstart');
		nowPlay = 1;
		ordGame();
	});
	$('.fanatical').on('touchstart', function() {
		mode(2);
		//进击模式接口
		$('.gameStart').css({
			'display' : 'none'
		})
		$(".game-box").css({
			"display" : "block"
		})
		$('.fanatical').off('touchstart');
		nowPlay = 2;
		gogame();
	});
	function mode(num) {
		$('.gameName').css({
			'width' : 356,
			'background' : 'url(images/gameover.png) 0 0 no-repeat'
		});
		$('.renChange').css({
			'display' : 'none'
		});
		$('.ordinary').css({
			'display' : 'none'
		});
		$('.fanatical').css({
			'display' : 'none'
		});
	}
}

//重新开始游戏
$('.list-out').on('touchstart', function() {
	$('.list-show ul').children().remove();
	$(".list-show").css({
		"display" : "none"
 	});
 	$(".gameName").css({
 		"background" : "url('images/playgame.png') 0 0 no-repeat;"
 	});
 	$(".gameStart").css({
		"display" : "block"
 	});
 	$(".helpBtn").css({
 		"display" : "block"
 	});
 	$(".startBtn").css({
 		"display" : "block"
 	});
})
//重新开始当前游戏
$('.list-again').on('touchstart', function() {
	$('.list-show ul').children().remove();
	$(".list-show").css({
		"display" : "none"
 	});
 	$(".game-box").css({
		"display" : "block"
 	})
	if (nowPlay == 2) {
		gogame();
	} else {
		ordGame();
	}
})
function editionShow() {
	$(".list-show").css({
		"display" : "block"
 	});
 	$(".ga-over").css({
 		"display" : "block"
 	});
 	if (nowPlay == 2) {
 		$(".list-show h3").html("进击模式排行版");
		var ls = window.localStorage;
		if (ls) {
			var listSco = JSON.parse(ls.getItem("editionList"));
			if (listSco == null) {
				listSco = [];
			}
			listSco.push(edition);
		 	listSco.sort(function(a, b) {
				return b - a;
			});
			listSco = listSco.slice(0, 10);
			ls.setItem("editionList", JSON.stringify(listSco));
		};
		for (var i = 0; i < listSco.length; i++) {
			var num = i + 1;
			$(".list-show ul").append("<li></li>");
			$(".list-show li").eq(i).html("第" + num + "名:" + "  " + listSco[i] + "分");
		};
 	} else {
 		$(".list-show h3").html("普通模式排行版");
	 	var ls = window.localStorage;
		if (ls) {
			var listSco = JSON.parse(ls.getItem("ordinaryList"));
			if (listSco == null) {
				listSco = [];
			}
			listSco.push(ordinary);
		 	listSco.sort(function(a, b) {
				return b - a;
			});
			listSco = listSco.slice(0, 10);
			ls.setItem("ordinaryList", JSON.stringify(listSco));
		};
		for (var i = 0; i < listSco.length; i++) {
			var num = i + 1;
			$(".list-show ul").append("<li></li>");
			$(".list-show li").eq(i).html("第" + num + "名:" + "  " + listSco[i] + "分");
		};
 	}
}
