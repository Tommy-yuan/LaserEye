var p1 = {
	Init:function(){
		console.log('a');
		$('#slide1 .fight-left').addClass('bounceInLeft');
		$('#slide1 .fight-right').addClass('bounceInRight');
		$('#slide1 .left-face').addClass('fadeInLeft animatedLong');
		$('#slide1 .right-face').addClass('fadeInRight animatedLong');
		$('#slide1 .begin-fight').addClass('bounceInLeft animatedLong1');
		
		$('#slide1 .layer0').addClass('fadeIn animatedLong3');
		$('#slide1 .layer1').addClass('fadeIn animatedLong3');
		$('#slide1 .btm-product').addClass('bounceInUp animatedLong');
	}
}

$(function(){
	$(".fight-right").click(function(){
		mySwiper.swipeTo(2);
	});
});
