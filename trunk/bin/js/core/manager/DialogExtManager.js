var core;
(function (core) {
    class DialogExtMgr extends Laya.DialogManager {
        constructor() {
            super();
            /** 左侧打开界面时弹窗动画：构造函数时设置popupEffect = leftPopupEffHandler; */
            this.leftPopupEffHandler = new Handler(this, this.leftPopupEff);
            /** 左侧关闭界面时弹窗动画：构造函数时设置closeEffect = leftCloseEffHandler; */
            this.leftCloseEffHandler = new Handler(this, this.leftCloseEff);
            // 自定义遮罩关闭事件
            this.maskLayer.offAll();
            if (UIConfig.closeDialogOnSide) {
                this.maskLayer.on(Laya.Event.CLICK, this, this.closeOnSide);
            }
        }
        /** 模态关闭弹窗：点击边缘空白位置 */
        closeOnSide(event) {
            let dialog = this.getTopModelDialog();
            if (dialog && dialog.isModalClose && core.is.fun(dialog.close)) {
                dialog.close("side");
            }
        }
        /** 获取最上层第一个正式（如非GuideMask,GuideMask用来挖空去关闭底下的窗口）的窗口 */
        getTopModelDialog() {
            let len = this.numChildren;
            for (let i = len - 1; i >= 0; i--) {
                let dialog = this.getChildAt(i);
                if (dialog && dialog.isIgnore) {
                    continue;
                }
                return dialog;
            }
            return this.getChildAt(len - 1);
        }
        /**@private 发生层次改变后，重新检查遮罩层是否正确*/
        _checkMask() {
            // 重写_checkMask
            // _checkMask只在open与doclose的时候触发,但是当open时,还需要等重新排序childs,因为zOrder不同,所以maskLayer需要在zOrder最大的对象底下
            this.maskLayer.removeSelf();
            let len = this.numChildren;
            let maxZorder = -123456;
            for (let i = len - 1; i > -1; i--) {
                let dialog = this.getChildAt(i);
                if (dialog && dialog.isModal && dialog.zOrder > maxZorder) {
                    maxZorder = dialog.zOrder;
                }
            }
            for (let i = len - 1; i > -1; i--) {
                let dialog = this.getChildAt(i);
                if (dialog && dialog.isModal && dialog.zOrder == maxZorder) {
                    this.maskLayer.zOrder = dialog.zOrder;
                    this.addChildAt(this.maskLayer, i);
                    break;
                }
            }
        }
        leftPopupEff(dialog) {
            dialog.x = -dialog.width;
            dialog.alpha = 0.3;
            Laya.Tween.to(dialog, { x: 0, alpha: 1 }, 300, Laya.Ease.strongOut, Handler.create(this, this.doOpen, [dialog]));
        }
        ;
        leftCloseEff(dialog, type) {
            let endX = -dialog.width;
            Laya.Tween.to(dialog, { x: endX, alpha: 0.3 }, 300, Laya.Ease.strongOut, Handler.create(this, this.doClose, [dialog, type]));
        }
    }
    core.DialogExtMgr = DialogExtMgr;
})(core || (core = {}));
//# sourceMappingURL=DialogExtManager.js.map