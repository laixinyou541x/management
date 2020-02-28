// 为了是插件内部代码不影响外部文件，那么我们需要封闭作用域

(function () {

    // 封装翻页对象
    function TurnPage(options, wrap){
        this.wrap = wrap || $('body');
        this.curPage = options.curPage || 1;
        this.totalPage = options.totalPage || 1;
        this.changeCb = options.changeCb || function () {};
        this.init = function(){
            this.fillHTML();
            this.initStyle();
            this.bindEvent();
        }
    }
    TurnPage.prototype.fillHTML = function(){
        var oUl = $('<ul class="my-turn-page"></ul>');

        // 当前页大于第一页 出现上一页的按钮
        if(this.curPage > 1){
            $('<li class="prev">上一页</li>').appendTo(oUl);
        }
        // 添加第一页按钮
        $('<li class="num">1</li>').appendTo(oUl).addClass(this.curPage === 1 ? 'current' : '');
        // 添加前面的省略号
        if(this.curPage - 2 > 2){
            $('<span>...</span>').appendTo(oUl);
        }
        // 中间5页
        for(var i = this.curPage - 2; i <= this.curPage + 2; i++){
            if(i > 1 && i < this.totalPage){
                $('<li class="num"></li>').text(i)
                            .appendTo(oUl)
                            .addClass(i == this.curPage ? 'current' : '');
            }
        }
        // 添加后面的省略号
        if(this.curPage + 2 < this.totalPage - 1){
            $('<span>...</span>').appendTo(oUl);
        }
        // 添加最后一页
        if(this.totalPage > 1){
            $('<li class="num"></li>').text(this.totalPage)
            .appendTo(oUl)
            .addClass(this.curPage === this.totalPage ? 'current' : '');
        }
       
        // 添加下一页
        if(this.curPage < this.totalPage){
            $('<li class="next">下一页</li>').appendTo(oUl);
        }
        this.wrap.empty().append(oUl);
    }

    TurnPage.prototype.initStyle = function(){
        $('.my-turn-page', this.wrap).find('*').css({
            padding:0,
            margin:0,
        }).end().find('li').css({
            display:'inline-block',
            listStyle:'none',
            padding: '5px 10px',
            border: '1px solid #eee',
            margin : '0 5px',
            color: '#333',
            cursor: 'pointer'
        }).filter('.current').css({
            backgroundColor: '#428bca',
            color:'aliceblue'
        })
    }

    TurnPage.prototype.bindEvent = function(){
        var self = this;
        // console.log(self);
        $(this.wrap).off('click').on('click', 'ul > li', function(){
            // 判断当前点击的是上一页的按钮
            // console.log(this);
            if($(this).hasClass('prev')){
                self.curPage--;
            }else if($(this).hasClass('next')){
                // console.log(1);
                self.curPage ++;
               
            }else if($(this).hasClass('num')){
                self.curPage = parseInt($(this).text());
            }
            self.fillHTML();
            self.initStyle();
            self.changeCb(self.curPage);
        })
    }    
    $.fn.extend({
        page: function(options){
           var obj = new TurnPage(options, this);
           obj.init();
           return this;
        }
    })
} ())