// TypeScript file
namespace core.component {

    export class ImageViewpager extends eui.Component {

        private _split: number;
        private _imgResList: Array<string>;
        private _imgWidth: number;

        //保存image集合
        private _imgList: Array<eui.Image>;
        private _imgMoveBeforeX: Array<number>;

        //用于计算图片位移
        private _offsetItemX: number;
        private _touchItem: eui.Image;
        private _indexItem: number;
        private _isMove: boolean;

        //item点击回调
        private _ipl: ImagePagerlistener;


        /**
         * 游戏滑动选择器
         * @param 控件大小  {eui.Group} 需要toast的对象
         * @param 图片间距      {string}    toast文字
         * @param 图片地址  {number}    toast显示时间 默认1.5秒
         * @param 监听器    {number}    toastY轴的位置，默认当前view的百分之70高度
         */
        public constructor(size: Point, imgWidth: number, split: number, imgResList: Array<string>, ipl: ImagePagerlistener) {
            super();
            //设置大小
            this.width = size.x;
            this.height = size.y;
            //初始化参数
            this._split = split;
            this._imgResList = imgResList;
            this._imgWidth = imgWidth;
            this._indexItem = 0;
            this._isMove = false;
            this._ipl = ipl;

            this._imgList = new Array<eui.Image>();
            this._imgMoveBeforeX = new Array<number>();

            //初始化页面
            this._initViewPager();
        }

        //初始化viewPager
        private _initViewPager() {
            for (let i = 0; i < this._imgResList.length; i++) {
                //渲染图片
                let imageItem = new eui.Image;
                this._imgList.push(imageItem);
                imageItem.source = this._imgResList[i];
                imageItem.width = this._imgWidth;
                imageItem.height = this.height;
                imageItem.verticalCenter = 0;
                imageItem.touchEnabled = true;

                //如果是第一张图片，居中显示。最后一张显示左边
                if (i == 0) {
                    imageItem.x = (this.width - this._imgWidth) / 2;
                } if (i == this._imgResList.length - 1) {
                    imageItem.x = this._imgList[0].x - (this._imgWidth + this._split);
                } else {
                    imageItem.x = this._imgList[0].x + (i * (this._imgWidth + this._split));
                }
                this.addChild(imageItem);

                this._imgMoveBeforeX.push(imageItem.x);

                //设置滑动监听器
                imageItem.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e: egret.TouchEvent) {
                    //当前选中的item
                    this._touchItem = imageItem;
                    //设置偏移量
                    this._offsetItemX = e.stageX - imageItem.x;
                    this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onItemgMove, this);
                    console.log("begin");
                }, this);

                //滑动结束监听
                imageItem.addEventListener(egret.TouchEvent.TOUCH_END, function (e: egret.TouchEvent) {
                    this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onItemgMove, this);
                    console.log("end");
                    //图片位置调整
                    for (let i = 0; i < this._imgList.length; i++) {
                        let item = this._imgList[i];
                        GCAnimation.translateAnimation(item, 200, { x: item.x + (this.width / 2 - this._imgList[this._indexItem].x - this._imgWidth / 2), y: item.y });
                    }
                    //设置监听
                    if (this._isMove) {
                        
                    }
                }, this);
            }
        }

        //移动时执行
        private onItemgMove(e: egret.TouchEvent): void {
            this._isMove = true;
            //当前选中item的下标
            let index = this._getIndex(this._touchItem);
            this._imgList[index].x = e.stageX - this._offsetItemX;
            for (let i = 0; i < this._imgResList.length; i++) {
                let num = i - index;
                if (num > 0) {
                    this._imgList[i].x = e.stageX - this._offsetItemX + (num * (this._imgWidth + this._split));
                } else if (num < 0) {
                    this._imgList[i].x = e.stageX - this._offsetItemX - (Math.abs(num) * (this._imgWidth + this._split));
                }
            }
            console.log("onMove");
            this.updateIndex();
            this.updateIndex();
            GCFilter.halo(this._imgList[this._indexItem]);
        }

        //获取当前下标
        private _getIndex(img: eui.Image): number {
            for (let i = 0; i < this._imgList.length; i++) {
                if (this._imgList[i] == img) {
                    return i;
                }
            }
        }

        //更新当前和x中心点最近的下标
        private updateIndex() {
            //判断和x中点最近的item下标
            for (let i: number = 0; i < this._imgList.length; i++) {
                if (Math.abs(this._imgList[i].x + this._imgWidth / 2 - this.width / 2) < Math.abs(this._imgList[this._indexItem].x + this._imgWidth / 2 - this.width / 2)) {
                    this._indexItem = i;
                }
                GCFilter.unHalo(this._imgList[i]);
            }

            //-----------无线循环------------(可以优化 )
            //计算左右两边item的下标
            let indLeft: number = this._indexItem - 1;
            if (indLeft < 0) {
                indLeft = indLeft + this._imgList.length;
            }
            let indRight: number = this._indexItem + 1;
            if (indRight > this._imgList.length - 1) {
                indRight = indRight - this._imgList.length;
            }

            //当前命中item
            let item = this._imgList[this._indexItem];

            //设置左右两边item的位置
            let leftSky = this._imgList[indLeft];
            let rightSky = this._imgList[indRight];
            leftSky.x = item.x - (leftSky.width + this._split);
            rightSky.x = item.x + (rightSky.width + this._split);
        };

    }

    //2D坐标
    export interface Point {
        readonly x: number;
        readonly y: number;
    }

    //主页控件接口
    export interface ImagePagerlistener {
        //选择切换监听
        selectIndex(selectIndex: number): void;
        //点击事件返回
        clickIndex(clickIndex: number): void;
    }
}

