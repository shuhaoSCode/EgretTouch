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
        private offsetItemX: number;

        private _touchItem: eui.Image;

        /**
         * 游戏滑动选择器
         * @param 控件大小  {eui.Group} 需要toast的对象
         * @param 图片间距      {string}    toast文字
         * @param 图片地址  {number}    toast显示时间 默认1.5秒
         * @param 监听器    {number}    toastY轴的位置，默认当前view的百分之70高度
         */
        public constructor(size: Point, imgWidth: number, split: number, imgResList: Array<string>) {
            super();
            //设置大小
            this.width = size.x;
            this.height = size.y;
            //初始化参数
            this._split = split;
            this._imgResList = imgResList;
            this._imgWidth = imgWidth;

            this._imgList = new Array<eui.Image>();
            this._imgMoveBeforeX = new Array<number>();
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

                //如果是第一张图片，居中显示
                if (i == 0) {
                    imageItem.x = (this.width - this._imgWidth) / 2;
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
                    this.offsetItemX = e.stageX - imageItem.x;
                    this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onItemgMove, this);
                    console.log("begin");
                }, this);

                //滑动结束监听
                imageItem.addEventListener(egret.TouchEvent.TOUCH_END, function (e: egret.TouchEvent) {
                    this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onItemgMove, this);
                    console.log("end");
                    for(let i = 0; i < this._imgList.length; i++){
                        
                    }
                }, this);
            }
        }

        private onItemgMove(e: egret.TouchEvent): void {
            //当前选中item的下标
            let index = this._getIndex(this._touchItem);
            this._imgList[index].x = e.stageX - this.offsetItemX;
            for (let i = 0; i < this._imgResList.length; i++) {
                let num = i - index;
                if (num > 0) {
                    this._imgList[i].x = e.stageX - this.offsetItemX + (num * (this._imgWidth + this._split));
                } else if (num < 0) {
                    this._imgList[i].x = e.stageX - this.offsetItemX - (Math.abs(num) * (this._imgWidth + this._split));
                }
            }
        }

        //获取当前下标
        private _getIndex(img: eui.Image): number {
            for (let i = 0; i < this._imgList.length; i++) {
                if (this._imgList[i] == img) {
                    return i;
                }
            }
        }
    }

    //2D坐标
    export interface Point {
        readonly x: number;
        readonly y: number;
    }

}