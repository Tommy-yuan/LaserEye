$(function() {
	

	


	var beginDialog = 'img/pk/begin.png',
		hasBegin = false,
		isPK = false,
		curTurn = myTurn,
		loopCount = 0,
		maxLoop = 8;

	$(".pk-headimg").each(function(index, el) {
		$(this).height($(this).width());
		$(this).css('border-radius',$(this).width()/2);
	});

	$(".pk-content").height($(window).height()/2);


	

	initalPK(myScore,oppScore);

	//开始游戏
	$(".pk-bottom-begin").click(function(){

		if (!hasBegin) 
		{
			hasBegin = true;
			isPK = true;
			insertDialog(curTurn,'img/pk/begin.png');
			$(".pk-bottom-tip").css('display','none');
			var loop = setInterval(function(){

				var index = Math.round(Math.random()*19);
				console.log(index);
				var content = pk_content[index];
				insertDialog(curTurn,content["dialog"]+curTurn+".png");
				var success = Math.round(Math.random())==0?false:true;
				changePKText(index,success);
				calSocre(success?content["success"]:content["failure"],curTurn);
				if (curTurn == myTurn) 
				{
					curTurn = oppTurn;
				}
				else{
					curTurn = myTurn;
				}
				loopCount++;
				if (loopCount>=maxLoop) 
				{
					window.clearInterval(loop);
					setTimeout(function(){
						pkEnd();
					},2000);
				}
			},2000);
		}
		else if (!isPK){
			// pkEnd();
			$(".game-result").css("display","block");
			cryBegin();
		}
	});

	//结果关闭
	$(".result-close").click(function(){
		$(".game-result").css("display","none");
		window.clearInterval(myCryAnimate);
		window.clearInterval(oppCryAnimate);
	});

	//分享
	$(".result-shareBtn").click(function(){
		// $(".game-share").css('display', 'block');
		shareMyScore();
	});

	//分享背景点击关闭
	$(".game-share").click(function(){
		$(".game-share").css('display', 'none');
	});

	//PK页tip关闭
	$(".pk-tip-close").click(function(){
		$(".pk-bottom-tip").css('display','none');
	});

	//分享成功后 关闭
	$(".shareSuccess-close").click(function(){
		$(".shareSuccess").css('display','none');
	});

	//分享成功后 重新挑战
	$(".shareSuccess-again").click(function(){
		initalPKAgain(myScore,oppScore);
		
	});

	var submitClicked =false;
	$("#phoneSubmit").click(function(){
		var yearRex = /^[0-9]{1,20}$/,
            phone = $("#phoneText").val(),
            phoneRex =  /^(13[0-9]{9})|(14[0-9]{9})|(15[0-9]{9})|(18[0-9]{9})|(17[0-9]{9})$/;
        if (phone=="" || phoneRex.test(phone)==false || phone.length>11)
        {
            alert('请输入正确的手机号');
        }
        else{
        	submitClicked = true;
        	$.ajax({
        		url:"http://mobilecampaign.lorealparis.com.cn/Interface/ApiForCampaign/RvEyeLotterySaveContact.loreal",
        		type:'POST',
        		dataType:'json',
        		data:{
        			openId:openId,
        			mobile:phone,
        			lotteryId:lotteryId,
        			mobile:phone,
        			userName:myName
        		},
        		success:function(responseObj){
        			if (responseObj.errorMessage == 'success') 
        			{	
        				alert("提交成功");
        			}
        		},
        		error:function(errorObj){
        			alert("提交失败");
        		}
        	});
        }
	});

	//结果页查看排行榜
	$(".result-leadboard").click(function(){
		// mySwiper.swipeTo(rankPage);
		checkRank();
	});

	//分享页查看排行榜
	$(".shareSuccess-leaderboard").click(function(){

		// mySwiper.swipeTo(rankPage);
		checkRank()
	});

	//排行榜页分享
	$(".share-now").click(function(){
		shareMyScore();
	});

	//排行榜页重新挑战
	$(".fight-again").click(function(){
		initalPKAgain(myScore,oppScore);
	});

	var myCryAnimate,
		oppCryAnimate;

	//PK结束，跳出结果页
	function pkEnd(){

		isPK = false;

		var endScore = parseInt($(".pk-me-score").html()),
			oppScore = parseInt($(".pk-opponent-score").html());
		pkScore = endScore;

		$(".game-result").css("display","block");
		$(".result-headimg").each(function(index, el) {
			$(this).height($(this).width());
			$(this).css('border-radius',$(this).width()/2);
		});
		$(".whiteBg").each(function(index, el) {
			$(this).height($(this).width());
			$(this).css('border-radius',$(this).width()/2);
		});
		$(".pk-headimg").each(function(index, el) {
			$(this).height($(this).width());
			$(this).css('border-radius',$(this).width()/2);
		});

		$(".result-score").html(endScore);
		$(".result-me").find($(".result-name")).html($(".pk-me").find($(".pk-name")).html());
		$(".result-opponent").find($(".result-name")).html($(".pk-opponent").find($(".pk-name")).html());

		if (endScore > oppScore) 
		{
			//win
			console.log('win');
			$(".result-me").find($(".result-head-smile")).css('display', 'block');
			$(".result-me").find($(".result-head-cry")).css('display', 'none');

			$(".result-opponent").find($(".result-head-smile")).css('display', 'none');
			$(".result-opponent").find($(".result-head-cry")).css('display', 'block');

			$(".result-text").find('img').attr('src',winText[Math.round(Math.random()*(winText.length-1))]);

		}
		else if (endScore < oppScore) 
		{
			//lose
			console.log('lose');
			$(".result-me").find($(".result-head-smile")).css('display', 'none');
			$(".result-me").find($(".result-head-cry")).css('display', 'block');

			$(".result-opponent").find($(".result-head-smile")).css('display', 'block');
			$(".result-opponent").find($(".result-head-cry")).css('display', 'none');
			$(".result-text").find('img').attr('src',loseText[Math.round(Math.random()*(loseText.length-1))]);
		}
		else{
			console.log('equal');
			$(".result-me").find($(".result-head-smile")).css('display', 'none');
			$(".result-me").find($(".result-head-cry")).css('display', 'none');

			$(".result-opponent").find($(".result-head-smile")).css('display', 'none');
			$(".result-opponent").find($(".result-head-cry")).css('display', 'none');

			$(".result-text").find('img').attr('src',equalText[Math.round(Math.random()*(equalText.length-1))]);
		}
		cryBegin();


		$.ajax({
			url:'http://mobilecampaign.lorealparis.com.cn/Interface/ApiForCampaign/RvEyeSaveGameScore.loreal',
	        type:'POST',
	        dataType:'json',
	        data:{
	          openId:openId,
	          birth:myBirthDay,
	          gameScore:endScore
	        },
	        success:function(responseObj){
	        	console.log(responseObj);
	          if (responseObj.message == 'success') 
	          {
	            $.ajax({
			        url:'http://mobilecampaign.lorealparis.com.cn/Interface/ApiForCampaign/RvEyeGetMyBaseInfo.loreal',
			        type:'POST',
			        dataType:'json',
			        data:{
			          openId:openId
			        },
			        success:function(responseObj){
			        	console.log(responseObj);
			          if (responseObj.success) 
			          {
			            var content = responseObj.message[0];
			            $(".my-rank-num").html(content.Ranking);
			            $(".my-rank-name").html(content.NickName);
			            $(".my-rank-score").html(content.GameScore);
			            $("#my-rank-faceimg").html(content.Avatar);
			            wx_share(content.Ranking);
			          }
			        }
			    });
	          }
	        },
	        error:function(errorObj){
	        	console.log(errorObj);
	        }
		})

		

	}

	//哭的动画
	function cryBegin(){
		window.clearInterval(myCryAnimate);
		window.clearInterval(oppCryAnimate);
		myCryAnimate = null;
		oppCryAnimate = null;
		_cryAnimate($(".result-opponent").find($(".result-head-cry")),$(".result-head-cry").height(),6);
		_cryAnimate($(".result-me").find($(".result-head-cry")),$(".result-head-cry").height(),6);
		oppCryAnimate = setInterval(function(){
						_cryAnimate($(".result-opponent").find($(".result-head-cry")),$(".result-head-cry").height(),6);
					},800);

		myCryAnimate = setInterval(function(){
						_cryAnimate($(".result-me").find($(".result-head-cry")),$(".result-head-cry").height(),6);
					},800);
	}

	//PK初始化
	function initalPK(score,oppScore){
		hasBegin = false;
		isPk = false;
		loopCount = 0;
		curTurn = myTurn;

		$(".game-result").css('display', 'none');
		$(".shareSuccess").css('display','none');

		// $(".pk-me-score").html(score);
		// $("#pk-init-socre").html(score);
		setMyInitScore(myScore);

		$(".pk-opponent-score").html(oppScore);
		$(".pk-content").empty();
		$(".pk-me-newScore").css('display','none');
		$(".pk-opponent-newScore").css('display','none');
		$(".pk-text").css('display', 'none');
	}

	function initalPKAgain(score,oppScore){
		mySwiper.swipeTo(pkPage);
		initalPK(score,oppScore);
	}

});



