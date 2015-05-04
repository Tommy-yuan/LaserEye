$(function(){
	list();

	// 照片的宽高设为相等，剪切圆形
	$(".upload_photo").each(function(index, el) {
	    $(this).height($(this).width());
	    $(this).css('border-radius',$(this).width()/2);
	  });

	$(".input_cicle").height($(".input_cicle").width());
	$(".input_cicle").css('border-radius',$(".input_cicle").width()/2);

	$(".my-rank-face").height($(".my-rank-face").width());
	$(".my-rank-face").css('border-radius',$(".my-rank-face").width()/2);
	
	$(".eyeValue_cicle").height($(".eyeValue_cicle").width());
	$(".eyeValue_cicle").css('border-radius',$(".eyeValue_cicle").width()/2);

	$('#input_id').on('focus', function() {
		if ($(this).val() == '10个字以内(听说酷炫的昵称会让对手只看一眼就被吓晕呢)')
			$(this).val('');
	})
	$('#input_id').on('blur', function() {
		if ($(this).val() == '') {
			$(this).val('10个字以内(听说酷炫的昵称会让对手只看一眼就被吓晕呢)');
		}
	});

	$("#uploadImg").change(uploadPhoto);
	// $("#page4_uploadImg").change(imageOperation);
	$("#page4_repickImg").change(uploadPhoto);

	$(".adjust_confirm").click(function(){

		mySwiper.swipeTo(inputName);

		var base64String = picBeautify("#upload_img");

	    if (!base64String)
	    {
	      alert("请缩放图片充满边框");
	      // showAlert("page4_alert");
	      // return;
	    }
	    else{
	    	var target = document.getElementById('upload_photo');
		    showProgress(target);

		    base64String = base64String.split("base64,")[1];
		    console.log(base64String);
		    $.ajax({
		    	url:'http://mobilecampaign.lorealparis.com.cn/Interface/ApiForCampaign/RvEyeUploadAvatar.loreal',
		    	type:'POST',
		    	dataType:'json',
		    	data:{
		    		pictureBase64String:base64String
		    	},
		    	success:function(responseObj){
		    		if (responseObj.success) 
		    		{
		    			setMyHeadImg(responseObj.url);
		    			openId = responseObj.openId;
		    			mySwiper.swipeTo(inputName);
		    		}
		    	},
		    	error:function() {
		    		alert("上传失败");
		    	}
		    });
	    }
	    

	});

	$(".adjust_cancel").click(function(){
	   $(".adjustPage").addClass("f-dn");
	   $(".upload_photo").addClass("f-dn");

	   $("#upload_img").attr('src', '');;
	   $(".upload_txt").css("display","block");
	   $(".uploadIntro_txt").css("display","block");
	   $(".cameraBtn").removeClass("f-dn");
	});

	$(".testBtn").click(function(){

		var nickName = $("#input_id").val();
		if (nickName.length == 0) 
		{
			alert("请输入昵称");
		}
		else if (nickName.length>10) 
		{
			alert("昵称请输入10个字以内");
		}
		else{
			setMyName(nickName);
			myBirthDay = $("#year").val() + "-" + $("#month").val() + "-"+$("#day").val();
			var age = 2015 - parseInt($("#year").val());
			if (age<25) 
			{
				setMyInitScore(20);
			}
			else if (age<30)
			{
				setMyInitScore(18);
			}
			else if (age<35)
			{
				setMyInitScore(16);
			}
			else if (age<40)
			{
				setMyInitScore(14);
			}
			else{
				setMyInitScore(13);
			}

			$.ajax({
				url:'http://mobilecampaign.lorealparis.com.cn/Interface/ApiForCampaign/RvEyeSaveBaseInfo.loreal',
				type:'POST',
				dataType:'json',
				data:{
					openId:openId,
					nickname:nickName,
					birth:(new Date(myBirthDay)),
					startingScore:myScore
				},
				success:function(responseObj){
					if (responseObj.success) 
					{
						// searchOpponent();
					}
				}
			})


		}
		mySwiper.swipeTo(testScorePage);
	  // $("#input_name_page").addClass("f-dn");
	  // $("#eye_value_page").removeClass("f-dn");
	});

	$(".duelBtn").click(function(){
		searchOpponent();
	})

});


//选择生日日期
function getobj(id){  
    return document.getElementById(id);  
}  
function list(){  
    var date=new Date();  
    var le1=date.getFullYear()-1970;  
    addlist('year',1970,le1);  
    addlist('month',1,12);  
    addlist('day',1,31);  
}  
function febday(){//判断不同的情况下二月的天数，并更改日的列表项中的内容  
    var year=getobj('year').value;  
    var month=getobj('month').value;  
    var bigm=new Array('1','3','5','7','8','10','12');  
    var bigstr=bigm.join('-');  
    var smallm=new Array('4','6','9','10');  
    var smallstr=smallm.join('-');  
    if(bigstr.indexOf(month)>-1)  
        addlist('day',1,31);  
    if(smallstr.indexOf(month)>-1)  
        day(30);  
    if(month=='2'){  
        if(isRui(year)){  
            day(29);  
        }else{  
            day(28);  
        }  
    }  
}  
function day(num){//改变二月的天数  
    var list=getobj('day');  
    var listlen=list.options.length;  
    for(var i=listlen-1;i>=num;i--){  
        list.options[i]=null;  
    }  
}  
function isRui(year){//是否是闰年  
    if((year%400==0)||(year%4==0 && year/100!=0))  
        return true;  
    return false;  
}  
function addlist(obj,begin,length){//为列表项中批量添加项目  
    var list=getobj(obj);  
    for(var i=0;i<length;i++){  
        var num=i+begin;  
        list.options[i]=new Option(num,num);  
    }  
}  