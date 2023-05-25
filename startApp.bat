cd "reactapp"
start cmd /k node index.js
cd ..
cd "CarCountAndSpeedReviewApp\CarSpeed.WebAPI\bin\Release\net7.0\publish"
start "CarSpeed.WebAPI" "CarSpeed.WebAPI.exe"
start "" "http://localhost:3000"