function _cryAnimate(jqObj,height,milsec)
{
    var parentDiv = jqObj,
        innerDiv = parentDiv.find($(".img-cry-div")),
        h = height;
    // innerDiv.find($(".img-cry1")).css('height',h);
    innerDiv.css('height', "0");
    var flashHeight = 0;
    setTimeout(function(){
        var flashAnima = setInterval(function(){
            innerDiv.css('height', flashHeight+"%");
            flashHeight+=1;
            if (flashHeight>100) 
            {
                clearInterval(flashAnima);
                // verticalLineAnima(jqObj,height,milsec);
            };
        },milsec);
    },0);
}

//PK过程，插入随机对话，
function insertDialog(turn,dialog)
{
	var url = turn==myTurn?'js/pk-me-turn.ejs':'js/pk-oppontent-turn.ejs',
		headimg = turn==myTurn?myHeadimg:oppHeadimg;
	var dialog_dom = new EJS({
		url: url
	}).render({
		'data':{
			'headimg':headimg,
			'dialog':dialog
		}
	});

	$(".pk-content").append(dialog_dom);
	$(".pk-headimg").each(function(index, el) {
		$(this).height($(this).width());
		$(this).css('border-radius',$(this).width()/2);
	});
	var div = document.getElementById('pk-content');     
	div.scrollTop = div.scrollHeight+10; 

}

