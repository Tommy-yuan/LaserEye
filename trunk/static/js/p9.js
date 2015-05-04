// function loadMoreRank(){
//   	var url = 'js/rank.ejs';
//     var dialog_dom = new EJS({
//       url: url
//     }).render({
//       'data':
//     });
//     $(".rankContainer").append(dialog_dom);
// }


function checkRank(){
    $(".game-result").css('display', 'none');
    $(".shareSuccess").css('display','none');
    var rankArray = [];
    $.ajax({
        url:'http://mobilecampaign.lorealparis.com.cn/Interface/ApiForCampaign/RvEyeGetsRankingList.loreal',
        type:'POST',
        dataType:'json',
        success:function(responseObj){
            if (responseObj.success) 
            {
              rankArray = responseObj.message;
              var url = 'js/rank.ejs';
              var dialog_dom = new EJS({
                url: url
              }).render({
                'data':rankArray
              });
              $(".rankContainer").append(dialog_dom);
              mySwiper.swipeTo(rankPage);
            }
        },
        error:function(errorObj){
          alert('网络错误');
          mySwiper.swipeTo(rankPage);
        }
    });
}