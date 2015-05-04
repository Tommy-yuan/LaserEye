
var homePage = 1,
    selectHeadImg = 2,
    inputName = 3,
    testScorePage = 4,
    searchPage = 5,
    pkPage = 6,
    rankPage = 7;


function loadimg(pics, progressCallBack, completeCallback) {
    $(".loading_page").find(".animated").removeClass("f-dn");
    var index = 0;
    var len = pics.length;
    var img = new Image();
    var load = function () {
        img.src = pics[index];
        img.onload = function () {
            // 控制台显示加载图片信息
            // console.log('第' + index + '个img被预加载', img.src);
            progressCallBack(Math.floor(((index + 1) / len) * 100) + "%");
            
            i = index;
            index++;
            
            if (index < len) {
                load();
            } else {
                completeCallback()
            }
        }
        return img;
    }
    if (len > 0) {
        load();
    } else {
        completeCallback();
    }
    return {
        pics:pics,
        load:load,
        progress:progressCallBack,
        complete:completeCallback
    };
}

$(function(){

    $(".g-doc").height($(window).height());
	var w = $(window).width();
	if (w < 640) {
		$("body").css("font-size", Math.round(16 * (w / 640.0)) + "px");
	}
 
    wx_config();

	$(".g-ct").height($(window).height());
    $(".g-ct").each(function(){
        $(this).removeClass('f-dn');
    })
	mySwiper =  new Swiper('.swiper-container',{
		speed: 0,
		mode:'vertical',
		noSwiping : true,
		followFinger: false,
		loop: false,
		onInit: function(a) {
			
		},
		onSlideChangeStart: function(a) {
			switch(a.activeIndex){
				case 1:
					p1.Init();
					break;
			}
		},
		onSlideChangeEnd: function(a){
		}        
	});
	
    var pics = Array();
  
    $(document).find("div").each(function(e){
        
        if ($(this).css('background-image') != 'none') 
        {
            var url = $(this).css('background-image'),
                pic = url.substring(4,url.length-1);
            pics.push(pic + "?" + e);
        }
    });



    loadimg(pics,function(p){
        console.log("pics:"+pics);
        var per = parseInt(w);
        //console.log(per);
        $(".load-count").html(p);
    },function(){
        //poster初始化
      mySwiper.swipeTo(1)

    });
   // document.onreadystatechange = function () {
	  //  if(document.readyState=="complete"){
		 //   // mySwiper.swipeTo(1);
   //         // searchOpponent();
   //         // checkRank();
	  //  }
   // }

   
});
var mySwiper;

var openId = 0,
    myName='',
    myBirthDay='1970-1-1',
    myHeadImg,
    lotteryId; //test

var myScore=0,
    pkScore = 0;



/*  微信分享 */
function wx_config(){
    $.ajax({
      url:'http://mobilecampaign.lorealparis.com.cn/Interface/WeiXinOAuth/Signature.loreal?Url='+location.href, //待修改
      type:'get',
      dataType:'json',
      success:function(responseObj){
          console.log(responseObj);
          if (responseObj.success)
          {
            var timestamp = responseObj.message.timestamp,
                nonceStr = responseObj.message.nonceStr,
                appId = responseObj.message.AppKey,
                signature = responseObj.message.signature;

            wx.config({
                debug: true,
                appId:appId,
                timestamp:timestamp,
                nonceStr: nonceStr,
                signature:signature,
                jsApiList: [
                  'onMenuShareTimeline',
                  'onMenuShareAppMessage'
                ]
              });
            wx.ready(function(){
                wx_share();
              
            });
          }
          else{
            // alert("网络错误, 请刷新页面");
          }
      },
      error:function(errorObj){
          // alert("网络错误, 请刷新页面");
      }
    });
}