//PK过程，根据对话和是否成功，修改下方的文字
function changePKText(index,success){
	$(".pk-text").css('display', 'block');
	var content = pk_content[index];
	if (success) 
	{
		$("#pk-text-success").html("攻击成功！");
		$("#pk-text-content").html(content["success-text"]);
		$("#pk-text-score").html(content["success"]+"分");
	}
	else{
		$("#pk-text-success").html("攻击失败！");
		$("#pk-text-content").html(content["failure-text"]);
		$("#pk-text-score").html("+"+content["failure"]+"分");
	}
}

//PK过程，修改分数
function calSocre(score,turn){
	score = parseInt(score);
	if (turn == myTurn) 
	{
		//对方加减分
		var curSocre = parseInt($(".pk-opponent-score").html());
		$(".pk-opponent-newScore").css("display","block");
		$(".pk-me-newScore").css("display","none");
		$(".pk-opponent-newScore").html(score>=0?"+"+score:score);
		$(".pk-opponent-score").html(curSocre+score);
	}
	else if (turn == oppTurn)
	{
		//我方加减分
		var curSocre = parseInt($(".pk-me-score").html());
		$(".pk-me-newScore").css("display","block");
		$(".pk-opponent-newScore").css("display","none");
		$(".pk-me-newScore").html(score>=0?"+"+score:score);
		$(".pk-me-score").html(curSocre+score);
	}
}

