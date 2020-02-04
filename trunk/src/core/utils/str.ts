
module core {

    export class str {

        /** 格式化文本参数 {0}{1}{...} => [0,1,2] */
        static format(str: string, ...args): string {
            for (let i = 0; i < args.length; i++) {
                var parent = "\\{" + i + "\\}";
                var reg = new RegExp(parent, "g")
                str = str.replace(reg, args[i]);
            }
            return str;
        }
    }
}