// 判断是否是PC端
var isPc = function(){
	var userAgent = navigator.userAgent;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(userAgent) ? false : true;
}
var importStyle = function(v){
	v = v ? 'pc' : 'mobile';
	var head = document.querySelector('head');
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = './css/index.' + v + '.css';
	head.appendChild(link);
}
importStyle(isPc());

// JQ.
$(document).ready(function(){
	
	// 通用模块
	var common = {
		// 接口地址
		api: 'http://51v.com',

		dom: {
			model: $('.model'),
			getMoneyBtn: $('.getMoney'),
			getJinboBtn: $('.getJinbo')
		},
	
		// 规则弹窗
		showRule: function(){
			var root = this;
			var ruleBtn = $('.rule');
			var ruleBox = $('.showRule');
			ruleBtn.on('click', function(){
				root.dom.model.show();
				ruleBox.show();
			})
			ruleBox.find('.modelClose').on('click', function(){
				ruleBox.hide();
				root.dom.model.hide();
			})
		},

		// 打开红包记录
		showList: function(){
			var root = this;
			var listBtn = $('.recordBtn');
			var listBox = $('.showList');
			listBtn.on('click', function(){
				root.dom.model.show();
				listBox.show();
			})
			listBox.find('.modelClose').on('click', function(){
				listBox.hide();
				root.dom.model.hide();
			})
		},

		// 通用弹窗
		showModel: function(params){
			var root = this;
			var doms = {
				rootDom: $('.getMoneyModel'),
				closeBtn: $('.modelClose'),
				title: $('.getMoneyModelTitle'),
				des: $('.getMoneyModelDes'),
				cancel: $('.getMoneyModelCancel'),
				sure: $('.getMoneyModelSure'),
				tipsText: $('.getMoneyModelBottom')
			}
			doms.title.text(params.title);
			doms.des.text(params.des);
			if(params.tips){
				doms.cancel.remove();
				doms.tipsText.text(params.tipsText);
				doms.tipsText.show();
			}else{
				doms.cancel.text(params.cancel)
			}
			doms.sure.text(params.sure);
			root.dom.model.show();
			doms.rootDom.show();
			doms.closeBtn.on('click', function(){
				root.dom.model.hide();
				doms.rootDom.hide();
			})
			doms.cancel.on('click', function(){
				root.dom.model.hide();
				doms.rootDom.hide();
			})
			doms.sure.unbind();
			doms.sure.on('click', function(){ params.callback() });
		},

		// 兑换
		showExchange: function(v){
			var root = this;
			var doms = {
				closeBtn: $('.modelClose'),
				exchange: $('.exchange'),
				ipt: $('.exchangeContent').find('input'),
				all: $('.exchangeContent').find('a'),
				cancel: $('.exchangeCancel'),
				sure: $('.exchangeSure'),
				money: $('.money')
			}
			root.dom.model.show();
			doms.exchange.show();
			doms.cancel.on('click', function(){
				root.dom.model.hide();
				doms.exchange.hide();
			})
			doms.closeBtn.on('click', function(){
				root.dom.model.hide();
				doms.exchange.hide();
			})
			doms.all.on('click', function(){
				doms.ipt.val(doms.money.text());
			})
			doms.ipt.on('focus', function(){
				doms.ipt.val('');
			})
			// doms.ipt.on('blur', function(){
			// 	if($(this).val() == '' || parseInt($(this).val()) <= 0){
			// 		layer.msg('兑换金额不能小于0.01');
			// 	}
			// 	if(parseInt($(this).val()) > parseInt(doms.money.text())){
			// 		layer.msg('可兑换金额不足');
			// 		doms.ipt.val(doms.money.text());
			// 	}
			// })
			doms.sure.unbind();
			doms.sure.on('click', function(){
				console.log(doms.ipt.val(), typeof doms.ipt.val())
				if(doms.ipt.val() == '' || parseInt(doms.ipt.val()) <= 0){
					layer.msg('兑换金额不能小于0.01');
					return
				}
				if(parseInt(doms.ipt.val()) > parseInt(doms.money.text())){
					layer.msg('可兑换金额不足');
					doms.ipt.val(doms.money.text());
					return
				}
				v() });
		},

		// 跑马灯
		slide: function(data){
			var i = 0;
			var sayText = $('.sayText');
			var timer = setInterval(function(){
				sayText.text(data[i]);
				i++
			}, 3000);
		},

		use: function(){
			this.showRule();
			this.showList();
		}
	}
	var shareBtn = $('.z3').find('img')
	// 移动端
	var mobile = {
		jdk: {
			to: 0,
			title: '【福利】重！磅！消！息！',
			desc: '红包福利人人领，邀请好友，万元红包等你拿',
			isImg: 1,
			needdParams: 1,
			link: '',
			imgUrl: ''
		},
		shareApi: function(){
			return 'uniwebview://share?to='+this.jdk.to+'&&title='+this.jdk.title+'&&desc='+this.jdk.desc+'&&isImg='+this.jdk.isImg+'&&needdParams='+this.jdk.needdParams+'&&link='+this.jdk.link+'&&imgUrl='+this.jdk.imgUrl
		},
		shareEvent: function(){
			var root = this;
			shareBtn.on('click', function(){
				window.open(root.shareApi());
			})
		},
		use: function(){
			this.shareEvent();
		}
	}
	// PC端
	var pc = {
		showqrcode: $('.showqrcode'),	
		shareEvent: function(){
			var root = this;
			shareBtn.on('click', function(){
				common.dom.model.show();
				root.showqrcode.show();
				common.dom.model.on('click', function(e){
					common.dom.model.hide();
					root.showqrcode.hide();
					common.dom.model.unbind();
				})
			})
		},
		use: function(){
			this.shareEvent();
		}
	}
	common.use();
	isPc() ? pc.use() : mobile.use();


	// 数据
	var getDate = {
		
	}


	// 提现
	$('.getMoney').on('click', function(){
		common.showModel({
			title: '提现5元',
			des: '确定要提现5元现金吗？',
			cancel: '取消',
			sure: '确认提现',
			callback: function(){
				alert('0')
			}
		})
	})

	// 兑换金币
	$('.getJinbi').on('click', function(){
		common.showExchange(function(){
			common.dom.model.hide();
			$('.exchange').hide();
			common.showModel({
				title: '兑换金币',
				des: '确定要花费' + $('.exchangeContent').find('input').val() + '元红包兑换' +  $('.exchangeContent').find('input').val()*20000 + '金币吗？',
				cancel: '取消',
				sure: '确认兑换',
				callback: function(){
					alert(1)
				}
			})
		})
		
	})

	// 拆红包
	$('.canOpen').on('click', function(){
		$(this).find('img').remove();
		$(this).find('p').show();
		$(this).removeClass('canOpen').addClass('open');
	})

})