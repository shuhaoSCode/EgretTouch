var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// TypeScript file
var core;
(function (core) {
    var component;
    (function (component) {
        var ImageViewpager = (function (_super) {
            __extends(ImageViewpager, _super);
            /**
             * 游戏滑动选择器
             * @param 控件大小  {eui.Group} 需要toast的对象
             * @param 图片间距      {string}    toast文字
             * @param 图片地址  {number}    toast显示时间 默认1.5秒
             * @param 监听器    {number}    toastY轴的位置，默认当前view的百分之70高度
             */
            function ImageViewpager(size, imgWidth, split, imgResList) {
                var _this = _super.call(this) || this;
                //设置大小
                _this.width = size.x;
                _this.height = size.y;
                //初始化参数
                _this._split = split;
                _this._imgResList = imgResList;
                _this._imgWidth = imgWidth;
                _this._imgList = new Array();
                _this._imgMoveBeforeX = new Array();
                _this._initViewPager();
                return _this;
            }
            //初始化viewPager
            ImageViewpager.prototype._initViewPager = function () {
                var _loop_1 = function (i) {
                    //渲染图片
                    var imageItem = new eui.Image;
                    this_1._imgList.push(imageItem);
                    imageItem.source = this_1._imgResList[i];
                    imageItem.width = this_1._imgWidth;
                    imageItem.height = this_1.height;
                    imageItem.verticalCenter = 0;
                    imageItem.touchEnabled = true;
                    //如果是第一张图片，居中显示
                    if (i == 0) {
                        imageItem.x = (this_1.width - this_1._imgWidth) / 2;
                    }
                    else {
                        imageItem.x = this_1._imgList[0].x + (i * (this_1._imgWidth + this_1._split));
                    }
                    this_1.addChild(imageItem);
                    this_1._imgMoveBeforeX.push(imageItem.x);
                    //设置滑动监听器
                    imageItem.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) {
                        //当前选中的item
                        this._touchItem = imageItem;
                        //设置偏移量
                        this.offsetItemX = e.stageX - imageItem.x;
                        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onItemgMove, this);
                        console.log("begin");
                    }, this_1);
                    //滑动结束监听
                    imageItem.addEventListener(egret.TouchEvent.TOUCH_END, function (e) {
                        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onItemgMove, this);
                        console.log("end");
                        for (var i_1 = 0; i_1 < this._imgList.length; i_1++) {
                        }
                    }, this_1);
                };
                var this_1 = this;
                for (var i = 0; i < this._imgResList.length; i++) {
                    _loop_1(i);
                }
            };
            ImageViewpager.prototype.onItemgMove = function (e) {
                //当前选中item的下标
                var index = this._getIndex(this._touchItem);
                this._imgList[index].x = e.stageX - this.offsetItemX;
                for (var i = 0; i < this._imgResList.length; i++) {
                    var num = i - index;
                    if (num > 0) {
                        this._imgList[i].x = e.stageX - this.offsetItemX + (num * (this._imgWidth + this._split));
                    }
                    else if (num < 0) {
                        this._imgList[i].x = e.stageX - this.offsetItemX - (Math.abs(num) * (this._imgWidth + this._split));
                    }
                }
            };
            //获取当前下标
            ImageViewpager.prototype._getIndex = function (img) {
                for (var i = 0; i < this._imgList.length; i++) {
                    if (this._imgList[i] == img) {
                        return i;
                    }
                }
            };
            return ImageViewpager;
        }(eui.Component));
        component.ImageViewpager = ImageViewpager;
        __reflect(ImageViewpager.prototype, "core.component.ImageViewpager");
    })(component = core.component || (core.component = {}));
})(core || (core = {}));
//# sourceMappingURL=GameTouch.js.map