// TypeScript file
namespace GCFilter {

    /**
     * 光晕
     * @param view {egret.DisplayObject} 添加光晕的对象
     * @param color? {number} 光晕颜色（默认蓝色）
     * @param alpha? {number} 透明度 (默认0.8)
     */
    export function halo(view: egret.DisplayObject, color?: number, alpha?: number) {
        var colorGC: number = 0x33CCFF;        /// 光晕的颜色，十六进制，不包含透明度
        if (color != undefined) {
            colorGC = color;
        }
        var alphaGC: number = 0.2;             /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
        if (alphaGC != undefined) {
            alphaGC = alpha;
        }
        var blurX: number = 55;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
        var blurY: number = 35;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        var strength: number = 2;            /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        var quality: number = egret.BitmapFilterQuality.HIGH;        /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
        var inner: boolean = false;            /// 指定发光是否为内侧发光，暂未实现
        var knockout: boolean = false;            /// 指定对象是否具有挖空效果，暂未实现
        var glowFilter: egret.GlowFilter = new egret.GlowFilter(colorGC, alphaGC, blurX, blurY,
            strength, quality, inner, knockout);
        view.filters = [glowFilter];
    }

    /**
     * 取消光晕
     * @param view {egret.DisplayObject} （取消光晕的对象)
     */
    export function unHalo(view: egret.DisplayObject) {
        view.filters = undefined;
    }
}

//動畫封裝
namespace GCAnimation {

    /**
     * 平移动画
     * @param view {egret.DisplayObject} 对象的属性集合
     * @param duration {number} 持续时间
     * @param end {GCUtils.attributes.GCPrint} 动画停止位置
     * @param start? {GCUtils.attributes.GCPront} 动画开始位置（可选参数，不填默认从实际位置开始）
     */
    export function translateAnimation(view: egret.DisplayObject, duration: number, end: core.component.Point, start?: core.component.Point) {
        var tw = egret.Tween.get(view);
        if (start != undefined) {
            view.x = start.x;
            view.y = start.y;
        }
        tw.to({ x: end.x, y: end.y }, duration);
    }

    /**
     * 放大缩小动画
     * @param view {egret.DisplayObject} 对象的属性集合
     * @param duration {number} 持续时间
     * @param end {Attributes.GCPrint} 动画停止位置
     * @param start? {Attributes.GCPront} 动画开始位置（可选参数，不填默认从实际位置开始）
     */
    export function sizeAnimation(view: egret.DisplayObject, size: core.component.Point) {
        var vw: number = view.width;
        var vh: number = view.height;
        view.width = vw * size.x;
        view.height = vh * size.y;

        view.x = view.x - (view.width - vw) / 2;
        view.y = view.y - (view.height - vh) / 2;
    }
}
