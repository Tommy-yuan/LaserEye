
var transform;//记录图像缩放的信息，图像合成时需要
var isFix = false;
var imgRotation=0;
var exif;

var uploadPhoto = function(e){
	isFix = false;
	imgRotation = 0;
	transform = 0;
	exif = null;
	// showProgress(document.getElementById('upload_photo'));
 	$("#upload_photo").find("img").attr("src","");
 	var fileObj = this;

 	

	loadImage(
          e.target.files[0],
          function (img) {
              // console.log(img.toDataURL());
              $("#upload_photo").find("img").attr("src",img.toDataURL());
              $(".uploadProfile").css("display","none");
              
          },
          {maxWidth: 1280,
           canvas:true
          } // Options
      );

	$("#upload_img").load(function(){
		var allowExtention=".jpg,.bmp,.gif,.png";//允许上传文件的后缀名
			    var extention=fileObj.value.substring(fileObj.value.lastIndexOf(".")+1).toLowerCase();
			    if(allowExtention.indexOf(extention)>-1)
			    {
			        if(window.FileReader&&fileObj.files[0])
			        {
			            file = fileObj.files[0];
			            	var reader = new FileReader();
			                reader.onload = function(e){
				                 var buffer = new Uint8Array(reader.result);
				                  var oFile = new BinaryFile(buffer);
							     var oEXIF = EXIF.readFromBinaryFile(oFile);
							     console.log(oEXIF);
							     exif = oEXIF;
							     imgRotation = 0;
							    var orientation = exif ? exif.Orientation : 1;
								switch(orientation) 
								{
								    case 3:
								        imgRotation = 180;
								        break;
								    case 6:
								        imgRotation = 90;
								        break;
								    case 8:
								        imgRotation = 270;
								        break;
								}
								imgEventInit(".adjust_frame","#upload_img");
								console.log("rotation = " + imgRotation);
								 return e.target.result;
			            }
						reader.readAsArrayBuffer(file);
			        }
			        else
			        {
			        	imgEventInit(".adjust_frame","#upload_img");
			        }
			    }
			    else
			    {
			    	// imgEventInit(".page4_uploadBorder","#page4_photo");
			    }
              setTimeout(imgEventInit(".upload_photo","#upload_img"),2000);
              // stopProgress();
              $(".upload_txt").css("display","none");
              $(".uploadIntro_txt").css("display","none");
              $(".cameraBtn").addClass("f-dn");
              $(".adjustPage").removeClass("f-dn");

	})
	// loadImage.parseMetaData(
	// 	this.files[0],
	// 	function(data){
	// 		orientation = data.exif[0x0112];
	// 		console.log("orientation = " + orientation);
	// 		imgRotation = 0;
 //            switch(orientation) 
 //            {
 //                case 3:
 //                    imgRotation = 180;
 //                    break;
 //                case 6:
 //                    imgRotation = 90;
 //                    break;
 //                case 8:
 //                    imgRotation = 270;
 //                    break;
 //        	}

	// 	}
	// )
}






