<p align="center">
  <img src="https://github.com/KimYuKyung16/cost_calculation/assets/81006438/3de3e232-f7ea-4faa-88f6-fa560c7c82d2" />
</p>

# Expensify
정산 관리를 도와주는 웹페이지입니다.
보통 여행을 다니거나 놀러다닐 때 돈을 사용하게 됩니다.
인원이 많아지고 지출 금액이 많아질수록 어디에 얼마를 사용했는지 기억도 잘 안나고 계산하기가 힘들어지는 경우가 많습니다. 그럴 경우 보다 편하게 정산을 정리해주고 개인별 지출 내역 또한 관리해줍니다. :money_with_wings:

<br/>

## Front-end 리포지토리
https://github.com/KimYuKyung16/cost_calculation_server

## 폴더 구조
MVC 패턴으로 구현하고자 했습니다.
```
📦config
 ┗ 📜db.js
📦src
 ┣ 📂controllers
 ┃ ┣ 📜authController.js
 ┃ ┣ 📜calculateController.js
 ┃ ┣ 📜costController.js
 ┃ ┣ 📜friendController.js
 ┃ ┣ 📜messageController.js
 ┃ ┗ 📜userController.js
 ┣ 📂errors
 ┃ ┣ 📜clientError.js
 ┃ ┣ 📜serverError.js
 ┃ ┗ 📜sessionError.js
 ┣ 📂middleware
 ┃ ┣ 📜confirmAuthentication.js
 ┃ ┣ 📜validateLogin.js
 ┃ ┗ 📜validateRegister.js
 ┣ 📂models
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📜addUser.js
 ┃ ┃ ┗ 📜findUser.js
 ┃ ┣ 📂calculate
 ┃ ┃ ┣ 📜addCalculate.js
 ┃ ┃ ┣ 📜changeBookmark.js
 ┃ ┃ ┣ 📜changeCompleteState.js
 ┃ ┃ ┣ 📜changeMyCompleteState.js
 ┃ ┃ ┣ 📜deleteCalculate.js
 ┃ ┃ ┣ 📜getCalculate.js
 ┃ ┃ ┣ 📜getCalculateComplete.js
 ┃ ┃ ┣ 📜getCalculateList_Type1.js
 ┃ ┃ ┣ 📜getCalculateList_Type2.js
 ┃ ┃ ┣ 📜getCalculateList_Type3.js
 ┃ ┃ ┣ 📜getCalculateList_Type4.js
 ┃ ┃ ┣ 📜getEachMemberCost.js
 ┃ ┃ ┣ 📜getMemberIdList.js
 ┃ ┃ ┣ 📜getMyCalculateList.js
 ┃ ┃ ┣ 📜getTotalCost.js
 ┃ ┃ ┗ 📜modifyCalculate.js
 ┃ ┣ 📂cost
 ┃ ┃ ┣ 📜addCost.js
 ┃ ┃ ┣ 📜deleteCost.js
 ┃ ┃ ┣ 📜getCostList.js
 ┃ ┃ ┗ 📜modifyCost.js
 ┃ ┣ 📂friend
 ┃ ┃ ┣ 📜acceptFriend.js
 ┃ ┃ ┣ 📜addFriend.js
 ┃ ┃ ┣ 📜deleteFriend.js
 ┃ ┃ ┣ 📜friendList.js
 ┃ ┃ ┣ 📜getReceivingList.js
 ┃ ┃ ┣ 📜getSearchedFriendList.js
 ┃ ┃ ┗ 📜getUserList.js
 ┃ ┣ 📂message
 ┃ ┃ ┣ 📜changeMessageReadable.js
 ┃ ┃ ┣ 📜deleteAllMessage.js
 ┃ ┃ ┣ 📜deleteMessage.js
 ┃ ┃ ┣ 📜getMessageList.js
 ┃ ┃ ┗ 📜getNonReadMessage.js
 ┃ ┗ 📂user
 ┃ ┃ ┣ 📜changeProfile.js
 ┃ ┃ ┗ 📜getUserInfo.js
 ┣ 📂routes
 ┃ ┣ 📜auth.js
 ┃ ┣ 📜calculate.js
 ┃ ┣ 📜cost.js
 ┃ ┣ 📜friend.js
 ┃ ┣ 📜index.js
 ┃ ┣ 📜message.js
 ┃ ┗ 📜user.js
 ┗ 📂utils
📜.env
📜app.js
📜cookieparse.js
📜package-lock.json
📜package.json
```