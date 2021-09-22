# user-auth

## Set user password
```powershell
$Env:AWS_ACCESS_KEY_ID=""
$Env:AWS_SECRET_ACCESS_KEY=""
$Env:AWS_DEFAULT_REGION="ap-southeast-2"

aws cognito-idp admin-set-user-password --user-pool-id USERPOOL_ID --username USER_ID --password PASSWORD --permanent
```