function wx_share(count){
    var imgUrl="http://mobilecampaign.lorealparis.com.cn/RVLaserEye/img/shareicon.jpg";
//分享给朋友
  var shareUrl =  window.location.href;
  var mobileCount = count?count:0;
  // var shareIcon = shareUrl.lastIndexOf("/").substring(0,lastIndex)+"/img/shareicon.jpg";
  var shareText = '15秒用眼虐翻了'+mobileCount+'名挑战者，我的双眼美出新高度！';
  wx.onMenuShareAppMessage({
        title: shareText, // 分享标题
        desc: '', // 分享描述
        link: shareUrl, // 分享链接
        imgUrl:imgUrl , // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
            checkPrize();
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
    });
    //分享给朋友圈
    wx.onMenuShareTimeline({
        title: shareText, // 分享标题
        link: shareUrl, // 分享链接
        imgUrl:imgUrl, // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
    });
}

function shareMyScore(count){
    var finalScore = pkScore + 20;
    $(".shareSuccess-score").html(finalScore);
    checkPrize();
    $(".game-share").css('display','block');
    wx_share(count);

}



//判断是否中奖
var lottory = false;
function checkPrize(){
    //test
    // var prize = Math.round(Math.random()*2);

    var prize = false;
    $.ajax({
        url:'http://mobilecampaign.lorealparis.com.cn/Interface/ApiForCampaign/RvEyeLottery.loreal', //是否中奖
        type:'POST',
        dataType:'json',
        data:{
            openId:openId
        },
        success:function(responseObj){
            if (responseObj.success) 
            {
                prize = responseObj.isWinner;
                lotteryId = responseObj.lotteryId;

                if (prize) 
                {
                    //中奖了
                    lottory = true;
                    $(".shareSuccessImg").attr('src','img/shareSuccessBg.png');

                }
                else
                {
                    $(".shareSuccessImg").attr('src','img/shareSuccessBg-fail.png');
                }

                $(".shareSuccess").css('display','block');
                $(".game-result").css('display','none');

            }
        }
    });

    //test
    // if (prize) 
    // {
    //     //中奖了
    //     lottory = true;
    //     $(".shareSuccessImg").attr('src','img/shareSuccessBg.png');
    // }
    // else
    // {
    //     $(".shareSuccessImg").attr('src','img/shareSuccessBg-fail.png');
    // }

    // $(".shareSuccess").css('display','block');
    // $(".game-result").css('display','none');
}



//init score
function setMyName(name){
    $(".pk-top-name").html(name);
    $(".pk-name").html(name);
    $(".result-name").html(name);
    $(".my-rank-name").html(name);
    myName = name;
}

function setMyInitScore(score){
    $(".my-rank-score").html(score);
    $(".pk-me-score").html(score);
    $("#pk-init-socre").html(score);
    $(".eyeValue_score0").html(score);
    myScore = score;
}

function setOppInitScore(score){
    $(".pk-opponent-score").html(score);
}


function searchOpponent(){
    mySwiper.swipeTo(searchPage);
    horizonalAnima($(".load-product"),$(".load-product").width(),30,function(){
        beginPK();
    });
}

function setMyHeadImg(img){
    myHeadimg = img;
    $(".result-me").find($(".result-headimg")).find('img').attr('src',img);
    $(".pk-me").find($(".pk-headimg")).find('img').attr('src',img);
    $(".my-rank-face").find('img').attr('src',img);
    $(".input_cicle").find('img').attr('src',img);
    $(".eyeValue_cicle").find('img').attr('src',img);
}


function horizonalAnima(jqObj,width,milsec,cb)
{
    var parentDiv = jqObj,
        innerDiv = parentDiv.find('div').eq(0),
        w = width;
    innerDiv.css('width', "0");
    innerDiv.find('img').eq(0).css('width',w);
    
    var flashWidth = 0;
    setTimeout(function(){
        var flashAnima = setInterval(function(){
            innerDiv.css('width', flashWidth+"%");
            flashWidth+=1;
            if (flashWidth>100) 
            {
                clearInterval(flashAnima);
                if (cb) 
                {
                    cb();
                };
            };
        },milsec);
    },2000);
}


var spinner;
function showProgress(target){
    var opts = {
        lines: 9, // The number of lines to draw
        length: 13, // The length of each line
        width: 8, // The line thickness
        radius: 11, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#FF5585', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        // top: '50%', // Top position relative to parent
        // left: '50%' // Left position relative to parent
      };
    spinner = new Spinner(opts).spin(target);
}

function stopProgress(){
  if (spinner) 
  {
    spinner.stop();
  }   
}





