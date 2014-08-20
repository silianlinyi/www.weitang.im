define('area', function() {

    "use strict";
    var area = {
        "北京": ["朝阳区", "海淀区", "西城区", "东城区", "崇文区", "宣武区", "丰台区", "石景山区", "门头沟", "房山区",
            "通州区", "大兴区", "顺义区", "怀柔区", "密云区", "昌平区", "平谷区", "延庆县"
        ],
        "上海": ["黄浦区", "卢湾区", "徐汇区", "长宁区", "静安区", "闸北区", "虹口区", "杨浦区", "宝山区", "闵行区",
            "嘉定区", "浦东新区", "青浦区", "松江区", "金山区", "南汇区", "奉贤区", "普陀区", "崇明县"
        ],
        "天津": ["东丽区", "和平区", "河北区", "河东区", "河西区", "红桥区", "蓟县", "静海县", "南开区", "塘沽区",
            "西青区", "武清区", "津南区", "汉沽区", "大港区", "北辰区", "宝坻区", "宁河县"
        ],
        "重庆": ["万州区", "涪陵区", "梁平县", "南川区", "潼南县", "大足区", "黔江区", "武隆县", "丰都县", "奉节县",
            "开县", "云阳县", "忠县", "巫溪县", "巫山县", "石柱县", "彭水县", "垫江县", "酉阳县", "秀山县", "城口县",
            "璧山县", "荣昌县", "铜梁县", "合川区", "巴南区", "北碚区", "江津区", "渝北区", "长寿区", "永川区",
            "江北区", "南岸区", "九龙坡区", "沙坪坝区", "大渡口区", "綦江区", "渝中区", "高新区", "北部新区"
        ],
        "河北省": ["石家庄市", "邯郸市", "邢台市", "保定市", "张家口市", "承德市", "秦皇岛市", "唐山市", "沧州市",
            "廊坊市", "衡水市"
        ],
        "山西省": ["太原市", "大同市", "阳泉市", "晋城市", "朔州市", "晋中市", "忻州市", "吕梁市", "临汾市", "运城市",
            "长治市"
        ],
        "河南省": ["郑州市", "开封市", "洛阳市", "平顶山市", "焦作市", "鹤壁市", "新乡市", "安阳市", "濮阳市", "许昌市",
            "漯河市", "三门峡市", "南阳市", "商丘市", "周口市", "驻马店市", "信阳市", "济源市"
        ],
        "辽宁省": ["沈阳市", "大连市", "鞍山市", "抚顺市", "本溪市", "丹东市", "锦州市", "葫芦岛市", "营口市", "盘锦市",
            "阜新市", "辽阳市", "朝阳市", "铁岭市"
        ],
        "吉林省": ["长春市", "吉林市", "四平市", "通化市", "白山市", "松原市", "白城市", "延边州", "辽源市"],
        "黑龙江省": ["哈尔滨市", "齐齐哈尔市", "鹤岗市", "双鸭山市", "鸡西市", "大庆市", "伊春市", "牡丹江市", "佳木斯市",
            "七台河市", "黑河市", "绥化市", "大兴安岭地区"
        ],
        "内蒙古自治区": ["呼和浩特市", "包头市", "乌海市", "赤峰市", "乌兰察布市", "锡林郭勒盟", "呼伦贝尔市", "鄂尔多斯市",
            "巴彦淖尔市", "阿拉善盟", "兴安盟", "通辽市"
        ],
        "江苏省": ["南京市", "徐州市", "连云港市", "淮安市", "宿迁市", "盐城市", "扬州市", "泰州市", "南通市", "镇江市",
            "常州市", "无锡市", "苏州市"
        ],
        "山东省": ["济南市", "青岛市", "淄博市", "枣庄市", "东营市", "潍坊市", "烟台市", "威海市", "莱芜市", "德州市",
            "临沂市", "聊城市", "滨州市", "菏泽市", "日照市", "泰安市", "济宁市"
        ],
        "安徽省": ["铜陵市", "合肥市", "淮南市", "淮北市", "芜湖市", "蚌埠市", "马鞍山市", "安庆市", "黄山市", "滁州市",
            "阜阳市", "亳州市", "宿州市", "池州市", "六安市", "宣城市"
        ],
        "浙江省": ["宁波市", "杭州市", "温州市", "嘉兴市", "湖州市", "绍兴市", "金华市", "衢州市", "丽水市", "台州市", "舟山市"],
        "福建省": ["福州市", "厦门市", "三明市", "莆田市", "泉州市", "漳州市", "南平市", "龙岩市", "宁德市"],
        "湖北省": ["武汉市", "黄石市", "襄阳市", "十堰市", "荆州市", "宜昌市", "孝感市", "黄冈市", "咸宁市", "恩施州",
            "鄂州市", "荆门市", "随州市", "潜江市", "天门市", "仙桃市", "神农架林区"
        ],
        "湖南省": ["长沙市", "株洲市", "湘潭市", "韶山市", "衡阳市", "邵阳市", "岳阳市", "常德市", "张家界市", "郴州市",
            "益阳市", "永州市", "怀化市", "娄底市", "湘西州"
        ],
        "广东省": ["广州市", "深圳市", "珠海市", "汕头市", "韶关市", "河源市", "梅州市", "惠州市", "汕尾市", "东莞市",
            "中山市", "江门市", "佛山市", "清远市", "阳江市", "潮州市", "湛江市", "揭阳市", "茂名市", "肇庆市"
        ],
        "广西壮族自治区": ["南宁市", "柳州市", "桂林市", "梧州市", "北海市", "防城港市", "钦州市", "贵港市", "玉林市", "贺州市",
            "百色市", "河池市", "来宾市", "崇左市"
        ],
        "江西省": ["南昌市", "景德镇市", "萍乡市", "新余市", "九江市", "鹰潭市", "上饶市", "宜春市", "抚州市", "吉安市", "赣州市"],
        "四川省": ["成都市", "自贡市", "攀枝花市", "泸州市", "绵阳市", "德阳市", "广元市", "遂宁市", "内江市", "乐山市", "宜宾市",
            "广安市", "南充市", "达州市", "巴中市", "雅安市", "眉山市", "资阳市", "阿坝州", "甘孜州", "凉山州"
        ],
        "海南省": ["海口市", "儋州市", "琼海市", "万宁市", "东方市", "三亚市", "文昌市", "五指山市", "临高县", "澄迈县",
            "定安县", "屯昌县", "昌江县", "白沙县", "琼中县", "陵水县", "保亭县", "乐东县", "三沙市"
        ],
        "贵州省": ["贵阳市", "六盘水市", "遵义市", "铜仁市", "毕节市", "安顺市", "黔西南州", "黔东南州", "黔南州"],
        "云南省": ["昆明市", "曲靖市", "玉溪市", "昭通市", "普洱市", "临沧市", "保山市", "丽江市", "文山州", "红河州",
            "西双版纳州", "楚雄州", "大理州", "德宏州", "怒江州", "迪庆州"
        ],
        "西藏自治区": ["拉萨市", "那曲地区", "山南地区", "昌都地区", "日喀则地区", "阿里地区", "林芝地区"],
        "陕西省": ["西安市", "铜川市", "宝鸡市", "咸阳市", "渭南市", "延安市", "汉中市", "榆林市", "商洛市", "安康市"],
        "甘肃省": ["兰州市", "金昌市", "白银市", "天水市", "嘉峪关市", "平凉市", "庆阳市", "陇南市", "武威市", "张掖市",
            "酒泉市", "甘南州", "临夏州", "定西市"
        ],
        "青海省": ["西宁市", "海东地区", "海北州", "黄南州", "海南州", "果洛州", "玉树州", "海西州"],
        "宁夏回族自治区": ["银川市", "石嘴山市", "吴忠市", "固原市", "中卫市"],
        "新疆维吾尔自治区": ["乌鲁木齐市", "克拉玛依市", "石河子市", "吐鲁番地区", "哈密地区", "和田地区", "阿克苏地区",
            "喀什地区", "克孜勒苏州", "巴音郭楞州", "昌吉州", "博尔塔拉州", "伊犁州", "塔城地区", "阿勒泰地区", "五家渠市",
            "阿拉尔市", "图木舒克市"
        ],
        "台湾省": ["台北市", "高雄市", "台南市", "台中市", "金门县", "南投县", "基隆市", "新竹市", "嘉义市", "新北市",
            "宜兰县", "新竹县", "桃园县", "苗栗县", "彰化县", "嘉义县", "云林县", "屏东县", "台东县", "花莲县", "澎湖县"
        ],
        "香港特别行政区": ["香港岛", "九龙", "新界"],
        "澳门特别行政区": ["澳门半岛", "离岛"]
    };

    return area;

});