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
            function ImageViewpager(size, imgWidth, split, imgResList, ipl) {
                var _this = _super.call(this) || this;
                //设置大小
                _this.width = size.x;
                _this.height = size.y;
                //初始化参数
                _this._split = split;
                _this._imgResList = imgResList;
                _this._imgWidth = imgWidth;
                _this._indexItem = 0;
                _this._isMove = false;
                _this._ipl = ipl;
                _this._imgList = new Array();
                _this._imgMoveBeforeX = new Array();
                //初始化页面
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
                    //如果是第一张图片，居中显示。最后一张显示左边
                    if (i == 0) {
                        imageItem.x = (this_1.width - this_1._imgWidth) / 2;
                    }
                    if (i == this_1._imgResList.length - 1) {
                        imageItem.x = this_1._imgList[0].x - (this_1._imgWidth + this_1._split);
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
                        this._offsetItemX = e.stageX - imageItem.x;
                        //保存当前item下标
                        this._indexTouchItem = this._getIndex(imageItem);
                        //设置移动监听器
                        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onItemMove, this);
                        console.log("begin");
                    }, this_1);
                    //滑动结束监听
                    imageItem.addEventListener(egret.TouchEvent.TOUCH_END, function (e) {
                        //取消监听器
                        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onItemMove, this);
                        console.log("end");
                        //设置监听&&判断是否出发onM
                        if (this._isMove) {
                            this._ipl.selectIndex(this._indexItem);
                            //图片位置调整
                            for (var i_1 = 0; i_1 < this._imgList.length; i_1++) {
                                var item = this._imgList[i_1];
                                GCAnimation.translateAnimation(item, 200, { x: item.x + (this.width / 2 - this._imgList[this._indexItem].x - this._imgWidth / 2), y: item.y });
                            }
                        }
                        else {
                            if (this._indexTouchItem == this._indexItem) {
                                this._ipl.clickIndex(this._indexItem);
                            }
                            else {
                                console.log(this._indexTouchItem);
                                // for (let i = 0; i < this._imgList.length; i++) {
                                //     let item = this._imgList[i];
                                //     GCAnimation.translateAnimation(item, 200, { x: item.x + (this.width / 2 - this._imgList[this._indexTouchItem].x - this._imgWidth / 2), y: item.y });
                                //     this._indexItem = this._indexTouchItem;
                                //     this.updateIndex();
                                //     GCFilter.halo(this._imgList[this._indexTouchItem]);
                                // }
                                this._ipl.clickIndex(this._indexTouchItem);
                            }
                        }
                        this._isMove = false;
                    }, this_1);
                };
                var this_1 = this;
                for (var i = 0; i < this._imgResList.length; i++) {
                    _loop_1(i);
                }
            };
            //移动时执行
            ImageViewpager.prototype.onItemMove = function (e) {
                this._isMove = true;
                //当前选中item的下标
                var index = this._indexTouchItem;
                //设置偏移量
                this._imgList[index].x = e.stageX - this._offsetItemX;
                for (var i = 0; i < this._imgResList.length; i++) {
                    var num = i - index;
                    if (num > 0) {
                        this._imgList[i].x = e.stageX - this._offsetItemX + (num * (this._imgWidth + this._split));
                    }
                    else if (num < 0) {
                        this._imgList[i].x = e.stageX - this._offsetItemX - (Math.abs(num) * (this._imgWidth + this._split));
                    }
                }
                this.updateIndex();
                this.updateIndex();
                GCFilter.halo(this._imgList[this._indexItem]);
                console.log("onMove");
            };
            //获取当前下标
            ImageViewpager.prototype._getIndex = function (img) {
                for (var i = 0; i < this._imgList.length; i++) {
                    if (this._imgList[i] == img) {
                        return i;
                    }
                }
            };
            //更新当前和x中心点最近的下标
            ImageViewpager.prototype.updateIndex = function () {
                //判断和x中点最近的item下标
                for (var i = 0; i < this._imgList.length; i++) {
                    if (Math.abs(this._imgList[i].x + this._imgWidth / 2 - this.width / 2) < Math.abs(this._imgList[this._indexItem].x + this._imgWidth / 2 - this.width / 2)) {
                        this._indexItem = i;
                    }
                    GCFilter.unHalo(this._imgList[i]);
                }
                //-----------无线循环------------(可以优化 )
                //计算左右两边item的下标
                var indLeft = this._indexItem - 1;
                if (indLeft < 0) {
                    indLeft = indLeft + this._imgList.length;
                }
                var indRight = this._indexItem + 1;
                if (indRight > this._imgList.length - 1) {
                    indRight = indRight - this._imgList.length;
                }
                //当前命中item
                var item = this._imgList[this._indexItem];
                //设置左右两边item的位置
                var leftSky = this._imgList[indLeft];
                var rightSky = this._imgList[indRight];
                leftSky.x = item.x - (leftSky.width + this._split);
                rightSky.x = item.x + (rightSky.width + this._split);
            };
            ;
            return ImageViewpager;
        }(eui.Component));
        component.ImageViewpager = ImageViewpager;
        __reflect(ImageViewpager.prototype, "core.component.ImageViewpager");
    })(component = core.component || (core.component = {}));
})(core || (core = {}));
// TypeScript file
var GCFilter;
(function (GCFilter) {
    /**
     * 光晕
     * @param view {egret.DisplayObject} 添加光晕的对象
     * @param color? {number} 光晕颜色（默认蓝色）
     * @param alpha? {number} 透明度 (默认0.8)
     */
    function halo(view, color, alpha) {
        var colorGC = 0x33CCFF; /// 光晕的颜色，十六进制，不包含透明度
        if (color != undefined) {
            colorGC = color;
        }
        var alphaGC = 0.2; /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
        if (alphaGC != undefined) {
            alphaGC = alpha;
        }
        var blurX = 55; /// 水平模糊量。有效值为 0 到 255.0（浮点）
        var blurY = 35; /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        var strength = 2; /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        var quality = 3 /* HIGH */; /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
        var inner = false; /// 指定发光是否为内侧发光，暂未实现
        var knockout = false; /// 指定对象是否具有挖空效果，暂未实现
        var glowFilter = new egret.GlowFilter(colorGC, alphaGC, blurX, blurY, strength, quality, inner, knockout);
        view.filters = [glowFilter];
    }
    GCFilter.halo = halo;
    /**
     * 取消光晕
     * @param view {egret.DisplayObject} （取消光晕的对象)
     */
    function unHalo(view) {
        view.filters = undefined;
    }
    GCFilter.unHalo = unHalo;
})(GCFilter || (GCFilter = {}));
//動畫封裝
var GCAnimation;
(function (GCAnimation) {
    /**
     * 平移动画
     * @param view {egret.DisplayObject} 对象的属性集合
     * @param duration {number} 持续时间
     * @param end {GCUtils.attributes.GCPrint} 动画停止位置
     * @param start? {GCUtils.attributes.GCPront} 动画开始位置（可选参数，不填默认从实际位置开始）
     */
    function translateAnimation(view, duration, end, start) {
        var tw = egret.Tween.get(view);
        if (start != undefined) {
            view.x = start.x;
            view.y = start.y;
        }
        tw.to({ x: end.x, y: end.y }, duration);
    }
    GCAnimation.translateAnimation = translateAnimation;
    /**
     * 放大缩小动画
     * @param view {egret.DisplayObject} 对象的属性集合
     * @param duration {number} 持续时间
     * @param end {Attributes.GCPrint} 动画停止位置
     * @param start? {Attributes.GCPront} 动画开始位置（可选参数，不填默认从实际位置开始）
     */
    function sizeAnimation(view, size) {
        var vw = view.width;
        var vh = view.height;
        view.width = vw * size.x;
        view.height = vh * size.y;
        view.x = view.x - (view.width - vw) / 2;
        view.y = view.y - (view.height - vh) / 2;
    }
    GCAnimation.sizeAnimation = sizeAnimation;
})(GCAnimation || (GCAnimation = {}));
//# sourceMappingURL=GameTouch.js.map