var pageLocalStorage = window.localStorage;
var productReviewPage = {
    scroll: null,
    userId: pageLocalStorage.getItem("userid"),
    pageSize: 9,
    pageNum1: 1,
    totalNum1: 0,
    showMask: function (theme, msg) {
        $.mobile.showPageLoadingMsg(theme, msg);
        $(".maskDiv").css("display", "block");
    },
    hideMask: function (theme, msg) {
        $.mobile.hidePageLoadingMsg(theme, msg);
        $(".maskDiv").css("display", "none");
    },
    init: function () {
        $("#listContentDiv_switch1_content").css("height", $(document.body).height() + "px");
        productReviewPage.getEvectionInfo(productReviewPage.pageNum1, false);
    },
    getEvectionInfo: function (page, isMore) {
        var prodId = pageLocalStorage.getItem("proddetailId");
        productReviewPage.showMask("c", "正在加载...");
        $.M.get({
            method: "/review/reviewList.jhtml?productId=" + prodId + "&pageNumber=" + page + "&pageSize=" + productReviewPage.pageSize,
            success: function (data) {
                productReviewPage.hideMask("c", "正在加载...");
                var reviewstr = '';
                productReviewPage.totalNum1 = Math.ceil(parseInt(data.returnValue.total) / parseInt(productReviewPage.pageSize));
                $.each(data.returnValue.reviews, function (i, info) {
                    var reviewDate = new Date(info.reviewDate);
                    var year = reviewDate.getFullYear();
                    var month = reviewDate.getMonth() < 10 ? "0" + reviewDate.getMonth() : reviewDate.getMonth();
                    var day = reviewDate.getDay() < 10 ? "0" + reviewDate.getDay() : reviewDate.getDay();
                    reviewstr += '<div class="evaluateItem">';
                    reviewstr += '<div class="personImg"><img src="../css/images/products/user_unselected.png" /></div>';
                    reviewstr += '<div class="evaluateContent">';
                    reviewstr += '<div class="upPerson">';
                    reviewstr += '<div class="personName">' + info.username + '</div>';
                    reviewstr += '<div class="evaluateDate">' + (year + "-" + month + "-" + day) + '</div>';
                    reviewstr += '</div>';
                    reviewstr += '<div class="evaluatedetail">' + info.content + '</div>';
                    reviewstr += '</div> </div>';
                });
                
                if (isMore == false) {
                    $("#prodEvaluate").html(reviewstr);
                    $("#pullDown1").css("display", "none");

                } else {
                    $("#prodEvaluate").append(reviewstr);
                    $("#pullDown1").css("display", "none");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                productReviewPage.hideMask("c", "正在加载...");
            }
        });
    },
    pullDownAction1: function () {
        productReviewPage.pageNum1 = 1;
        productReviewPage.getEvectionInfo(1, false);
    },
    pullUpAction1: function () {
        pullUpEl1 = document.getElementById('pullUp1');
        pullUpOffset1 = pullUpEl1.offsetHeight;
        setTimeout(function () {
            if ((productReviewPage.totalNum1) > (productReviewPage.pageNum1)) {
                productReviewPage.pageNum1 += 1;
                productReviewPage.getEvectionInfo(productReviewPage.pageNum1, true);
            } else {
                pullUpEl1.className = '';
                pullUpEl1.querySelector('.pullUpLabel1').innerHTML = '所有记录加载完毕';
            }
            myScroll1.refresh();
        }, 1000);
    },
    loaded1: function () {
        pullUpEl1 = document.getElementById('pullUp1');
        pullDownEl = document.getElementById('pullDown1');
        pullUpOffset1 = pullUpEl1.offsetHeight;
        myScroll1 = new iScroll('listContentDiv_switch1_content', {
            checkDOMChanges: true,
            hScrollbar: false,
            vScrollbar: false,
            useTransition: true,
            onRefresh: function () {
                if (pullUpEl1.className.match('loading')) {
                    pullUpEl1.className = '';
                    pullUpEl1.style.display = 'block';
                    pullUpEl1.querySelector('.pullUpLabel1').innerHTML = '上拉加载更多...';
                }
            },
            onScrollMove: function () {
                if (this.y < (this.maxScrollY - 20) && !pullUpEl1.className.match('flip')) {
                    pullUpEl1.className = 'flip';
                    pullUpEl1.style.display = 'block';
                    pullUpEl1.querySelector('.pullUpLabel1').innerHTML = '松手开始更新...';
                    this.maxScrollY = this.maxScrollY;
                } else if (this.y > (this.maxScrollY + 5) && pullUpEl1.className.match('flip')) {
                    pullUpEl1.className = '';
                    pullUpEl1.style.display = 'block';
                    pullUpEl1.querySelector('.pullUpLabel1').innerHTML = '上拉加载更多...';
                    this.maxScrollY = pullUpOffset1;
                } else if (this.y > 1 && !pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'flip';
                    pullDownEl.querySelector('.pullDownLabel1').innerHTML = "刷新...";
                    pullDownEl.style.display = 'block';
                    this.minScrollY = 0;
                } else if (this.y < 1 && pullDownEl.className.match('flip')) {
                    pullDownEl.className = '';
                    pullDownEl.querySelector('.pullDownLabel1').innerHTML = "下拉刷新";
                    this.minScrollY = -pullDownOffset1;
                }
            },
            onScrollEnd: function () {
                if (pullUpEl1.className.match('flip')) {
                    pullUpEl1.className = 'loading';
                    pullUpEl1.style.display = 'block';
                    pullUpEl1.querySelector('.pullUpLabel1').innerHTML = '加载中...';
                    productReviewPage.pullUpAction1();
                } else if (pullDownEl.className.match('flip')) {
                    pullDownEl.className = 'loading';
                    pullDownEl.style.display = 'block';
                    pullDownEl.querySelector('.pullDownLabel1').innerHTML = "正在加载...";
                    productReviewPage.pullDownAction1();
                }

            }
        });
        setTimeout(function () { document.getElementById('listContentDiv_switch1_content').style.left = '0'; }, 800);
    },
    showMessges: function (messges) {
        $(".errorLabel").html(messges);
        $(".errorDiv").css("visibility", "visible");
        setTimeout('$(".errorDiv").css("visibility", "hidden")', 3000);
    },
    back: function () {
        window.location.href = "../products/productdetail.html";
    }
};

$(document).bind("pageshow", function (e) {
    var id = e.target.id;
    if ("product_ReviewPage" == id) {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        if (!productReviewPage.scroll) {
            productReviewPage.scroll = new iScroll("contentList", {
                useTransition: true,
                checkDOMChanges: true,
                hScrollbar: false,
                vScrollbar: false
            });
        }
        productReviewPage.init();
    }
});
