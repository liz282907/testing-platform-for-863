
```
(1)报告列表
url: yoursite.com/reports/
method: "get"
params:{
    pageSize:50,
    pageIndex:1,
    orderBy: "updateTime" |"inspectTime",   //选项：按频率|按时间
    desc: true,
    [filter:""]           //可选项         
}
```