//处理图片移动缩放
function imgEventInit(divId,imgId){
    var reqAnimationFrame = (function () {
        return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    //配置
    var content = $(divId);
    console.log(content);
    var photo = $(imgId);
    var hammer = new Hammer(content[0]);
    var el = photo[0];
    var scaleX,scaleY;
    if (photo.width()>photo.height())
	{	
		scaleX = content.width()/photo.height();
		scaleY = content.height()/photo.width();
	}
	else{
		scaleX = content.width()/photo.width();
     	scaleY = content.height()/photo.height();
	}
    
    var scaleInit =  scaleX>scaleY?scaleX:scaleY;
    // var scaleInit = 1;
    // scaleInit = scaleInit.toFixed(2)*1.05;//精度问题。。会导致bug
    var START_X = (scaleInit-1)*photo.width()/2+(content.width()/2-scaleInit*photo.width()/2);
    var START_Y = (scaleInit-1)*photo.height()/2+(content.height()/2-scaleInit*photo.height()/2);
    // var START_X = -(photo.width()-content.width())/2;
    // var START_X = 0,
    // 	START_Y = 0;
    // console.log("scaleX= "+scaleX+" scaleY= "+scaleY);
    // console.log("START_X= "+START_X+" START_Y= "+START_Y);
    // console.log("content: width= "+content.width()+" height= "+content.height());
    // // alert("photo: width= "+photo.width()+" height= "+photo.height());
    // console.log("scaleInit= "+scaleInit);

    var ticking = false;
    hammer.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    hammer.add(new Hammer.Swipe()).recognizeWith(hammer.get('pan'));
    hammer.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(hammer.get('pan'));
    hammer.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([hammer.get('pan'), hammer.get('rotate')]);
    hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
    hammer.add(new Hammer.Tap());

    hammer.on("panstart panmove", onPan);
    hammer.on("panend",function(){
        START_X = transform.translate.x;
        START_Y = transform.translate.y;
    });
    hammer.on("rotatestart rotatemove", onRotate);
    hammer.on("pinchstart pinchmove", onPinch);
    hammer.on("swipe", onSwipe);
    hammer.on("tap", onTap);
    hammer.on("doubletap", onDoubleTap);

    resetElement();


    function resetElement() {
        transform = {
            translate: { x: START_X, y: START_Y },
            scale: scaleInit,
            angle: imgRotation,
            rx: 0,
            ry: 0,
            rz: 0
        };
        requestElementUpdate();

    }

    function onPan(ev) {
        transform.translate = {
            x: START_X + ev.deltaX,
            y: START_Y + ev.deltaY
        };
        requestElementUpdate();
    }

    var initScale = 1;
    function onPinch(ev) {

        if(ev.type == 'pinchstart') {
            initScale = transform.scale || 1;
        }
        transform.scale = initScale * ev.scale;
        requestElementUpdate();
    }

    var initAngle = 0;
    function onRotate(ev) {
        if(ev.type == 'rotatestart') {
            initAngle = transform.angle || 0;
        }
        transform.rz = 0;
        transform.angle = initAngle + ev.rotation;
        requestElementUpdate();
    }

    function onSwipe(ev) {
        var angle = 0;
        transform.ry = (ev.direction & Hammer.DIRECTION_HORIZONTAL) ? 1 : 0;
        transform.rx = (ev.direction & Hammer.DIRECTION_VERTICAL) ? 1 : 0;
        transform.angle = (ev.direction & (Hammer.DIRECTION_RIGHT | Hammer.DIRECTION_UP)) ? angle : -angle;
        requestElementUpdate();
    }

    function onTap(ev) {

        requestElementUpdate();
    }

    function onDoubleTap(ev) {

        requestElementUpdate();
    }

    function updateElementTransform() {
		el.style.webkitTransform = "";
        el.style.mozTransform = "";
        el.style.transform = "";
        var value = [
                'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
                'scale(' + transform.scale + ', ' + transform.scale + ')',
                'rotate('+transform.angle + 'deg)'
        ];
        value = value.join(" ");
        el.style.webkitTransform = value;
        el.style.mozTransform = value;
        el.style.transform = value;
        ticking = false;
    }

    function requestElementUpdate() {
        if(!ticking) {
            reqAnimationFrame(updateElementTransform);
            ticking = true;
        }
    }
    resetElement();
}

//图片旋转合成
function picBeautify(imgId){
	console.log("图片开始剪切，DATE:"+new Date());

	var img = $(imgId)[0];
	var shieldW = $(".upload_photo").width();
	var shieldH = $(".upload_photo").height();
	var content = {
		width:shieldW,
		height:shieldH
	};
	var canvas = document.createElement("canvas");
	//必须要设置。css无法控制画布高宽
	canvas.width = content.width;
	canvas.height = content.height;
	var context2D = canvas.getContext("2d");
	var w= canvas.width;
	var h = canvas.height;
	context2D.clearRect(0,0,w,h);
	var ps = transform.scale;
	var pw = img.width;
	var ph = img.height;
	var px = transform.translate.x-pw*(ps-1)/2;
	var py = transform.translate.y-ph*(ps-1)/2;
	var dx = px*(w/content.width);
	var dy = py*(h/content.height);
	var dw = pw*(w/content.width)*ps;
	var dh = ph*(h/content.height)*ps;
	var rad = transform.angle*Math.PI/180;
	context2D.translate(dx+dw/2,dy+dh/2)
	context2D.rotate(rad);
	context2D.drawImage(img,0,0,pw,ph,dx-(dx+dw/2),dy-(dy+dh/2),dw,dh);
	context2D.rotate(-rad);
	context2D.translate(-dx-dw/2,-dy-dh/2);

	console.log("begin，DATE:"+new Date());

	var imgData = context2D.getImageData(0,0,canvas.width,canvas.height);
    var data = imgData.data,
    isEmpty = false;
    for(var i =0,len = data.length; i<len;i+=4){
        var red = data[i],
            green = data[i+1],
            blue = data[i+2],
            alpha = data[i+3];
        if (red==0&&green==0&&blue==0&&alpha==0)
        {
        	isEmpty = true;
        	break;
        }
    }
	return isEmpty?false:canvas.toDataURL("image/png");

}