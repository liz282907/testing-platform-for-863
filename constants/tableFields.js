
const dict = {
    os: ['phoneCall','threePhone','sendMsg','sendMms','sendEmail',
        'celluarDataOn','celluarDataDev','celluarDataHint','celluarDataTrans','celluarDataTransHint',
        'wlanOn','wlanOnDev','wlanHint',

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

const mapAndMerge = (arr)=>{
        return arr.reduce((dic,field)=>({type: Boolean,default: true}),{});
}

exports.fields = Object.keys(dict).reduce((prev,category)=>{
        prev[category] = mapAndMerge(dict[category])
        return prev;
    },{})
exports.flattenFields = Object.keys(exports.fields).reduce((prev,field)=>{
    prev = Object.assign({},prev,exports.fields[field])
    return prev;
},{})
