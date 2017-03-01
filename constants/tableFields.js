
const dict = {
    os: ['phoneCall','threePhone','sendMsg','sendMms','sendEmail',
        'celluarDataOn','celluarDataDev','celluarDataHint','celluarDataTrans','celluarDataTransHint',
        'wlanOn','wlanOnDev','wlanHint','wlanTransHint',

        'locationCall','locationHint','callRecording','localRecording',
        'shot','takePhoto','receiveMsg',
        'ctrlPhotoBookWD','ctrlPhoneRecordWD','ctrlMsgWD','ctrlMmsWD','ctrlAgendaWD',
        'ctrlPhotoBookR','ctrlPhoneRecordR','ctrlMsgR','ctrlMmsR','ctrlAgendaR',
        'ctrlInternetR',

        'osUpsAuthorize','osUpsHint','osUpsRoll','osIsolate','osVulnerability'
    ],
    interface:[
        'bluetoothOn','bluetoothCtrl','NFCOn','NFCCtrl',
        'bluetoothPairConn','bluetoothConnHint','NFCConnHint',
        'bluetoothTrans','NFCTrans',
        'wiredConnConfirm','usbSecure'

    ],
    userData: [
        'poweronPass','poweronLockPass','poweronLock',
        'fileAuthorize','dataEncrypt','dataDelete','dataRemoteLock',
        'dataRemoteDelete','dataLocalBackup','dataRemoteBackup'
    ]
}

const mapAndMerge = (arr)=>(arr.reduce((dic,field)=>{
    dic[field] = {type: Boolean,default: true};
    return dic;
},{}))

exports.fields = Object.keys(dict).reduce((prev,category)=>{
        prev[category] = mapAndMerge(dict[category])
        return prev;
    },{})
// console.log(exports.fields);

exports.flattenFields = Object.keys(exports.fields).reduce((prev,field)=>{
    prev = Object.assign({},prev,exports.fields[field])
    return prev;
},{})
// console.log(mapAndMerge(dict.userData))

exports.reportListColumns = {
    'updateTime':'update_at',
    'createTime': 'create_at',
    'inspector': 'basic.inspector',
    'inspectTime': 'basic.inspect_at',
    'taskName': 'basic.taskName',
    'terminalType': 'basic.terminalType',
    'creator': 'basic.creator_id'
}

/**********************************************************************************
接受前台数据，写入文件，生成markdown文件
*********************************************************************************/

/**
 * seq2Name全抽到第一层，到时候递归的时候直接取，不用网上回溯，嵌套回调了。
 */
