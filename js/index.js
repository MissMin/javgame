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

var dataEncode = function(v){
	var formDate = new FormData();
	for (k in v){
		formDate.append(k, v[k]);
	}
	return formDate;
}

// JQ.
$(document).ready(function(){
	
	// 通用模块
	var common = {
		// 接口地址
		api: 'http://mhall.51v.cn/active',

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
			doms.sure.unbind();
			doms.sure.on('click', function(){
				if(doms.ipt.val() == '' || parseFloat(doms.ipt.val()) <= 0){
					layer.msg('兑换金额不能小于0.01');
					return
				}
				if(parseFloat(doms.ipt.val()) > parseFloat(doms.money.text())){
					layer.msg('可兑换金额不足');
					doms.ipt.val(doms.money.text());
					return
				}
				v()
			});
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
			to: '{0}',
			title: '{【福利】重！磅！消！息！}',
			desc: '{红包福利人人领，邀请好友，万元红包等你拿}',
			isImg: '{1}',
			needdParams: '{1}',
			link: '{}',
			imgUrl: '{}'
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
				$('#qrcode').empty();
				$('#qrcode').qrcode({
					render: 'canvas',
					width: 140,
					height: 140,
					text: 'http://www.baidu.com'
				});
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
		// 获取红包余额
		getMoney: function(){
			$.ajax({
				type: 'post',
				url: common.api + '/GetUserShareRedPacketAmount',
				dataType: 'json',
				success: function(r){
					if(r.Code == 0){
						$('.money').text(r.Data.amount);
						if(r.Data.isOpen == 1){
							$('.loadGet').find('p').text(r.Data.amount);
							$('.model').show();
							$('.loadGet').show();
							$('.model').on('click', function(e){
								if(e.target.className == 'model'){
									$('.model').hide();
									$('.loadGet').hide();
									$('.model').unbind();
								}
							})
						}
					}else{
						layer.msg(r.Nessage);
					}
				}
			})
		},
		// 获取红包记录
		getRedPacketRecord: function(){
			var data = {
				typeid: 2
			}
			$.ajax({
				type: 'post',
				url: common.api + '/GetUserShareRedPacketList',
				dataType: 'json',
				data: data,
				success: function(r){
					if(r.Code == 0){
						var listBox = $('.redPacketListBox');
						var item =$('.redPacketListItem');
						for(var i=0; i<r.Data.length; i++){
							var self = item.clone();
							self.css('display', 'flex');
							self.find('img').attr('src', r.Data[i].logo);
							self.find('div').find('p').eq(0).text(r.Data[i].nickName);
							self.find('div').find('p').eq(1).text(r.Data[i].writeDT);
							self.find('.redPacketListMoney').text(r.Data[i].amount + '元');
							listBox.append(self);
						}
					}else{
						layer.msg(r.Nessage);
					}
				}
			})
		},
		// 获取可拆红包
		getRedPacketList: function(){
			var data = {
				typeid: 1
			}
			$.ajax({
				type: 'post',
				url: common.api + '/GetUserShareRedPacketList',
				dataType: 'json',
				data: data,
				success: function(r){
					if(r.Code == 0){
						var contentRight = $('.contentRight');
						var open = contentRight.find('.open');
						var canopen = contentRight.find('.canOpen');
						var onclose = contentRight.find('.onclose');
						for(var i=0; i<r.Data.length; i++){
							var item = null;
							if(r.Data[i].isGet == 0){
								item = canopen.clone();
							}else{
								item = open.clone();
							}
							item.css('display', 'block');
							item.attr('index', i+1);
							item.find('p').text(r.Data[i].amount);
							contentRight.append(item);
						}
						for(var i=r.Data.length; i<10; i++){
							item = onclose.clone();
							item.css('display', 'block');
							item.attr('index', i+1);
							contentRight.append(item);
						}
						
						// 拆红包
						$('.canOpen').on('click', function(){
							$(this).find('img').remove();
							$(this).find('p').show();
							$(this).removeClass('canOpen').addClass('open');
						})
					}else{
						layer.msg(r.Nessage);
					}
				}
			})
		},
		// 红包广播
		getSlide: function(){
			var cloak = null;
			var run = function(){
				$.ajax({
					type: 'post',
					url: common.api + '/GetLastReceviceShareRedPacketNotice',
					dataType: 'json',
					success: function(r){
						if(r.Code == 0){
							var slideUserName = $('.slideUserName');
							var i = 0;
							var setSlide = function(i){
								slideUserName.text(r.Data[i].nickName);
							}
							setSlide(i)
							cloak = setInterval(function(){
								i++;
								if(i == r.Data.length){
									i = 0;
								}
								setSlide(i)
							}, 3000)
						}else{
							layer.msg(r.Nessage);
						}
					}
				})
			}
			run();
			setInterval(function(){
				clearInterval(cloak)
				run()
			}, 12000)
		},
		// 提现和兑换
		exchange: function(type, v){
			var data = {
				typeid: type,
				exChangeAmount: parseFloat(v)
			}
			$.ajax({
				type: 'post',
				url: common.api + '/ExChangeShareRedPacketToGold',
				dataType: 'json',
				data: data,
				success: function(r){
					if(r.Code == 0){
						layer.msg( type == 3 ? '提现成功' : '兑换成功');
						var num = parseFloat($('.money').text()) - parseFloat(v);
						$('.money').text(num.toFixed(2));
						$('.getMoneyModel').hide();
						$('.model').hide();
					}else{
						layer.msg(r.Nessage);
					}
				}
			})
		},
		use: function(){
			this.getMoney();
			this.getRedPacketRecord();
			this.getRedPacketList();
			this.getSlide();
		}
	}
	
	getDate.use()
	
	


	// 提现
	$('.getMoney').on('click', function(){
		if(parseInt($('.money').text()) < 5){
			layer.msg('红包余额不足');
			return false;
		}
		common.showModel({
			title: '提现5元',
			des: '确定要提现5元现金吗？',
			cancel: '取消',
			sure: '确认提现',
			callback: function(){
				getDate.exchange(3, '0.05');
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
					getDate.exchange(4, parseFloat($('.exchangeContent').find('input').val()));
				}
			})
		})
	})

})