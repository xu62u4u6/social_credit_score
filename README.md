# social_credit_score
### TODO
---
* [x] 修改標籤
* [x] DB架構
* [x] 獲取score圖表
* [x] 串接DB
* [x] 完成第三頁面切版
* [x] 前端JS functions
* [x] post到後端 
* [ ] 網址

### 架構
---
#### 主要架構
html - js前端 - express後端 - sqlite3 DB   
前端js透過RESTful API從資料庫中提取資料 

#### 首頁
1. 顯示分數圖表  
2. 點擊則刷新

#### 分數變更
1. 表單送出
2. INSERT到資料庫

#### 查看分數變更理由
1. 動態生成的userList變更user後送到後端
2. 抓取對應的資訊並在前端顯示