const constants = {
    fieldToSeqDict:{
        'phoneCall':'4.3.1.1.1',
        'threePhone':'4.3.1.1.2',
        'sendMsg':'4.3.1.1.3',
        'sendMms':'4.3.1.1.4',
        'sendEmail':'4.3.1.1.5',
        'celluarDataOn':'4.3.1.1.6.1',
        'celluarDataDev':'4.3.1.1.6.2',
        'celluarDataHint':'4.3.1.1.6.3',
        'celluarDataTrans':'4.3.1.1.6.4',
        'celluarDataTransHint': '4.3.1.1.6.5',
        'wlanOn':'4.3.1.1.7.1',
        'wlanOnDev':'4.3.1.1.7.2',
        'wlanHint':'4.3.1.1.7.3',
        'wlanTransHint':'4.3.1.1.7.4',


        'locationCall':'4.3.1.2.1.1',
        'locationHint':'4.3.1.2.1.2',
        'callRecording':'4.3.1.2.2',
        'localRecording':'4.3.1.2.3',
        'shot':'4.3.1.2.4',
        'takePhoto':'4.3.1.2.5',
        'receiveMsg':'4.3.1.2.6',
        'ctrlPhotoBookWD':'4.3.1.2.7.1',
        'ctrlPhoneRecordWD':'4.3.1.2.7.1',
        'ctrlMsgWD':'4.3.1.2.7.3',
        'ctrlMmsWD':'4.3.1.2.7.4',
        'ctrlAgendaWD':'4.3.1.2.7.5',
        'ctrlPhotoBookR':'4.3.1.2.7.6',
        'ctrlPhoneRecordR':'4.3.1.2.7.7',
        'ctrlMsgR':'4.3.1.2.7.8',
        'ctrlMmsR':'4.3.1.2.7.9',
        'ctrlAgendaR':'4.3.1.2.7.11',
        'ctrlInternetR':'4.3.1.2.7.10',

        'osUpsAuthorize':'4.3.1.3.1',
        'osUpsHint':'4.3.1.3.2',
        'osUpsRoll':'4.3.1.3.3',
        'osIsolate':'4.3.1.3.4',
        'osVulnerability':'4.3.1.3.5',

        'bluetoothOn':'4.4.1.1.1',
        'bluetoothCtrl':'4.4.1.1.2',
        'NFCOn':'4.4.1.1.3',
        'NFCCtrl':'4.4.1.1.4',
        'bluetoothPairConn':'4.4.1.2',
        'bluetoothConnHint':'4.4.1.3.1',
        'NFCConnHint':'4.4.1.3.2',
        'bluetoothTrans':'4.4.1.4.1',
        'NFCTrans':'4.4.1.4.2',
        'wiredConnConfirm':'4.4.2.1',
        'usbSecure':'4.4.2.2',

        'poweronPass':'4.6.1.1',
        'poweronLockPass':'4.6.1.2',
        'poweronLock':'4.6.1.3',
        'fileAuthorize':'4.6.2',
        'dataEncrypt':'4.6.3',
        'dataDelete':'4.6.4',
        'dataRemoteLock':'4.6.5.1',
        'dataRemoteDelete':'4.6.5.2',
        'dataLocalBackup':'4.6.6.1',
        'dataRemoteBackup':'4.6.6.2'
    },
    seq2Name :{
        '4.3':'移动智能终端操作',
        '4.3.1':'安全调用控制能力',
        '4.3.1.1':'通信类功能受控机制',
        '4.3.1.1.1':'拨打电话受控机制',
        '4.3.1.1.2':'三方通话的受控机制',
        '4.3.1.1.3':'发送短信的受控机制',
        '4.3.1.1.4':'发送彩信的受控机制',
        '4.3.1.1.5':'发送邮件的受控机制',
        '4.3.1.1.6':'移动通信网络数据连接受控机制',
        '4.3.1.1.6.1':'移动通信网络数据连接开启/关闭的开关',
        '4.3.1.1.6.2':'移动通信网络数据连接开启/关闭的受控机制',
        '4.3.1.1.6.3':'移动通信网络数据连接状态提示',
        '4.3.1.1.6.4':'移动通信网络数据后台传送的受控机制',
        '4.3.1.1.6.5':'移动通信网络数据传送状态提示',
        '4.3.1.1.7':'WLAN网络连接受控机制',
        '4.3.1.1.7.1':'WLAN网络连接开启/关闭的开关',
        '4.3.1.1.7.2':'WLAN网络连接开启/关闭的受控机制',
        '4.3.1.1.7.3':'WLAN网络连接状态提示',
        '4.3.1.1.7.4':'WLAN网络数据传送状态提示',
        '4.3.1.2':'本地敏感功能受控机制',
        '4.3.1.2.1':'定位功能受控机制',
        '4.3.1.2.1.1':'调用定位功能的受控机制',
        '4.3.1.2.1.2':'定位功能的状态显示',
        '4.3.1.2.2':'通话录音功能受控机制',
        '4.3.1.2.3':'本地录音功能受控机制',
        '4.3.1.2.4':'后台截屏功能受控机制',
        '4.3.1.2.5':'拍照/摄像功能启动的受控机制',
        '4.3.1.2.6':'接收短信功能受控机制',
        '4.3.1.2.7':'对用户数据的操作受控机制',
        '4.3.1.2.7.1':'电话本数据写和删除操作的受控机制',
        '4.3.1.2.7.2':'通话记录写和删除操作的受控机制',
        '4.3.1.2.7.3':'短信数据写和删除操作的受控机制',
        '4.3.1.2.7.4':'彩信数据写和删除操作的受控机制',
        '4.3.1.2.7.5':'日程表数据写和删除操作的受控机制',
        '4.3.1.2.7.6':'电话本数据读操作的受控机制',
        '4.3.1.2.7.7':'通话记录读操作的受控机制',
        '4.3.1.2.7.8':'短信数据读操作的受控机制',
        '4.3.1.2.7.9':'彩信数据读操作的受控机制',
        '4.3.1.2.7.10':'上网记录读操作的受控机制',
        '4.3.1.2.7.11':'日程表数据读操作的受控机制',
        '4.3.1.3':'操作系统的更新',
        '4.3.1.3.1':'操作系统的更新——授权更新',
        '4.3.1.3.2':'拍照/操作系统的更新——风险提示',
        '4.3.1.3.3':'操作系统的更新——防回退机制',
        '4.3.1.4':'操作系统隔离',
        '4.3.1.5':'操作系统漏洞',

        '4.4':'移动智能终端外围接口安全能力',
        '4.4.1':'无线外围接口安全能力',
        '4.4.1.1':'无线外围接口开启/关闭受控机制',
        '4.4.1.1.1':'蓝牙接口开启/关闭的开关',
        '4.4.1.1.2':'蓝牙接口开启的受控机制',
        '4.4.1.1.3':'NFC接口开启/关闭的开关',
        '4.4.1.1.4':'NFC接口开启的受控机制',
        '4.4.1.2':'无线外围接口连接建立的确认机制',
        '4.4.1.2.1':'蓝牙配对连接的受控机制',
        '4.4.1.3':'无线外围接口连接状态提示',
        '4.4.1.3.1':'蓝牙接口连接状态显示',
        '4.4.1.3.2':'NFC接口连接提示',
        '4.4.1.4':'无线外围接口数据传输的受控机制',
        '4.4.1.4.1':'蓝牙接口数据传输受控机制',
        '4.4.1.4.2':'NFC接口数据传输受控机制',
        '4.4.2':'有线外围接口安全能力',
        '4.4.2.1':'有线外围接口连接建立的确认机制',
        '4.4.2.2':'U盘模式的安全机制',

        '4.6':'移动智能终端用户数据安全保护能力',
        '4.6.1':'移动智能终端的密码保护',
        '4.6.1.1':'开机密码保护',
        '4.6.1.2':'开机后锁定状态的密码保护',
        '4.6.1.3':'开机后锁定状态保护',
        '4.6.2':'文件类用户数据的授权访问',
        '4.6.3':'用户数据的加密存储',
        '4.6.4':'用户数据的彻底删除',
        '4.6.5':'用户数据的远程保护',
        '4.6.5.1':'用户数据的远程锁定',
        '4.6.5.2':'用户数据的远程删除',
        '4.6.6':'用户数据的转移备份',
        '4.6.6.1':'用户数据的本地备份',
        '4.6.6.2':'用户数据的远程备份'


    }
}
const arr = Object.keys(constants.seq2Name).map(key=>({path:key,name:constants.seq2Name[key]}));



