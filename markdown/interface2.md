
```
(1)报告列表
url: yoursite.com/reports/
method: "get"
params:{
    pageSize:50,
    pageIndex:1,
    orderBy: "updateTime" |"inspectTime",   
    desc: true,
    [filter:'']           //可选项,默认搜索报告名         
}


response:
[
  {
    "items": {
      "phoneCall": true,
      "threePhone": true,
      ...
    },
    "basic": {
      "taskName": "testReport",
      "terminalType": "",
      ...
    },
    "creator": "luchen"
  },
  ...
]


```
2. 创建列表

```javascript
    url: yoursite/report/create
    post
    {
        basic:{
            "taskName": "testReport", //required
             "terminalType": "",
                  ...
        },
        items:{
        
        }
    }
    //success 201s
    {
                    success: '报告创建成功'
                }


```