var oppScore = 100; //test；


function beginPK(){

	//test
	// myScore = 300;
	oppScore = 20;
	setMyInitScore(myScore);
	setOppInitScore(oppScore);
	mySwiper.swipeTo(pkPage);

}

//结果页的文字
var winText = [
	'img/result/win0.png',
	'img/result/win1.png',
	'img/result/win2.png'
];

var loseText = [
	'img/result/lose0.png',
	'img/result/lose1.png'
];

var equalText = [
	'img/result/equal0.png',
	'img/result/equal1.png'
];


var myTurn = 0,
	oppTurn = 1,
	myHeadimg,
	oppHeadimg = 'img/result-opponent0.jpg';

//缺少 8png 10png 14png
var pk_content = [
	{
		"dialog":"img/pk/0-",
		"success":-10,
		"failure":0,
		"text":"老板说你这个月业绩突出，0.01元红包拿好别笑哭了！",
		"success-text":"大笑三声，眼角伸了个懒腰，表情纹爆表。",
		"failure-text":"呵呵哒~姐纹丝不动。"
	},
	{
		"dialog":"img/pk/1-",
		"success":-40,
		"failure":10,
		"text":"李敏镐在北极光下向你求婚！12克拉大钻戒戴在手上手都抬不起来了~",
		"success-text":"笑醒惊动隔壁邻居，眼角露出钻石型表情纹。",
		"failure-text":"不好意思姐是摩羯座，只玩心花怒放从不喜形于色，美容觉继续睡"
	},
	{
		"dialog":"img/pk/2-",
		"success":-20,
		"failure":40,
		"text":"闺蜜撸起袖子狂显摆男票送的苹果表！",
		"success-text":"狂翻白眼不止，眼皮在呻吟你听到了么？",
		"failure-text":"默默掏出男票送的眼霜玩自己的"
	},
	{
		"dialog":"img/pk/3-",
		"success":-40,
		"failure":0,
		"text":"男票女同事不小心把咖啡洒到他身上，用手帕在男票腿上不停摩擦摩擦~",
		"success-text":"白眼翻到后脑勺，眉头皱到鼻子尖，眼周肌肤后空翻。",
		"failure-text":"上前一步拉走男票回家换裤裤"
	},
	{
		"dialog":"img/pk/4-",
		"success":-30,
		"failure":0,
		"text":"穿高跟鞋赶电梯崴到脚，一瘸一拐进电梯后在男神面前强颜欢笑",
		"success-text":"眼角纹皱成千层饼",
		"failure-text":"男神正好出电梯没看见，爱谁谁去吧~"
	},
	{
		"dialog":"img/pk/5-",
		"success":-30,
		"failure":20,
		"text":"年会抽中头奖！",
		"success-text":"大笑不止被抬进疯人院急诊科，眼角纹不能缝针吧。。。",
		"failure-text":"切又只是iPhone6，姐都有3台了，和中安慰奖的同事换成面膜~"
	},
	{
		"dialog":"img/pk/6-",
		"success":-30,
		"failure":0,
		"text":"因为上了个洗手间，本来抽中年会头奖因为没来得及领被重抽",
		"success-text":"擦身而过的一夜暴富，哭晕在观众席~",
		"failure-text":"太好了！姐只想抽中眼霜~"
	},
	{
		"dialog":"img/pk/7-",
		"success":-20,
		"failure":0,
		"text":"儿时损友在男生面前狂说你童年糗事",
		"success-text":"朝她不停使眼色翻白眼也于事无补",
		"failure-text":"男生反而觉得自己萌萌哒，低头微笑美美哒~"
	},
	{
		"dialog":"img/pk/9-",
		"success":-40,
		"failure":0,
		"text":"和朋友野营不小心吃到大笑毒蘑菇，三天找不到解药",
		"success-text":"笑到脸抽筋",
		"failure-text":"一不小心想到银行卡余额"
	},
	{
		"dialog":"img/pk/12-",
		"success":-40,
		"failure":0,
		"text":"男票给你在旅行社订好了撒哈拉半年游计划，指南针请收好~",
		"success-text":"恋爱中的女人是白痴，居然就这样上路享受紫外线了……",
		"failure-text":"这种男票安的什么心？休了休了~"
	},
	{
		"dialog":"img/pk/11-",
		"success":-10,
		"failure":0,
		"text":"什么努力也不做，不知不觉又瘦了10斤！",
		"success-text":"自拍炫耀3000遍，放声狂笑老3年~",
		"failure-text":"离目标还差20斤，淡定的再跑6公里"
	},
	{
		"dialog":"img/pk/13-",
		"success":-40,
		"failure":0,
		"text":"去海岛度假不小心把包包掉海里了，防晒霜，太阳镜全没啦~",
		"success-text":"回来黑得妈妈都不认识了呢……T_T ",
		"failure-text":"姐可是游泳好手，一个猛子扎进海里捞上来！"
	},
	{
		"dialog":"img/pk/15-",
		"success":-30,
		"failure":20,
		"text":"这份全年方案老板看过了说要重做哦，明天一睁眼他要看不到你就惨了~",
		"success-text":"唉……又是个不眠之夜……",
		"failure-text":"世界这么大，正好去看看~美容觉走一个"
	},
	{
		"dialog":"img/pk/16-",
		"success":-30,
		"failure":20,
		"text":"睡你个头！起来high！",
		"success-text":"被闺蜜拉去KTV瞪着熊猫眼欢唱到天明……",
		"failure-text":"关掉手机假装没电，蒙头大睡到自然醒~"
	},
	{
		"dialog":"img/pk/17-",
		"success":-30,
		"failure":20,
		"text":"EXO跨年演唱会门票白送啦~不嗨到日出不散场！",
		"success-text":"EXO！！！不去对得起自己？！……",
		"failure-text":"EXO？对不起我只爱TFBOYS！~"
	},
	{
		"dialog":"img/pk/18-",
		"success":-20,
		"failure":20,
		"text":"午夜包场电影票送你，经典好片可不要错过哦~",
		"success-text":"走出影院天已亮……",
		"failure-text":"才看10分钟就全程睡着了，美容觉睡得美美哒~"
	},
	{
		"dialog":"img/pk/19-",
		"success":-20,
		"failure":10,
		"text":"哎呀~加湿器怎么坏了？只吹热风不冒水汽是什么鬼？！",
		"success-text":"就这样干巴巴的工作了一整天……",
		"failure-text":"跟隔壁桌小美讨论方案去~保湿是很重要哒~"
	},
	{
		"dialog":"img/pk/20-",
		"success":-20,
		"failure":30,
		"text":"双11整天对着电脑刷刷刷~！",
		"success-text":"今天收获颇丰！购物车清空外加二两细纹……",
		"failure-text":"提前三天买好4台加湿器摆好同时工作，嗯，今天过节了~"
	},
	{
		"dialog":"img/pk/21-",
		"success":-30,
		"failure":0,
		"text":"男神开敞篷跑车带你兜风一下午",
		"success-text":"风啊那个吹~眼啊~那个干……",
		"failure-text":"出门不抹眼霜哪好意思见男神哦？"
	},
	{
		"dialog":"img/pk/10-",
		"success":-10,
		"failure":0,
		"text":"血拼3小时，抢到绝版限量爱马仕！",
		"success-text":"今夜做梦也会笑，笑出皱纹消不掉~",
		"failure-text":"姐活在小时代，这点小事儿不在乎~"
	}
];