/**
 *
 * @param item  {path,name,children} '4.3.2.1'
 * @returns {*}          '4.3.2'
 */
const getParentPath = item => {
    const arr = item.path.split('.');
    if(!arr.length) return '';
    return arr.slice(0,arr.length-1).join('.');
}


/**
 * 根据上面的信息（constants.seq2Name）转成nested数组
 * @param arr
 * @param parentPath
 * @param used
 * @returns {Array}
 */
const getNestedChildren = (arr,parentPath,used)=>{

    const temp = [];

    for(var i=0;i<arr.length;i++){

        const item = arr[i];
        if(used[item.path]) continue;

        const prefix = getParentPath(item);
        if(prefix===parentPath){
            const children = getNestedChildren(arr,item.path,used);
            item.children = children;
            // if(!dic[prefix]){
            //     dic[prefix]["name"] = constants.seq2Name(prefix);
            //     dic[prefix]["children"] = [];
            // }
            temp.push(item);
            // dic[prefix].children.push(item);
            used[item.path] = true;
        }

    }
    return temp;
}




// console.log(nestedDict);

const seq2Name = (function() {
    const dict = Object.keys(constants.fieldToSeqDict).reduce((d,field)=>{
        const seq = constants.fieldToSeqDict[field];
        d[seq] = field;
        return d;
    },{});
    return (seq)=> dict[seq];
})
const getReportValueBySeq = (seq,formData)=> formData[seq2Name(seq)]

// const template = [];
const arr2Markdown = (arr,result,formData,template)=>{
    // let template = [];
    if(!arr.length){
        template.push(result.join(''));
        result = [];
        return
    }
    for(let i=0;i<arr.length;i++){
        const item = arr[i];
        const len = item.path.split('.')
        const prefix = new Array(len).fill('#').join('')         //### 移动终端
        let curLine;

        //叶子节点,同时输出名字+结果值
        if(!item.children.length && formData[seq2Name(item.path)]){
            const value = getReportValueBySeq(item.path);
            curLine =  [item.name,'：', value,'\n'].join('');
        }else{
            curLine =  [prefix +' '+item.name,'\n'].join('');
        }

        result.push(curLine);

        if(item.children.length){
            arr2Markdown(item.children,result,template);
        }
        result.pop();
    }
}

exports.generateMarkdown = (formData)=>{
    const nestedArr = getNestedChildren(constants.seq2Name,'4',{});
    let template = [];
    arr2Markdown(nestedArr,[],formData,template);

    return template.join('');
}
